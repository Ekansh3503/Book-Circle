import React, { useRef, useState, useEffect } from "react";
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
import { Camera } from "lucide-react";
import { updateClubService } from "../../services/clubService";

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

function EditClubDialog({ open, onClose, clubData, onClubUpdated }) {
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

    useEffect(() => {
        if (clubData) {
            setClubName(clubData.club_name || "");
            setEmail(clubData.club_contact_email || "");
            setLocation(clubData.club_location || "");
            setPreview(clubData.club_thumbnail_url || null);
        }
    }, [clubData]);

    const validate = () => {
        const newErrors = {};
        if (!clubName.trim()) newErrors.clubName = true;
        if (!email.trim()) newErrors.email = true;
        if (!location.trim()) newErrors.location = true;
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
        formData.append("clubId", clubData.id);
        formData.append("club_name", clubName.trim());
        formData.append("club_contact_email", email.trim());
        formData.append("club_location", location.trim());

        if (image) {
            formData.append("file", image);
        } else if (preview) {
            formData.append("thumbnail_url", preview);
        }

        try {
            const response = await updateClubService(formData);

            if (response?.data?.success) {
                setSnackbar({
                    open: true,
                    message: "Club updated successfully!",
                    type: "success",
                });
                if (onClubUpdated) onClubUpdated();
                setTimeout(() => {
                    setSnackbar({ open: false, message: "", type: "success" });
                    handleClose();
                }, 1500);
            } else {
                throw new Error(response?.data?.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: err?.response?.data?.message || "Something went wrong.",
                type: "error",
            });
            setTimeout(() => {
                setSnackbar({ open: false, message: "", type: "error" });
            }, 1500);
        }
    };

    const handleClose = () => {
        onClose();
        setImage(null);
        setPreview(null);
        setClubName("");
        setEmail("");
        setLocation("");
        setErrors({});
    };

    return (
        <>
            <BootstrapDialog onClose={handleClose} open={open}>
                <DialogTitle sx={{ m: 0, p: 2 }}>Edit Club</DialogTitle>
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
                    </div>

                    {/* Club Name */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-md font-medium text-br-blue-medium text-start w-full">
                            Club Name
                        </label>
                        <input
                            className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${errors.clubName ? "border border-red-500" : ""
                                }`}
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-md font-medium text-br-blue-medium text-start w-full">
                            Contact Email
                        </label>
                        <input
                            className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${errors.email ? "border border-red-500" : ""
                                }`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-md font-medium text-br-blue-medium text-start w-full">
                            Location
                        </label>
                        <input
                            className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1 ${errors.location ? "border border-red-500" : ""
                                }`}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
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

export default EditClubDialog;
