import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

export const fetchUserData = async (token) => {
  try {

    axios.defaults.baseURL = "http://localhost:3000/";

    const params = JSON.stringify({ token });
    const config = {
      headers: { "content-type": "application/json" },
    };

    const { data } = await axios.post("/api/v1/user/userdetail", params, config);

    if (data.success) {
      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone_no: data.user.phone_no,
        profile_image: data.user.profile_image,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchuserList = async (params, role) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

   

    const payload = {
      ...params,
      role: role,
    };

    const { data } = await axios.post("/api/v1/user/userlist", payload, config);

    if (data.success) {
      return {
        success: true,
        users: data.listusers || [],
        total: data.totalItems || 0,
      };
    } else {
      return {
        success: false,
        users: [],
        total: 0,
      };
    }
  } catch (error) {
    console.error("Error fetching user list:", error.message);
    throw error;
  }
};

export const addMemberService = async (memberData) => {
  try {

    console.log("Member Data:", memberData);
    const { data } = await axios.post("/api/v1/auth/add-user", memberData);

    return data;
  } catch (error) {
    console.error("Error adding member:", error.response?.data || error.message);
    throw error;
  }
};

export const getMemberDetails = async (userId, role) => {
  try {
      const response = await axios.post('/api/v1/user/listusers/memberDetails', {
          userId,
          role
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const editMemberDetails = async (userId, role, name, phone_no, updates) => {
  try {
      const response = await axios.post('/api/v1/user/listusers/editMemberDetails', {
          userId,
          role,
          name,
          phone_no,
          updates
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};


export const deactivateUser = async (userId, role) => {
  try {
    const data = {
      userId,
      role
    };

    const response = await axios.post('/api/v1/user/listusers/deleteMember', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteMember = async (userId, clubId, role) => {
  try {
    const data = {
      userId,
      clubId,
      role
    };

    const response = await axios.post('/api/v1/user/listusers/removeMember', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

