import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/'; 

export const addLanguageService = async (languageData) => {
    try {
        
        console.log("Language Data:", languageData);
        const { data } = await axios.post("/api/v1/language/create", languageData);
        
        return data;
    } catch (error) {       
        console.error("Error adding Language:", error.response?.data || error.message);
        throw error;
    }   
}

export const updateLanguageService = async (languageData) => {
    try {
        const { data } = await axios.post(`/api/v1/language/update/`, languageData);
        
        return data;
    } catch (error) {
        console.error("Error updating Language:", error.response?.data || error.message);
        throw error;
    }
}

export const deleteLanguageService = async (languageData) => {
    try{
        const { data } = await axios.post('/api/v1/language/delete', languageData);
        return data; 
    } catch (error) {
        console.error("Error deleting Language:", error.response?.data || error.message);
        throw error;
    }
}

export const getLanguageService = async () => {
    try {
        const { data } = await axios.get("/api/v1/language/getalllanguage");
        console.log("Language Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Language:", error.response?.data || error.message);
        throw error;
    }
}

