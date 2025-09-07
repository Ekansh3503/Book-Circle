import React, { useEffect, useState } from 'react'
import resetPasswordAsset from "../../assets/resetpasswordscreenAsset.png";
import { Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

function ResetPassword() {

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [passwordError, setPasswordError] = useState();
    const [passwordSuccess, setPasswordSuccess] = useState();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [navigate]);


    const submitHandler = async () => {
        if (!password || !confirmPassword) {
            setPasswordError("Password and Confirm password should not be empty");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;

        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError("Password must contain at least one special character.");
            return;
        }

        try {
            const data = await resetPassword(password, token);

            if (data.success) {
                setPasswordSuccess("Password Reset Successfully, Redirecting to Sign In page");

                setTimeout(() => {
                    navigate("/signin");
                }, 5000);
            }
        } catch (error) {
            console.error("Error occurred during password submission:", error);
            setPasswordError("An error occurred. Please try again.");
        }
    }

    useEffect(() => {
        setPasswordError("");
    }, [password, confirmPassword]);

    return (
        <div className="flex items-center justify-center w-full h-screen p-4">
            <div className="w-full h-screen flex flex-col items-center lg:w-1/2 bg-br-white py-4 px-2">
                <div
                    className="bg-br-blue-light items-center w-full py-6 px-4 text-2xl font-bold text-navyblue rounded-2xl"
                    style={{ height: "auto" }}
                >
                    BookCircle
                </div>
                <div className='flex flex-col justify-center px-28 w-full h-screen rounded-2xl bg-br-blue-light mt-4'>
                    <p className='font-medium text-2xl text-br-blue-medium mt-4'>Reset Password!</p>
                    <p className='font-medium text-md text-br-blue-medium pe-5'>Get access to the world of endless imagination.</p>
                    <div className='mt-4'>
                        {passwordError &&
                            <Alert variant="outlined" severity="error"> <b>{passwordError}</b>
                            </Alert>
                        }
                        {passwordSuccess &&
                            <Alert variant="outlined" severity="success">
                                {passwordSuccess}
                            </Alert>
                        }

                        <div className='mt-4'>
                            <label className='text-md font-medium text-br-blue-medium'>Enter New Password</label>
                            <div className='flex bg-white rounded-xl'>
                                <input
                                    className='w-full bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1'
                                    placeholder='Password'
                                    value={password ?? ""}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <label className='text-md font-medium text-br-blue-medium'>Confirm New Password</label>
                            <div className='flex bg-white rounded-xl'>
                                <input
                                    className='w-full bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1'
                                    placeholder='Confirm Password'
                                    value={confirmPassword ?? ""}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='mt-4 flex flex-col gap-y-4'>
                            <button className='py-3 rounded-xl cursor-pointer bg-br-blue-medium text-white text-md font-bold'
                                onClick={submitHandler}
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex w-1/2 h-screen items-center justify-center bg-white py-4 px-2">
                <div className="bg-br-blue-light flex items-center justify-center w-full h-full py-4 px-4 rounded-2xl">
                    <img
                        src={resetPasswordAsset}
                        style={{ height: "auto", maxHeight: "500px" }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
