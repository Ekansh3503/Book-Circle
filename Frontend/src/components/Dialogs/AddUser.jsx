// components/AddMemberDialog.js
import * as React from "react";
import { useState } from "react";
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
import { Plus } from "lucide-react";
import SimpleClubDropdown from "../Dropdowns/SimpleClubDropdown";
import SimpleRoleDropdown from "../Dropdowns/SimpleRoleDropdown";
import { addMemberService } from "../../services/userService";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";
import { CircularProgress } from "@mui/material";

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
function AddUser({ onUserAdded, clubId: passedClubId, ButtonTitle }) {
  const [open, setOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(passedClubId ? { id: passedClubId } : null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [errors, setErrors] = useState({});
  const { role } = useSelector((state) => state.clubSession);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    club: false,
    role: false,
  });


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setErrors({});
    setEmail("");
    setName("");
    setPhoneNo("");
    setSelectedClub(passedClubId ? { id: passedClubId } : null);
    setSelectedRole(null);
    setTouched({
      name: false,
      email: false,
      phone: false,
      club: false,
      role: false,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!PhoneNo.trim()) {
      newErrors.PhoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(PhoneNo.trim())) {
      newErrors.PhoneNo = "Phone number must be 10 digits";
    }


    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/[A-Za-z]/.test(name.trim())) {
      newErrors.name = "Name must include at least one letter";
    }
    if (!passedClubId && !selectedClub) newErrors.club = "Club is required";
    if (!selectedRole) newErrors.role = "Role is required";

    return newErrors;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors(validate());

    if (Object.keys(errors).length > 0) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        club: true,
        role: true,
      });
      return;
    }

    const memberData = {
      name: name.trim(),
      phone_no: PhoneNo.trim(),
      email: email.trim(),
      clubId: passedClubId || selectedClub.id,
      roleId: selectedRole.value,
      userType: role,
    };

    try {
      const response = await addMemberService(memberData);

      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message || "Member added successfully!",
          type: "success",
        });

        handleClose();
        if (onUserAdded) onUserAdded();
        setTimeout(() => {
          setSnackbar({ open: false, message: "", type: "success" });
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Failed to add member.",
          type: "error",
        });

        setTimeout(() => {
          setSnackbar({ open: false, message: "", type: "error" });
        }, 2000);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Something went wrong. Please try again.",
        type: "error",
      });
      setTimeout(() => {
        setSnackbar({ open: false, message: "", type: "error" });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validationErrors = validate();
    setErrors(validationErrors);
  }, [name, email, PhoneNo, selectedClub, selectedRole]);

  return (
    <>
      <button
        className="text-blue-600 hover:bg-br-blue-dark flex flex-row items-center justify-center bg-br-blue-medium gap-1 px-4 py-2 rounded-xl text-md text-white border-2"
        onClick={handleClickOpen}
      >
        <Plus size={18} />
        {ButtonTitle || "Add Member"}
      </button>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add New Member
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers className="bg-br-blue-light space-y-4">
          <div className="flex flex-col items-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Name
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1`}
              placeholder="Name"
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setTouched((prev) => ({ ...prev, name: true }));
              }}
            />
            {touched.name && errors.name && <p className="text-xs text-red-500 text-start w-full mt-1">{errors.name}</p>}
          </div>
          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Email
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1`}
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setTouched((prev) => ({ ...prev, email: true }));
              }}
            />
            {touched.email && errors.email && <p className="text-xs text-red-500 text-start w-full mt-1">{errors.email}</p>}
          </div>
          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Phone Number
            </label>
            <input
              className={`w-120 bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1`}
              placeholder="Phone Number"
              type="tel"
              maxLength={10}
              value={PhoneNo}
              onChange={(e) => {
                setPhoneNo(e.target.value)
                setTouched((prev) => ({ ...prev, phone: true }));
              }
              }
            />
            {touched.phone && errors.PhoneNo && <p className="text-xs text-red-500 text-start w-full mt-1">{errors.PhoneNo}</p>}
          </div>

          {!passedClubId && (
            <div className="flex flex-col items-center justify-center">
              <label className="text-md font-medium text-br-blue-medium text-start w-full">
                Select Club
              </label>
              <SimpleClubDropdown
                onSelect={(club) => {
                  setSelectedClub(club);
                  setErrors((prev) => ({ ...prev, club: false }));
                  setTouched((prev) => ({ ...prev, club: true }));
                }}
                portal
                selected={selectedClub}
              />
              {touched.club && errors.club && <span className="text-red-600 text-xs text-start w-full mt-1">{errors.club}</span>}
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            <label className="text-md font-medium text-br-blue-medium text-start w-full">
              Select Role
            </label>
            <SimpleRoleDropdown
              onSelect={(role) => {
                setSelectedRole(role);
                setErrors((prev) => ({ ...prev, role: false }));
                setTouched((prev) => ({ ...prev, role: true }));
              }}
              portal
              selected={selectedRole}
              clubId={passedClubId || selectedClub?.id}
              currentUserRole={role} 
            />
            {touched.role && errors.role && <span className="text-red-600 text-xs text-start w-full mt-1">{errors.role}</span>}
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            className="bg-br-blue-medium text-white hover:bg-br-blue-dark"
            disabled={snackbar.type === "success" && snackbar.open || loading}
          >
            {loading ? <CircularProgress /> : "Submit"}
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


export default AddUser;
