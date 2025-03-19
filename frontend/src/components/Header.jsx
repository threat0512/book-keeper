import React, { useState } from "react";
import {
  AppBar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import {
  LibraryBooks,
  Search as SearchIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Header.css";
import Modal from "./Modal";
import { logout } from "../firebase";
import { useNavigate } from "react-router-dom";

const Header = ({
  user,
  setUser,
  searchQuery,
  onSearchChange,
  onSort,
  sortAnchorEl,
  onSortClick,
  onSortClose,
}) => {
  const [isModalOpen, setModal] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  return (
    <AppBar position="sticky" className="header" elevation={0}>
      {console.log("User:", user)} {/* ✅ Debugging */}
      <Toolbar className="header-toolbar">
        <motion.div
          className="header-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LibraryBooks className="logo-icon" />
          <Typography variant="h6" className="logo-text">
            Bookie
          </Typography>
        </motion.div>

        <AnimatePresence>
          <motion.div
            className="header-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip title="Add book">
              <IconButton onClick={openModal} className="action-btn add-btn">
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Box className="user-section">
              {/* ✅ Prevent errors by checking if `user` exists */}
              <Avatar className="user-avatar">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </Avatar>

              {user && (
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} className="action-btn">
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* ✅ Ensure `user` exists before passing `user.uid` */}
            {user ? (
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                userid={user.uid}
              />
            ) : (
              <Modal isOpen={isModalOpen} onClose={closeModal} userid={null} />
            )}
          </motion.div>
        </AnimatePresence>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
