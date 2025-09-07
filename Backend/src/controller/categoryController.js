import category from "../models/category.js";

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        const existingCategory = await category.findOne({ 
            where:{ CategoryName: name.toLowerCase() }
        });
        
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        const newCategory = await category.create({
            CategoryName: name.toLowerCase(),
        });

        res.status(201).json({
            success: true,
            category: newCategory,
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: "ID and Name are required",
            });
        }

        const categoryToUpdate = await category.findByPk(id);

        if (!categoryToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        categoryToUpdate.CategoryName = name.toLowerCase();
        await categoryToUpdate.save();

        res.status(200).json({
            success: true,
            category: categoryToUpdate,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required",
            });
        }

        const categoryToDelete = await category.findByPk(id);

        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await categoryToDelete.destroy();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await category.findAndCountAll();

        if (!categories) {
            return res.status(404).json({
                success: false,
                message: "No categories found",
            });
        }

        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export default { addCategory , updateCategory, deleteCategory, getCategories };