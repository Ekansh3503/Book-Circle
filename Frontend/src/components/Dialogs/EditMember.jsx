import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, IconButton, Grid, MenuItem,
    Box, Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { editMemberDetails } from '../../services/userService';
import { useSelector } from 'react-redux';

const roles = [
    { value: 2, label: 'Member' },
    { value: 1, label: 'Club Admin' }
];

const roleLabels = {
    0: 'Super Admin',
    1: 'Club Admin',
    2: 'Member'
};


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditMember = ({ open, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone_no: '',
        clubs: [],
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        type: "success"
    });

    const { role: userRole } = useSelector((state) => state.clubSession);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone_no: userData.phone_no || '',
                clubs: userData.clubusers?.map(cu => ({
                    clubId: cu.clubId,
                    clubName: cu.club?.club_name || '',
                    role: cu.role,
                    originalRole: cu.role,
                    remove: false
                })) || []
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (index, newRole) => {
        const updatedClubs = [...formData.clubs];
        updatedClubs[index].role = newRole;
        setFormData({ ...formData, clubs: updatedClubs });
    };

    const handleRemoveToggle = (index) => {
        const updatedClubs = [...formData.clubs];
        updatedClubs[index].remove = !updatedClubs[index].remove;
        setFormData({ ...formData, clubs: updatedClubs });
    };

    const handleSubmit = async () => {
        try {
            const updates = formData.clubs
                .filter(club => club.role !== club.originalRole || club.remove)
                .map(club => ({
                    clubId: club.clubId,
                    newRole: club.role,
                    remove: club.remove
                }));

            const response = await editMemberDetails(
                userData.id,
                userRole,
                formData.name,
                formData.phone_no,
                updates
            );

            if (response.success) {
                setSnackbar({
                    open: true,
                    message: "Member details updated successfully!",
                    type: "success"
                });

                setTimeout(() => {
                    onSave(formData);
                    onClose();
                    setSnackbar({ open: false, message: "", type: "success" });
                }, 2000);
            } else {
                setSnackbar({
                    open: true,
                    message: response.message || "Failed to update member.",
                    type: "error"
                });
                setTimeout(() => {
                    setSnackbar({ open: false, message: "", type: "error" });
                }, 2000);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Something went wrong. Please try again.",
                type: "error"
            });
            setTimeout(() => {
                setSnackbar({ open: false, message: "", type: "error" });
            }, 2000);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 2 } }}>
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">Edit Member</Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'grey.500'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent className="bg-br-blue-light">
                    <Box sx={{ mt: 1 }}>
                        {/* User Details Section */}
                        <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    name="email"
                                    disabled={true}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'grey.50',
                                            borderRadius: '10px',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    name="name"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'grey.50',
                                            borderRadius: '10px',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    Phone Number
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter phone number"
                                    value={formData.phone_no}
                                    onChange={handleInputChange}
                                    name="phone_no"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'grey.50',
                                            borderRadius: '10px',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Clubs Section */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                                Member Of Club(s)
                            </Typography>

                            <Box className="bg-white flex flex-row items-center justify-between py-3 px-6 text-sm font-semibold mb-1 border-t-1 border-b-1 ">
                                <div className="w-4/12">Club Name</div>
                                <div className="w-4/12">Role</div>
                                <div className="w-4/12 text-start">Actions</div>
                            </Box>

                            <Box sx={{ backgroundColor: '', borderRadius: 1, py: 1 }}>
                                {formData.clubs.map((club, index) => (
                                    <Box
                                        key={club.clubId}
                                        className="bg-white flex flex-row items-center justify-between px-4 py-2 rounded-lg mb-2 border border-gray-200"
                                    >
                                        <div className="w-4/12 font-semibold text-sm">
                                            {club.clubName || "Club Name"}
                                        </div>
                                        <div className="w-2/12 font-semibold text-sm text-start">
                                            {roleLabels[club.originalRole] || "Unknown Role"}
                                        </div>

                                        {/* Role Selector */}
                                        <div className="w-3/12">
                                            {club.role == 0 ? (
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    This cannot be modified
                                                </Typography>
                                            ) : (
                                                <TextField
                                                    select
                                                    fullWidth
                                                    value={club.role}
                                                    onChange={(e) => handleRoleChange(index, e.target.value)}
                                                    disabled={club.remove}
                                                    size="small"
                                                    SelectProps={{
                                                        renderValue: (value) => {
                                                            return club.role == club.originalRole
                                                                ? "Change Role"
                                                                : roleLabels[value]
                                                        },
                                                        displayEmpty: true
                                                    }}
                                                    sx={{ backgroundColor: 'white', maxWidth: 200 }}
                                                >
                                                    {roles.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        </div>

                                        {/* Remove / Undo Button */}
                                        <div className="w-3/12 text-end">
                                            {club.role != 0 && (
                                                <Button
                                                    variant={club.remove ? 'outlined' : 'contained'}
                                                    color={club.remove ? 'error' : "error"}
                                                    onClick={() => handleRemoveToggle(index)}
                                                    size="small"
                                                    sx={{ minWidth: 160 }}
                                                >
                                                    {club.remove ? 'Undo Remove' : 'Remove from Club'}
                                                </Button>
                                            )}
                                        </div>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: 'var(--color-br-blue-dark)',
                            '&:hover': {
                                backgroundColor: 'var(--color-br-blue-medium)',
                            },
                            minWidth: 100
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
            >
                <Alert
                    severity={snackbar.type}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};


export default EditMember;
