import axios from "axios";

const ROLE_MAP = {
  "Super Admin": 0,
  "Club Admin": 1,
  "Member": 2,
};

export const setClubSession = async (clubId, role) => {

  const numericRole = typeof role === "string" ? ROLE_MAP[role] ?? -1 : role;

  const response = await axios.post(
    "http://localhost:3000/api/v1/club/select",
    { clubId, role: numericRole },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteSession = async() => {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/club/switchclub', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting session:", error);
    return null;
  }
}

export const checkSession = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/club/check', {
      withCredentials: true
    });
    return response.data;

  } catch (error) {
    console.log("No active Session");
    return { status: false, data: null };
  }
}