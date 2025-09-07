import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function BookDialogBox({ open, onClose, title, description, onConfirm }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '20px', 
                    border: '10px solid #E0E8F0',
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{
                    backgroundColor: 'white',
                    color: '#162546', 
                    '&:hover': {
                        backgroundColor: '#E0E8F0',
                    },
                    borderRadius: '8px'
                }} onClick={onClose}>Cancel</Button>
                <Button  sx={{
                    backgroundColor: '#0F172F', 
                    color: '#fff', 
                    '&:hover': {
                        backgroundColor: '#13203C', 
                    },
                    borderRadius: '8px'
                }} onClick={onConfirm} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}