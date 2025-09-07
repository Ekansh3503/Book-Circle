import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const createReview = async (reviewData) => {
    const { data } = await axios.post("/api/v1/review/create", reviewData);
    return data;
}

export const getreviewbyuserid = async (token) => {
    const { data } = await axios.post("/api/v1/review/getreviewbyid", {token});
    return data;
}

export const getreviewbybookid = async (token, bookId) => {
    const { data } = await axios.post("/api/v1/review/getreviewbybookid", { token, bookId });
    return data;
}