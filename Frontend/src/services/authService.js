import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Function: Login
export const loginUser = async (email, password) => {
    const params = JSON.stringify({ email, password });
    const config = {
        headers: { "content-type": "application/json" },
    };
    const response = await axios.post("/api/v1/auth/login", params, config);
    return response.data;
}

// Function : MFA
export const verifyUser = async (userId, token) => {
    const params = JSON.stringify({ id: userId, token })
    const config = {
        headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post("/api/v1/auth/mfa", params, config);
    return response.data;
}

// Function : Set Password
export const SetPassword = async (password, token, name, phone_no) => {
    const params = JSON.stringify({ password, token, name, phone_no });
    const config = {
        headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post("/api/v1/auth/set-password", params, config);
    return response.data;
}

// Function : Forgot Password
export const EmailEnter = async (email) => {
    const params = JSON.stringify({ email });
    const config = {
        headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post("/api/v1/auth/forgot-password", params, config);
    return response.data;
}

// Function : Reset Password
export const resetPassword = async (password, token) => {
    const params = JSON.stringify({ password, token });
    const config = {
        headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post("/api/v1/auth/reset-password", params, config);
    return response.data;
}