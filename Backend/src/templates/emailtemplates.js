const verificationCode = (code, username) => {
    return (
        `
  <!DOCTYPE html>
  <html lang="en">
  <head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #162546, #162546); padding: 20px; text-align: center; border-radius:12px 12px 0px 0px;">
      <h1 style="color: white; margin: 0;">Verify Your Email</h1>
    </div>
    <div style="background-color: #E0E8F0; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-radius:0px 0px 12px 12px;">
      <p>hello, <b>${username} </b></p>
      <p>Thank you for signing up! Your verification code is: </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #fff; padding: 12px 24px; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #162546; border: 2px dashed #162546; border-radius: 8px; font-family: monospace; user-select: all;">
          ${code}
        </span>
      </div>
      <p>Enter this code on the verification page to complete your registration.</p>
      <p>This code will expire in 15 minutes for security reasons.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br>BookCircle Team</p>
    </div>
    <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
  </html>
  ` )
}

const resetPassword = (resetURL, username) => {
  return (
    ` 
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #162546, #162546); padding: 20px; text-align: center; border-radius:12px 12px 0px 0px;">
    <h1 style="color: white; margin: 0;">Reset Password</h1>
  </div>
  <div style="background-color: #E0E8F0; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-radius:0px 0px 12px 12px;">
    <p>Hello  <b>${username}</b></p>
    <p>We received a request to reset your password for your BookCircle account. Don't worry, we're here to help! If you didn't make this request, please ignore this email.</p>
    <p>To Reset your password and regain access to your account, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetURL}" style="background-color: #162546; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br> <b>BookCircle Team </b></p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
  )
}



const setupaccount = (resetURL, username) => {
  return (
    ` 
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Set Your Password</title>
</head>
<body style="font-family: roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #162546, #162546); padding: 20px; text-align: center; border-radius:12px 12px 0px 0px;">
    <h1 style="color: white; margin: 0;">Set Password</h1>
  </div>
  <div style="background-color: #E0E8F0; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-radius:0px 0px 12px 12px;">
    <p>Hello  <b>${username}</b></p>
    <p>We received a request to Set your password. If you didn't make this request, please ignore this email.</p>
    <p>To Set your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetURL}" style="background-color: #162546; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br> <b>BookCircle Team </b></p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`
  )
}



export default {verificationCode, resetPassword, setupaccount}