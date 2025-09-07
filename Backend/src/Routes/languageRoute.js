import languageController from "../controller/languageController.js";
import express from "express";
const router = express.Router();

router.post("/create", languageController.createLanguage);
router.post("/update", languageController.updateLanguage);
router.post("/delete", languageController.deleteLanguage);
router.get("/getalllanguage", languageController.getAllLanguage);

export default router;
