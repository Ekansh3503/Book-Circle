import categoryController from "../controller/categoryController.js";
import express from "express";
const router = express.Router();

router.post("/create", categoryController.addCategory);
router.post("/update", categoryController.updateCategory);
router.post("/delete", categoryController.deleteCategory)
router.get("/getallcategory", categoryController.getCategories);

export default router