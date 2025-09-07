import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const getBorrowedList = async (token, page, limit) => {
  try {
    const { data } = await axios.post("api/v1/transaction/getborrowedlist", { token, page, limit });
    // console.log("Borrowed List Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching borrowed list:", error);
    throw error;
  }
};

export const getBorrowingHistory = async (token, page, limit) => {
  try {
    const { data } = await axios.post("api/v1/transaction/borrowinghistory", { token, page, limit });
    return data;
  } catch (error) {
    console.error("Error fetching borrowing history:", error);
    throw error;
  }
};

export const initiateReturn = async (transactionId, token) => {
  try {
    const payload = { transactionId, token };
    const { data } = await axios.post("api/v1/transaction/initiatereturn", payload);
    return data;
  } catch (error) {
    console.error("Error initiating return:", error);
    throw error;
  }
};

export const returnBook = async (transactionId, token) => {
  try {
    const { data } = await axios.post("api/v1/transaction/return", {
      transactionId,
      token,
    });
    return data;
  } catch (error) {
    console.error("Error returning book:", error);
    throw error;
  }
};

export const getBorrowingTransactionList = async (token, page, limit) => {
  try {
    const { data } = await axios.post("api/v1/transaction/getrequestedlist/", { token, page, limit });
    return data;
  } catch (error) {
    console.error("Error fetching borrowing transaction list:", error);
    throw error;
  }
};

export const getLendingTransactionList = async (token, page, limit) => {
  try {
    const { data } = await axios.post("api/v1/transaction/getlendinglist/", { token, page, limit });
    return data;
  } catch (error) {
    console.error("Error fetching lending transaction list:", error);
    throw error;
  }
};

export const approveTransaction = async (transactionId, token) => {
  try {
    const { data } = await axios.post("api/v1/transaction/accept", { transactionId, token });
    return data;
  } catch (error) {
    console.error("Error approving transaction:", error);
    throw error;
  }
};

export const dropTransaction = async (transactionId, token) => {
  try {
    const { data } = await axios.post("api/v1/transaction/drop", { transactionId, token });
    return data;
  } catch (error) {
    console.error("Error dropping transaction:", error);
    throw error;
  }
};

export const pickupTransaction = async (transactionId, token) => {
  try {
    const { data } = await axios.post("api/v1/transaction/picked", { transactionId, token });
    return data;
  } catch (error) {
    console.error("Error picking up transaction:", error);
    throw error;
  }
};

export const cancelTransaction = async (transactionId, token) => {
  try {
    const { data } = await axios.post("api/v1/transaction/cancel", { transactionId, token });
    return data;
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    throw error;
  }
};