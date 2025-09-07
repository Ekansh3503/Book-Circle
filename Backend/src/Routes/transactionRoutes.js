import TransactionController from "../controller/transactionController.js";

import express from "express";
const router = express.Router();

router.post("/request", TransactionController.borrowRequest);
router.post("/cancel", TransactionController.requestcancel);
router.post("/accept", TransactionController.RequestApproval);
router.post("/drop", TransactionController.BookDropped);
router.post("/picked", TransactionController.BookPicked);
router.post("/initiatereturn", TransactionController.initiateReturnBook);
router.post("/return", TransactionController.returnBook);
router.post("/getborrowedlist", TransactionController.getBorrowedBooks);
router.post("/borrowinghistory", TransactionController.getBorrowingHistory);
router.post("/getrequestedlist", TransactionController.getBorrowingTransactionList);
router.post("/getlendinglist", TransactionController.getLendingTransactionList)

export default router;