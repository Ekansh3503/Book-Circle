import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  addCategoryService,
  updateCategoryService,
} from "../../services/categoryService"; // 🔁 make sure to implement this

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

function CategoryDialog({
  onCategoryAdded,
  onCategoryUpdated,
  categoryToEdit = null,
  open,
  setOpen,
}) {
  const isEditMode = !!categoryToEdit;

  const [name, setName] = useState(categoryToEdit?.CategoryName || "");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (isEditMode) {
      setName(categoryToEdit?.CategoryName || "");
    } else {
      setName("");
    }
  }, [categoryToEdit]);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setName("");
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let response;

      if (isEditMode) {
        const categoryData = { id: categoryToEdit.id, name: name.trim() };
        response = await updateCategoryService(categoryData);
      } else {
        const categoryData = { name: name.trim() };
        response = await addCategoryService(categoryData);
      }

      if (response.success) {
        setSnackbar({
          open: true,
          message: isEditMode
            ? "Category updated successfully!"
            : "Category added successfully!",
          type: "success",
        });

        if (isEditMode && onCategoryUpdated) onCategoryUpdated();
        else if (!isEditMode && onCategoryAdded) onCategoryAdded();

        setTimeout(() => {
          setSnackbar({ open: false, message: "", type: "success" });
          handleClose();
        }, 1000);
      } else {
        throw new Error(response.message || "Operation failed.");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
        type: "error",
      });
      setTimeout(
        () => setSnackbar({ open: false, message: "", type: "error" }),
        2000
      );
    }
  };

  return (
    <>
      <BootstrapDialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditMode ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="bg-br-blue-light" dividers>
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Name
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${
                errors.name ? "border border-red-500" : ""
              }`}
              placeholder="Category name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            className="bg-br-blue-medium text-white hover:bg-br-blue-dark"
          >
            {isEditMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Snackbar open={snackbar.open} autoHideDuration={2000}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}

export default CategoryDialog;
