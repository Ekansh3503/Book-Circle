import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../services/authService";
import { useCookies } from "react-cookie";
import { Alert } from "@mui/material";

function VerificationForm(props) {
    const [codeArray, setCodeArray] = useState(['', '', '', '', '', '']);
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];
    const [code, setCode] = useState();
    const [userId, setUserId] = useState(props.userId);
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const navigate = useNavigate();

    const [codeError, setCodeError] = useState();

    const handleCodeChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        if (codeError) {
            setCodeError('');
        }

        const newCodeArray = [...codeArray];
        newCodeArray[index] = value;
        setCodeArray(newCodeArray);
        setCode(newCodeArray.join(''));

        // Auto-focus next input
        if (value !== '' && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCodeArray = [...codeArray];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newCodeArray[index] = char;
        });
        setCodeArray(newCodeArray);
        setCode(newCodeArray.join(''));
    };

    const submitHandler = async () => {
        if (!userId) {
            setCodeError("Internal Server Error, Refresh the page")
            return;
        }
        if (!code) {
            setCodeError("Field cannot be empty");
            return;
        }
        if (!/^\d{6}$/.test(code)) {
            setCodeError("Code must be exactly 6 digits");
            return;
        }
        if (code?.length !== 6) {
            setCodeError("Please enter all 6 digits");
            return;
        }
        try {

            const data = await verifyUser(userId, code)

            console.log(data);
            if (data.success) {

                await setCookie("token", data.token, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "strict" });
                navigate("/club-selection");

            } else {
                setCodeError(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Verification error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setCodeError(error.response.data.message);
            } else {
                setCodeError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen rounded-2xl bg-br-blue-light mt-4">
            <div className="items-start flex flex-col">
                <p className="font-medium text-2xl text-br-blue-medium">Verify Your Account</p>
                <p className="font-medium text-md text-br-blue-medium">Please enter the 6-digit code sent to your email address.</p><div className="w-fit ">
                    {codeError && (
                        <div>
                            <Alert variant="outlined" severity="error">
                                {codeError}
                            </Alert>
                        </div>
                    )}
                    <div className="mt-8 ju">
                        <div className="mt-4">
                            <div className="flex gap-4 justify-between mt-2">
                                {codeArray.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center text-xl font-semibold bg-white rounded-lg border border-br-gray-light focus:border-br-blue-medium focus:ring-1 focus:ring-br-blue-medium outline-none"
                                        value={digit}
                                        placeholder="-"
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}

                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex flex-col gap-y-4">
                                <button
                                    className="py-3 cursor-pointer rounded-xl bg-br-blue-medium text-white text-md font-bold"
                                    onClick={submitHandler}
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerificationForm;
