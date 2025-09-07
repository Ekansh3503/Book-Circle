import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import {
  getLanguageService,
  deleteLanguageService,
} from "../../services/languageService";

const Languages = ({ reloadKey, onEditLanguage }) => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await getLanguageService();
      setLanguages(response?.languages || []);
    } catch (error) {
      console.error("Error fetching languages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [reloadKey]);

  const handleDeleteClick = (lang) => {
    setSelectedLanguage(lang);
    setOpenDialog(true);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteLanguageService({ id: selectedLanguage.id });
      setSnackbar({
        open: true,
        message: res.message || "Deleted successfully",
        type: "success",
      });
      setOpenDialog(false);
      setSelectedLanguage(null);
      fetchLanguages();
    } catch (error) {
      const msg = error?.response?.data?.message || "Error deleting language";
      setSnackbar({ open: true, message: msg, type: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLanguage(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="h-full flex flex-col">
      {/* Header */}
      <Box className="bg-white flex flex-row items-center justify-between py-3 px-6 text-sm font-semibold text-br-gray-dark mb-1 border-br-gray-light rounded-t-xl">
        <div className="w-2/12">#</div>
        <div className="w-6/12">Language</div>
        <div className="w-4/12 text-right">Actions</div>
      </Box>

      {/* List */}
      <div className="flex-1 h-screen overflow-y-auto space-y-1 no-scrollbar rounded-b-xl">
        {loading ? (
          <Box className="p-4 text-center bg-white">
            <CircularProgress />
          </Box>
        ) : languages.count === 0 ? (
          <Box className="bg-white p-4 text-center">No languages found.</Box>
        ) : (
          languages.rows.map((lang, index) => (
            <Box
              key={lang.id}
              className="bg-white flex flex-row items-center py-4 px-4 text-sm hover:bg-gray-50 border-br-gray-light"
            >
              <div className="w-2/12">{index + 1}</div>
              <div className="w-6/12">{lang.LanguageName}</div>
              <div className="w-4/12 justify-end text-right flex space-x-2">
                <button
                  className="cursor-pointer px-3 flex gap-1 p-2 bg-br-blue-dark text-white rounded-lg hover:bg-br-blue-medium transition-colors duration-200"
                  onClick={() => onEditLanguage && onEditLanguage(lang)}
                >
                  <MdEdit size={18} />
                </button>
                <button
                  className="flex px-3 cursor-pointer text-white py-2 gap-1 rounded-lg bg-red-600 hover:bg-red-500 transition-colors duration-200"
                  onClick={() => handleDeleteClick(lang)}
                >
                  <TiDelete size={18} />
                </button>
              </div>
            </Box>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedLanguage?.LanguageName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.type} onClose={handleCloseSnackbar}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Languages;
