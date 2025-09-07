import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

export const addCategoryService = async (categoryData) => {
  try {
    console.log("Category Data:", categoryData);
    const { data } = await axios.post("/api/v1/category/create", categoryData);

    return data;
  } catch (error) {
    console.error(
      "Error adding Category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCategoryService = async (categoryData) => {
  try {
    console.log("Category Data:", categoryData);
    const { data } = await axios.post("/api/v1/category/update", categoryData);

    return data;
  } catch (error) {
    console.error(
      "Error updating Category:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const deleteCategoryService = async (categoryData) => {
  try {
    const { data } = await axios.post("/api/v1/category/delete", categoryData);
    return data;
  } catch (error) {
    console.error("Error deleting category", 
      error.response?.data || error.message);
      throw error;
    
  }
}

export const getCategoryService = async () => {
  try {
    const { data } = await axios.get("/api/v1/category/getallcategory");
    return data;
  } catch (error) {
    console.error(
      "Error fetching Category:",
      error.response?.data || error.message
    );
    throw error;
  }
};
