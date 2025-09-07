import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Camera, Plus } from "lucide-react";
import { addClubService } from "../../services/clubService";

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

function ClubDialog({ onClubAdded }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setClubName("");
    setEmail("");
    setLocation("");
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!clubName.trim()) newErrors.clubName = "Club name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!location.trim()) newErrors.location = "Location is required.";
    if (!image) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("club_name", clubName.trim());
    formData.append("club_contact_email", email.trim());
    formData.append("club_location", location.trim());

    try {
      const response = await addClubService(formData);

      if (response?.data?.success) {
        setSnackbar({
          open: true,
          message: "Club added successfully!",
          type: "success",
        });
        if (onClubAdded) onClubAdded();
        setTimeout(() => {
          setSnackbar({ open: false, message: "", type: "success" });
          handleClose();
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.data?.message || "Failed to add club.",
          type: "error",
        });

        setTimeout(() => {
          setSnackbar({ open: false, message: "", type: "success" });
          handleClose();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Something went wrong.",
        type: "error",
      });

      setTimeout(() => {
        setSnackbar({ open: false, message: "", type: "success" });
        handleClose();
      }, 1000);
    }
  };

  return (
    <>
      <button
        className="cursor-pointer hover:bg-br-blue-dark flex flex-row items-center justify-end bg-br-blue-medium border border-1 border-br-blue-dark gap-1 px-3 py-2 rounded-xl text-md text-white"
        onClick={handleOpen}
      >
        <Plus size={18} />
        Add Club
      </button>

      <BootstrapDialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }}>Add New Club</DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers className="bg-br-blue-light space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Club Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              type="button"
              className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-br-blue-medium rounded-lg bg-white hover:bg-gray-100 transition-colors"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <Camera className="text-br-blue-medium" size={32} />
              )}
            </button>
            {errors.image && (
              <span className="text-red-600 text-sm mt-1">{errors.image}</span>
            )}
          </div>

          {/* Club Name */}
          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Club Name
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${
                errors.clubName ? "border border-red-500" : ""
              }`}
              placeholder="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
            />
            {errors.clubName && (
              <span className="text-red-600 text-sm mt-1">
                {errors.clubName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Contact Email
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${
                errors.email ? "border border-red-500" : ""
              }`}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="text-red-600 text-sm mt-1">{errors.email}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Location
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${
                errors.location ? "border border-red-500" : ""
              }`}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {errors.location && (
              <span className="text-red-600 text-sm mt-1">
                {errors.location}
              </span>
            )}
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            className="bg-br-blue-medium text-white hover:bg-br-blue-dark"
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Snackbar open={snackbar.open} autoHideDuration={2000}>
        <Alert severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ClubDialog;
