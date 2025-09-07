import React, { useState } from 'react';
import { FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Avatar from '@mui/material/Avatar';
import { LogOut } from 'lucide-react';
import { clearSession } from '../../redux/slices/clubSession/clubSessionSlice';
import { deleteSession } from '../../services/SessionService';
import { useCookies } from 'react-cookie';
import profile from '../../assets/profile.png';

function Header({ setActiveOption, userProfile, clubName }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [, , removeCookies] = useCookies(['connect.sid']);
    const [, , removeToken] = useCookies(['token']);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    console.log(clubName);
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleSwitchClubs = async () => {
      await dispatch(clearSession())
      await deleteSession();
      removeCookies('connect.sid', { path: '/' });
      handleClose();
      window.location.reload();
    };
  
    const handleLogout = async () => {
      await dispatch(clearSession());
      await deleteSession();
      removeCookies('connect.sid', { path: '/' });
      removeToken('token', { path: '/' });
      handleClose();
      window.location.reload();
    };
  
    return (
      <div className="flex justify-between items-center bg-white text-black px-6 py-4 rounded-[var(--br-radius)]">
        <div className="text-2xl font-bold">{clubName || "Club Name"}</div>
        <div className="flex items-center space-x-6">
          <div className="cursor-pointer hover:text-gray-400">
            <FaBell />
          </div>
          <div>
            <img
              src={userProfile || profile}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80"
              onClick={handleClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                sx: {
                  width: 200,
                  marginTop: 1,
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                  '& .MuiMenuItem-root:hover': {
                    backgroundColor: 'var(--color-br-blue-light)',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <NavLink to="/profile">
                <MenuItem onClick={() => setActiveOption(null)}>
                  <Avatar src={userProfile} sx={{ width: 24, height: 24, marginRight: 1.7 }} />
                  Profile
                </MenuItem>
              </NavLink>
              <Divider />
              <MenuItem onClick={handleSwitchClubs}>
                <ListItemIcon>
                  <SwapHoriz fontSize="small" />
                </ListItemIcon>
                Switch Club
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    );
  };

export default Header
