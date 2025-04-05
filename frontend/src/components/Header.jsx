import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import {
  LibraryBooks,
  Add as AddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon
} from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import "../styles/Header.css";
import Modal from "./Modal";
import { logout } from "../firebase";
import { useNavigate } from "react-router-dom";

const Header = ({
  user,
  onLogout
}) => {
  const [isModalOpen, setModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleMenu = (event) => {
    if (!user) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    if (user) {
      navigate("/user");
    }
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      if (onLogout) {
        onLogout();
      }
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <AppBar position="sticky" className="header" elevation={0}>
      <Toolbar className="header-toolbar">
        <div
          className="header-logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: 'pointer' }}
        >
          <LibraryBooks className="logo-icon" />
          <Typography variant="h6" className="logo-text">
            Bookie
          </Typography>
        </div>

        <AnimatePresence>
          <div className="header-actions">
            {user && (
              <Tooltip title="Add book">
                <IconButton 
                  onClick={openModal} 
                  className="action-btn add-btn"
                  sx={{
                    mr: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}

            <Box className="user-section">
              {user && (
                <>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleMenu}
                      sx={{
                        padding: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <Avatar 
                        className="user-avatar"
                        sx={{
                          bgcolor: '#1976d2',
                          color: 'white',
                          width: 35,
                          height: 35
                        }}
                      >
                        {user.email?.[0]?.toUpperCase() || <AccountCircleIcon />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem onClick={handleProfile}>
                      <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {user && (
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                userid={user.uid}
              />
            )}
          </div>
        </AnimatePresence>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
