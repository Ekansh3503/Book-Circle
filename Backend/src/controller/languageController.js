import language from "../models/language.js";

const createLanguage = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name are required",
            });
        }

        // check if language already exists
        const existingLanguage = await language.findOne({
            where: { LanguageName: name.toLowerCase() },
        });

        if( existingLanguage) {
            return res.status(400).json({
                success: false,
                message: "Language already exists",
            });
        }

        const newLanguage = await language.create({
            LanguageName: name.toLowerCase(),
        });

        res.status(201).json({
            success: true,
            language: newLanguage,
        });
    } catch (error) {
        console.error("Error adding language:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


const updateLanguage = async (req, res) => {
    try {
        const { id, name } = req.body;
        
        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: "ID and Name are required",
            });
        }
        const languageToUpdate = await language.findByPk(id);
        if (!languageToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Language not found",
            });
        }

        languageToUpdate.LanguageName = name;
        await languageToUpdate.save();

        res.status(200).json({
            success: true,
            language: languageToUpdate,
        });


    } catch (error) {
        console.error("Error updating language:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required",
            });
        }

        const languageToDelete = await language.findByPk(id);

        if (!languageToDelete) {
            return res.status(404).json({
                success: false,
                message: "Language not found",
            });
        }

        await languageToDelete.destroy();

        res.status(200).json({
            success: true,
            message: "Language deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting language:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const getAllLanguage = async (req, res) => {
    try {
        const languages = await language.findAndCountAll();

        if (!languages) {
            return res.status(404).json({
                success: false,
                message: "No Language found",
            });
        }

        res.status(200).json({
            success: true,
            languages,
        });
    } catch (error) {
        console.error("Error fetching languages:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


export default { createLanguage , updateLanguage, deleteLanguage, getAllLanguage };