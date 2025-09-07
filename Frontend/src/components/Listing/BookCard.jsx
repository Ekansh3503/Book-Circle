import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { MdOutlineDone } from "react-icons/md";
import { useCookies } from "react-cookie";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { TiDelete } from "react-icons/ti";
import { updateBookStatus, requestBook } from "../../services/bookService";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const BookCard = ({ id, title, author, coverUrl, isAvailable, rating, category, language, isActive, onStatusChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cookies] = useCookies(['token']);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);


  const clubId = useSelector((state => state.clubSession.clubId));
  const role = useSelector((state => state.clubSession.role));

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStatusDialogOpen = () => {
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const initiateStatusChange = () => {
    handleStatusDialogOpen();
  };

  const confirmStatusChange = async () => {
    await handleBookStatusChange(id, isActive);
    handleStatusDialogClose();
  };

  const handleBookStatusChange = async (bookId, isActive) => {

    if (clubId == null || role == null) {
      setSnackbar({
        open: true,
        message: "Authentication error",
        severity: "error"
      });
      return;
    }

    try {
      const data = await updateBookStatus({
        bookId,
        isActive,
        role,
        clubId
      });

      if (data.success) {
        setSnackbar({
          open: true,
          message: `Book successfully ${isActive ? 'deactivated' : 'activated'}`,
          severity: "success"
        });
        // trigger a refresh of the book list here
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update book status in bookcard",
        severity: "error"
      });
    }
  };

  const handleConfirm = async () => {
    const token = await cookies.token;

    if (!token) {
      setSnackbar({
        open: true,
        message: "Authentication error",
        severity: "error"
      });
      return;
    }

    try {
      const data = await requestBook({
        bookId: id,
        clubId,
        token
      });

      if (data.success) {
        setSnackbar({ open: true, message: data.message || "The book request has been successfully sent!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "Failed to send book request!", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Error requesting book", severity: "error" });
      console.error("Error requesting book:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-[var(--br-radius)] w-full p-4 hover:shadow-lg transition-shadow duration-300 border border-br-gray-light hover:cursor-pointer flex flex-col ">
      <div className="w-full h-[204px] 2xl:mb-0 xl:mb-4 lg:mb-4 md:mb-2  flex items-center justify-center flex-shrink-0">
        <img
          src={coverUrl || "https://via.placeholder.com/150"}
          alt={`${title} cover`}
          className="h-full w-auto object-contain rounded-md"
        />
      </div>

      <div className="flex flex-col justify-between h-fit md:mt-0 2xl:mt-1 flex-grow">
        <div>
          <h1 className="font-bold 2xl:text-lg xl:text-sm lg:text-sm line-clamp-1 overflow-hidden 2xl:mb-1 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 2xl:text-sm xl:text-xs lg:text-xs overflow-hidden 2xl:mb-1 mb-2">
            {author}
          </p>
        </div>

        <div className="flex flex-row 2xl:text-sm xl:text-xs lg:text-xs items-start space-x-2">
          <div className="w-fit bg-gray-200 py-1 px-2 rounded-md text-black font-semibold">{category}</div>
          <div className="w-fit bg-gray-200 py-1 px-2 rounded-md text-black font-semibold">{language}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center mt-2 space-x-1">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`w-4 h-4 ${index < Math.floor(rating)
                ? "text-yellow-400"
                : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-gray-500 text-sm">({rating})</span>
        </div>

        {role === 0 ? (
          // Super Admin only sees activate/deactivate button
          <button
            className={`w-full cursor-pointer flex justify-center items-center 2xl:text-base xl:text-sm lg:text-sm  
      text-white py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[var(--color-br-red-medium)] hover:bg-red-600' : 'bg-[var(--color-br-green-medium)] hover:bg-green-600'}`}
            onClick={initiateStatusChange}
          >
            {isActive ? <TiDelete size={20} /> : <MdOutlineDone size={20} />}
            <div className="flex items-center ml-3">
              <span className="font-bold">{isActive ? 'Deactivate Book' : 'Activate Book'}</span>
            </div>
          </button>
        ) : role === 1 ? (
          // Club Admin sees both buttons side by side
          <div className="flex gap-2">
            <button
              className={`w-3/4 bg-br-blue-medium 2xl:text-base xl:text-sm lg:text-sm hover:bg-br-blue-dark 
        text-white py-2 rounded-lg cursor-pointer transition-colors duration-200`}
              onClick={handleOpenDialog}
            >
              {isAvailable ? 'Borrow Now' : 'Request To Borrow'}
            </button>
            <button
              className={`w-1/4 cursor-pointer flex justify-center items-center 2xl:text-base xl:text-sm lg:text-sm  
        text-white py-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-[var(--color-br-red-medium)] hover:bg-red-600' : 'bg-[var(--color-br-green-medium)] hover:bg-green-600'}`}
              onClick={initiateStatusChange}
            >
              {isActive ? <TiDelete size={20} /> : <MdOutlineDone size={20} />}
            </button>
          </div>
        ) : (
          // Regular members only see borrow button
          <button
            className={`w-full bg-br-blue-medium 2xl:text-base xl:text-sm lg:text-sm hover:bg-br-blue-dark 
      text-white py-2 rounded-lg cursor-pointer transition-colors duration-200`}
            onClick={handleOpenDialog}
          >
            {isAvailable ? 'Borrow Now' : 'Request To Borrow'}
          </button>
        )}
      </div>

      {/* Borrow/Request Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isAvailable ? "Borrow Book" : "Request to Borrow"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {isAvailable ? "borrow" : "request to borrow"} "{title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
      >
        <DialogTitle>
          {isActive ? "Deactivate Book" : "Activate Book"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {isActive ? "deactivate" : "activate"} "{title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button
            onClick={confirmStatusChange}
            color={isActive ? "error" : "success"}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
    </div>
  );
};

export default BookCard;
