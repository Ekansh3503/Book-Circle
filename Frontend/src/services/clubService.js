import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

export const fetchClubList = async (token) => {
    if (!token) throw new Error("No token provided");

    const response = await axios.get("/api/v1/user/listclub",{
        withCredentials: true,
        headers: {
        Authorization: `Bearer ${token}`,  // Send token in the Authorization header
      }
    });
    return response.data;
};

export const fetchAllClubs = async (token) => {
  if (!token) throw new Error("No token provided");


  const response = await axios.get("/api/v1/user/allclubs",{
      withCredentials: true,
      headers: {
      Authorization: `Bearer ${token}`,  // Send token in the Authorization header
    }
  });
  return response.data;
};

export const fetchClubData = async (clubId) => {
  try {
    if (!clubId) return null;

    const params = JSON.stringify({ clubId });
    const config = {
      headers: { "content-type": "application/json" },
    };

    const { data } = await axios.post(
      "/api/v1/club/clubdetails",
      params,
      config
    );

    if (data.success) {
      return {
        id: data.club.id,
        club_name: data.club.club_name,
        club_contact_email: data.club.club_contact_email,
        club_thumbnail_url: data.club.club_thumbnail_url,
        club_location: data.club.club_location,
        club_status: data.club.club_status,
        created_at: data.club.created_at,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching club data:", error);
    return null;
  }
};

export const fetchClubs = async (params, role) => {
  try {
      const queryParams = new URLSearchParams(params);

      const { data } = await axios.post(`/api/v1/club/listclub?${queryParams}`, { role });

      if (data.success) {
          return {
              clubs: data.listclub.rows || [],
              count: data.listclub.count || 0,
              success: true
          };
      } else {
          return {
              clubs: [],
              count: 0,
              success: false
          };
      }
  } catch (error) {
      console.error('Error fetching clubs:', error);
      throw new Error('Failed to fetch clubs. Please try again later.');
  }
};

export const addClubService = async (clubData) => {
  try {

    const response = await axios.post("/api/v1/club/createclub", clubData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error adding club:", error);
    throw error;
  }
};

export const updateClubService = async (clubData) => {
  try {
    const response = await axios.post("/api/v1/club/updateclub", clubData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating club:", error);
    throw error;
  }
}

export const deleteClubService = async (clubId) => {
  try {
    const { data } = await axios.post(
      "/api/v1/club/deleteclub",
      { clubId },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error deleting club:", error);
    return null;
  }
}

