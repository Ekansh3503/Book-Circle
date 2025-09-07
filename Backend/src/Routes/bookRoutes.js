import express, { Router } from "express";
import bookController from "../controller/bookController.js";

const router = express.Router();

router.get('/booklist/:clubId', bookController.booklist);
router.post('/addbook', bookController.addBooks);
router.post('/updateBook', bookController.updateBook);
router.post('/dashboard-data', bookController.getDashboardStats);
router.post('/mybooks', bookController.myBooks);
router.post('/deactivateBook', bookController.toggleBookStatus);

export default router;