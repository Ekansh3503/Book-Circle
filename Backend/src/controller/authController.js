import { transporter, mailOptions } from '../config/nodemailer.js';
import crypto from 'crypto';
import emailTemplate from '../templates/emailtemplates.js';
import bcrypt from 'bcrypt';
import user from '../models/user.js';
import { Sequelize } from 'sequelize';
import jwt from '../jwt/jwt.js';
import club from '../models/club.js';
import clubuser from '../models/clubuser.js';

const AddUser = async (req, res) => {
    const body = req.body;

    if (
        body.userType === undefined ||
        body.name === undefined ||
        body.email === undefined ||
        body.phone_no === undefined ||
        body.clubId === undefined ||
        body.roleId === undefined
    ) {
        return res.status(400).json({
            status: "fail",
            message: "All fields are required",
        });
    }

    console.log("Add User Body: ", body);

    if (![0, 1].includes(body.userType)) {
        return res.status(400).json({
            status: "fail",
            message: "Access Forbidden",
        });
    }

    if (body.clubId === 1 && body.roleId !== 0) {
        return res.status(400).json({
            status: "fail",
            message: "Action Cannot be performed",
        });
    }

    if (body.clubId !== 1 && body.roleId === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Action Cannot be performed",
        });
    }

    const clubExists = await club.findByPk(body.clubId);
    if (!clubExists) {
        return res.status(400).json({
            success: false,
            message: "Club doesn't exist",
        });
    }

    const existingUser = await user.findOne({
        where: { email: body.email.toLowerCase() },
    });

    if (existingUser) {
        if (existingUser.status === 0) {
            return res.status(403).json({
                success: false,
                message: "User is deactivated",
            });
        }

        if (existingUser.phone_no !== body.phone_no) {
            return res.status(400).json({
                success: false,
                message: "Detail mismatch, please check the Details",
            });
        }

        const existingClubUser = await clubuser.findOne({
            where: {
                userId: existingUser.id,
                clubId: body.clubId,
            },
        });

        if (existingClubUser) {
            if (existingClubUser.role === body.roleId) {
                return res.status(409).json({
                    success: false,
                    message: "User Already Exists",
                });
            } else {
                existingClubUser.role = body.roleId;
                await existingClubUser.save();

                return res.status(200).json({
                    success: true,
                    message: "User role updated successfully",
                    data: existingUser,
                });
            }
        }

        await clubuser.create({
            userId: existingUser.id,
            clubId: body.clubId,
            role: body.roleId,
        });

        return res.status(201).json({
            success: true,
            message: "User added to club successfully",
            data: existingUser,
        });
    }

    // Create new user only after all validations
    const newUser = await user.create({
        userType: body.userType,
        name: body.name,
        email: body.email.toLowerCase(),
        phone_no: body.phone_no,
    });

    if (!newUser) {
        return res.status(400).json({
            success: false,
            message: "Internal Server Error",
        });
    }

    const clubuserAssociation = await clubuser.create({
        userId: newUser.id,
        clubId: body.clubId,
        role: body.roleId,
    });

    if (!clubuserAssociation) {
        await newUser.destroy();
        return res.status(400).json({
            success: false,
            message: "Internal Server Error",
        });
    }

    const setPasswordToken = await crypto.randomBytes(32).toString("hex");
    newUser.setPasswordToken = setPasswordToken;
    newUser.setPasswordTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const emailOptions = mailOptions(
        newUser.email,
        "Welcome to BookCircle",
        "Your Account is Created in BookCircle Application. Set Your Password to Login",
        emailTemplate.setupaccount(`${process.env.FRONTEND_URL}/set-password?token=${setPasswordToken}`, newUser.name)
    );

    transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email", error);
        } else {
            console.log("Email Sent Successfully", info.response);
        }
    });

    await newUser.save();

    return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: newUser,
    });
};

const setPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        if (!password || !token) {
            return res.status(400).json({
                success: false,
                message: "Password and Token are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least one special character"
            });
        }

        const result = await user.findOne({
            where: {
                setPasswordToken: token,
                setPasswordTokenExpiry: {
                    [Sequelize.Op.gt]: Date.now()
                }
            }
        })

        if (!result) {
            console.error('set-Password Error: ', result);
            return res.status(500).json({ message: 'Internal Server error' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        result.password = hashedPassword;
        result.setPasswordToken = null;
        result.setPasswordTokenExpiry = null;

        const response = await result.save();

        if (response) {
            res.status(200).json({ success: true, message: "password set Successful " });
        } else {
            res.status(400).json({ success: false, message: "Internal Server Error" });
        }

    } catch (error) {
        console.error('Set Password Error : ', error);
        res.status(500).json({ success: true, message: 'Server error' })
    }
}


function generate6DigitRandomNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await user.findOne({
            where: {
                email: email
            }
        });

        if (result) {

            const isActive = result.status;
            if (!isActive) {
                return res.status(403).json({
                    success: false,
                    message: "User is deactivated"
                });
            }

            const passwordMatch = await bcrypt.compare(password, result.password);

            if (passwordMatch) {
                const verificationToken = await generate6DigitRandomNumber().toString()
                const response = await user.findByPk(result.id)

                if (response) {
                    const newData = await user.update({
                        verificationToken: verificationToken,
                        verificationTokenExpiry: Date.now() + 15 * 60 * 1000
                    }, {
                        where: {
                            id: result.id
                        }
                    })
                    if (newData) {
                        const emailOptions = mailOptions(
                            response.email,
                            "Verification Code",
                            `Your verification token is ${verificationToken}`,
                            emailTemplate.verificationCode(verificationToken, response.name)
                        );
                        transporter.sendMail(emailOptions, (error, info) => {
                            if (error) {
                                return console.log(`Error occured`, error);
                            }
                            console.log("Email Sent Successfully", info.response);
                        })
                        res.status(200).json({
                            message: "Login Successful",
                            userId: response.id,
                            success: true,
                        })
                    } else {
                        res.status(500).json({ message: 'Server Error ' })
                        console.error('Email verification Error')
                    }
                } else {
                    res.status(500).json({ message: 'Server Error ' })
                    console.error('Email verification Error')
                }
            } else {
                res.status(403).json({ message: "Invalid Credentials" })
            }
        } else {
            res.status(403).json({ message: "User not Found" })
        }
    } catch (error) {
        console.error('Login Error : ', error);
        res.status(500).json({ message: 'Server error' })
    }
}

const mfa = async (req, res) => {
    try {
        const { id, token } = req.body;

        const result = await user.findOne({
            where: {
                id: id,
                verificationToken: token,
                verificationTokenExpiry: {
                    [Sequelize.Op.gt]: Date.now()
                }
            }
        })

        if (result) {
            result.verificationToken = null;
            result.verificationTokenExpiry = null;

            const response = await result.save();

            if (response) {
                const payload = {
                    id: result.id,
                    email: result.email
                }
                const token = await jwt.generateToken(payload)

                res.status(200).json({ success: true, message: "Login Successful ", token: token, userid: result.id });
            } else {
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        } else {
            res.status(401).json({ success: false, message: "incorrect code" });
        }
    } catch (error) {
        console.error('mfa Error : ', error);
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await user.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'email', 'name']
        });

        // console.log('Reset Password result: ', result);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetPasswordToken = await crypto.randomBytes(32).toString("hex");

        const updateResult = await user.update({
            setPasswordToken: resetPasswordToken,
            setPasswordTokenExpiry: Date.now() + 1 * 60 * 60 * 1000
        }, {
            where: {
                id: result.id
            }
        });

        if (!updateResult) {
            return res.status(500).json({
                success: false,
                message: "Failed to update reset token"
            });
        }

        const emailOptions = mailOptions(
            result.email,
            "Reset Your Password - BookCircle",
            `Reset Your Password to Login`,
            emailTemplate.resetPassword(process.env.FRONTEND_URL + '/reset-password?token=' + resetPasswordToken, result.name),
        );
        transporter.sendMail(emailOptions, (error) => {
            if (error) {
                console.error(`Email sending failed`, error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send reset email"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Reset password link has been sent to your email"
            });
        })
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        if (!password || !token) {
            return res.status(400).json({
                success: false,
                message: "Password and Token are required"
            });
        }

        const result = await user.findOne({
            where: {
                setPasswordToken: token,
                setPasswordTokenExpiry: {
                    [Sequelize.Op.gt]: Date.now()
                }
            }
        });

        if (!result) {
            console.error('Reset-Password Error: ', result);
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        result.password = hashedPassword;
        result.setPasswordToken = null;
        result.setPasswordTokenExpiry = null;

        const response = await result.save();

        if (response) {
            res.status(200).json({
                success: true,
                message: "Password reset successful"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to reset password"
            });
        }

    } catch (error) {
        console.error('Reset Password Error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export default { AddUser, setPassword, login, mfa, forgotPassword, resetPassword }
