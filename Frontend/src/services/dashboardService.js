import axios from 'axios';

axios.defaults.baseURL = "http://localhost:3000/";

export const getDashboardStats = async (token, userRole) => {
    try {
        const response = await axios.post("/api/v1/book/dashboard-data",
            { token, userRole }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: 'Failed to fetch dashboard statistics'
        };
    }
};