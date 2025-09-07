import { Box, CircularProgress, IconButton, Rating, Snackbar, styled } from "@mui/material";
import { CornerDownLeft, Undo2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CloseIcon from "@mui/icons-material/Close";
import Pagination from "../../components/Pagination/Pagination";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import {
  getBorrowedList,
  getBorrowingHistory,
  initiateReturn,
  returnBook
} from "../../services/transactionService";
import { createReview, getreviewbybookid } from "../../services/reviewService";
import MuiAlert from "@mui/material/Alert";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    overflow: "visible",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
    overflow: "visible",
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function UserBorrowedList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [cookies] = useCookies(['token']);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [hasReadBook, setHasReadBook] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0)
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalResults, setHistoryTotalResults] = useState(0);
  const [touched, setTouched] = useState({
    reviewTitle: false,
    reviewText: false,
    rating: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const validate = () => {
    const errors = {};
    if (hasReadBook) {
      if (!reviewTitle.trim()) {
        errors.reviewTitle = "Review title is required.";
      }
      if (!reviewText.trim()) {
        errors.reviewText = "Review is required.";
      }
      if (rating <= 0) {
        errors.rating = "Rating must be greater than 0.";
      }
    }
    return errors;
  };

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const token = cookies.token;
      const limit = 10;
      const data = await getBorrowedList(token, currentPage, limit);
      // console.log("Fetched borrowed books:", data);
      if (data.success) {
        const list = Array.isArray(data.list) ? data.list : data.list ? [data.list] : [];
        setBorrowedBooks(list);
        setTotalResults(data.total || list.length);
      }
    } catch (err) {
      setError("Failed to fetch borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowingHistory = async () => {
    try {
      setLoading(true);
      const token = cookies.token;
      const limit = 10;
      const data = await getBorrowingHistory(token, historyPage, limit);
      if (data.success) {
        const list = Array.isArray(data.list) ? data.list : data.list ? [data.list] : [];
        setBorrowingHistory(list);
        setHistoryTotalResults(data.total || list.length);
      }
    } catch (err) {
      setError("Failed to fetch borrowing history.");
    } finally {
      setLoading(false);
    }
  };


  const handleOpenDialog = async (transactionId, bookId) => {
    const token = cookies.token;

    setCurrentTransactionId(transactionId);
    setOpenDialog(true);

    // Reset existing values
    setReviewTitle("");
    setReviewText("");
    setRating(0);
    setHasReadBook(false);

    try {
      const res = await getreviewbybookid(token, bookId);
      if (res.success && res.reviews) {
        console.log("Review exists for this book:", res.reviews);
        setHasReadBook(true); // Check the box if review exists
        setReviewTitle(res.reviews.reviewTitle || "");
        setReviewText(res.reviews.reviewText || "");
        setRating(res.reviews.rating || 0);
      }
    } catch (err) {
      console.log("Failed to prefill review", err);
    }
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setHasReadBook(false);
    setReviewTitle("");
    setReviewText("");
    setRating(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBorrowedBooks(page);
  };

  const handleHistoryPageChange = (page) => {
    setHistoryPage(page);
    fetchBorrowingHistory(page);
  };

  useEffect(() => {
    fetchBorrowedBooks(currentPage);
    fetchBorrowingHistory(historyPage);
  }, [currentPage]);

  const handleInitiateReturnWithReview = async () => {
    const token = cookies.token;

    if (hasReadBook) {
      setTouched({ reviewText: true, reviewTitle: true, rating: true });
      const errors = validate();
      if (Object.keys(errors).length > 0) {
        return;
      }
    }

    try {
      await initiateReturn(currentTransactionId, token);

      setSnackbar({ open: true, message: "Return initiated successfully", type: "success" });

      if (hasReadBook) {
        await createReview({
          token,
          transactionId: currentTransactionId,
          reviewTitle,
          reviewText,
          rating,
        });

        setSnackbar({ open: true, message: "Review submitted successfully", type: "success" });
      }

      fetchBorrowedBooks();
      fetchBorrowingHistory();
      handleCloseDialog();
    } catch (error) {
      console.error("Error during return/review", error);
      setSnackbar({ open: true, message: "Error submitting return or review", type: "error" });
    }
  };



  const handleReturn = async (transactionId) => {
    try {
      const token = cookies.token;
      await returnBook(transactionId, token);
      setSnackbar({ open: true, message: "Book returned successfully", type: "success" });
      fetchBorrowedBooks();
      fetchBorrowingHistory();
    } catch {
      setSnackbar({ open: true, message: "Return failed", type: "error" });
    } finally {
      setTimeout(() => setSnackbar({ open: false, message: "", type: "" }), 2000);
    }
  };


  const renderActionButtonLender = (status, transactionId, bookId) => {
    switch (status) {
      case '5': // Requested
        return (
          <button
            className=" hover:bg-br-blue-dark flex flex-row items-center justify-end  bg-br-blue-medium gap-1 p-2 rounded-lg text-sm text-white"
            onClick={() => handleOpenDialog(transactionId, bookId)}
          >
            <CornerDownLeft size={18} />
            Initiate Return
          </button>
        );
      case '6': // Approved
        return (
          <button
            className=" hover:bg-br-blue-dark flex flex-row items-center justify-end  bg-br-blue-medium gap-1 p-2 rounded-lg text-sm text-white"
            onClick={() => handleReturn(transactionId)}
          >
            <Undo2 size={18} />
            Return
          </button>
        );
      default:
        return null;
    }
  };

  function getDueDateClass(pickupDateString) {
    if (!pickupDateString) return "bg-gray-100 text-gray-800";

    const pickupDate = new Date(pickupDateString);
    const dueDate = new Date(pickupDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining > 10) {
      return "bg-gray-100 text-gray-800";
    } else if (daysRemaining >= 0) {
      return "bg-orange-100 text-orange-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  }

  return (
    <Box className="rounded-xl p-0 w-full">
      <Box className="flex flex-row rounded-xl py-4 px-6 items-center">
        <div className="text-lg font-bold">Borrowed Books</div>
      </Box>
      <Box
        sx={{ borderBottom: 3, borderColor: "divider" }}
        className="w-full"
      ></Box>


      <Box className="flex flex-row items-center justify-center py-3 px-4 text-sm font-semibold text-br-gray-dark">
        <div className="w-3/12">Title</div>
        <div className="w-1/12">Author</div>
        <div className="w-2/12">ISBN</div>
        <div className="w-1/12">Rating</div>
        <div className="w-1/12">Language</div>
        <div className="w-2/12">Category</div>
        <div className="w-1/12">Due Date</div>
        <div className="w-2/12 text-right">Actions</div>
      </Box>

      <Box
        sx={{ borderBottom: 3, borderColor: "divider" }}
        className="w-full"
      ></Box>

      {loading ? (
        <Box className="p-4 text-center"><CircularProgress /></Box>
      ) : error ? (
        <Box className="p-4 text-center text-red-600">{error}</Box>
      ) : borrowedBooks.length === 0 ? (
        <Box className="p-4 text-center">No books found.</Box>
      ) : (
        <>
          {borrowedBooks.map((book, index) => (
            <React.Fragment key={book._id || index}>
              <Box className="flex flex-row items-center py-3 px-4 text-sm hover:bg-gray-50">
                <div className="w-3/12 truncate">{book.book.title || "N/A"}</div>
                <div className="w-1/12 truncate">{book.book.author || "N/A"}</div>
                <div className="w-2/12 truncate">{book.book.ISBN || "N/A"}</div>
                <div className="w-1/12">({book.book.rating || 0}/5)</div>
                <div className="w-1/12 truncate">{book.book.language?.LanguageName || "N/A"}</div>
                <div className="w-2/12 truncate">{book.book.category?.CategoryName || "N/A"}</div>
                <div className="w-1/12">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getDueDateClass(book.pickupDate)}`}
                  >
                    {book.pickupDate
                      ? new Date(new Date(book.pickupDate).setMonth(new Date(book.pickupDate).getMonth() + 1)).toLocaleDateString()
                      : "N/A"}

                </span>
              </div>
              <div className="w-2/12 text-right justify-end flex flex-row items-center gap-2">
                {renderActionButtonLender(book.status, book.id, book.bookId)}
              </div>
            </Box>
            <Box
              sx={{ borderBottom: 1, borderColor: "divider" }}
              className="w-full"
            ></Box>
          </React.Fragment>
        ))}
        {borrowedBooks.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              onPageChange={handlePageChange}
              className="rounded-2xl"
            />
          )}
        </>
      )}

      <Box
        sx={{ borderBottom: 3, borderColor: "divider" }}
        className="w-full"
      ></Box>
      <Box className="flex flex-row rounded-xl py-4 px-6 items-center">
        <div className="text-lg font-bold">Borrowing History</div>
      </Box>
      <Box
        sx={{ borderBottom: 3, borderColor: "divider" }}
        className="w-full"
      ></Box>
      <Box className="flex flex-row items-center justify-center py-3 px-4 text-sm font-semibold text-br-gray-dark">
        <div className="w-3/12">Title</div>
        <div className="w-1/12">Author</div>
        <div className="w-2/12">ISBN</div>
        <div className="w-1/12">Rating</div>
        <div className="w-1/12">Language</div>
        <div className="w-2/12">Category</div>
        <div className="w-1/12">Status</div>
        <div className="w-2/12 text-right"></div>
      </Box>

      <Box
        sx={{ borderBottom: 3, borderColor: "divider" }}
        className="w-full"
      ></Box>

      {loading ? (
        <Box className="p-4 text-center"><CircularProgress /></Box>
      ) : error ? (
        <Box className="p-4 text-center text-red-600">{error}</Box>
      ) : borrowingHistory.length === 0 ? (
        <Box className="p-4 text-center">No books found.</Box>
      ) : (
        <>
          {borrowingHistory.map((book, index) => (
            <React.Fragment key={book._id || index}>
              <Box className="flex flex-row items-center py-3 px-4 text-sm hover:bg-gray-50">
                <div className="w-3/12 truncate">{book.book.title || "N/A"}</div>
                <div className="w-1/12 truncate">{book.book.author || "N/A"}</div>
                <div className="w-2/12 truncate">{book.book.ISBN || "N/A"}</div>
                <div className="w-1/12">{book.book.rating || 0}</div>
                <div className="w-1/12 truncate">{book.book.language.LanguageName || "N/A"}</div>
                <div className="w-2/12 truncate">{book.book.category.CategoryName || "N/A"}</div>
                <div className="w-1/12">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${book.book.IsAvailable === true
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {book.book.IsAvailable === true ? "Availabe" : "Not Available"}
                  </span>
                </div>
                <div className="w-2/12 text-right justify-end flex flex-row items-center gap-2">

                </div>
              </Box>
              <Box
                sx={{ borderBottom: 1, borderColor: "divider" }}
                className="w-full"
              ></Box>
            </React.Fragment>

          ))}
          {borrowingHistory.length > 0 && (
            <Pagination
              currentPage={historyPage}
              totalResults={historyTotalResults}
              onPageChange={handleHistoryPageChange}
              className="rounded-2xl"
            />
          )}
        </>
      )}


      <BootstrapDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Initiate Return</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers className="bg-br-blue-light space-y-4 flex flex-col w-124">
          <FormControlLabel
            control={
              <Checkbox
                checked={hasReadBook}
                onChange={(e) => setHasReadBook(e.target.checked)}
              />
            }
            label="I have read the book"
          />

          {hasReadBook && (
            <>
              <label className="text-md font-medium text-br-blue-medium text-start w-full">
                Rating
              </label>
              <Rating
                name="size-large"
                value={rating}
                size="large"
                onChange={(event, newValue) => setRating(newValue)}
              />
              {touched.rating && rating <= 0 && (
                <p className="text-xs text-red-500 text-start w-full mt-1">Rating must be greater than 0</p>
              )}

              <div className="flex flex-col items-center">
                <label className="text-md font-medium text-br-blue-medium text-start w-full">
                  Review
                </label>
                <input 
                  className="w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 mb-2"
                  placeholder="Write a review"
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => {
                    setReviewTitle(e.target.value);
                    setTouched({ ...touched, reviewTitle: true });
                  }}
                />
                {touched.reviewTitle && !reviewTitle.trim() && (
                  <p className="text-xs text-red-500 text-start w-full mt-1">Review title is required</p>
                )}
                <textarea
                  className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1`}
                  placeholder="Write how you felt about the book"
                  type="text"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    setTouched({ ...touched, reviewText: true });
                  }}
                />
                {touched.reviewText && !reviewText.trim() && (
                  <p className="text-xs text-red-500 text-start w-full mt-1">Review is required</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleInitiateReturnWithReview} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Snackbar open={snackbar.open} autoHideDuration={2000}>
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserBorrowedList;