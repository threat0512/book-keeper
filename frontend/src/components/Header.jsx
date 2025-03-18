// import { useState } from "react";
// import { Button, AppBar, Toolbar, Typography, Stack } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import Modal from "./Modal";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../firebase";
// import ImportContactsIcon from "@mui/icons-material/ImportContacts";
// import { LibraryBooks } from "@mui/icons-material";
// function Header({ user, setUser }) {
//   const [isModalOpen, setModal] = useState(false);
//   const navigate = useNavigate();

//   const openModal = () => setModal(true);
//   const closeModal = () => setModal(false);

//   const handleLogout = async () => {
//     await logout();
//     setUser(null); // ✅ Reset user state
//     navigate("/"); // ✅ Redirect to home
//   };

//   return (
//     <AppBar
//       position="static"
//       sx={{
//         backgroundColor: "#B9B28A",
//         boxShadow: "none",
//         borderBottom: "1px solid #f1f1f1",
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         {/* Logo */}
//         <Typography
//           variant="h5"
//           sx={{
//             color: "black",
//             letterSpacing: "-0.5px",
//             "& span:first-of-type": { fontWeight: 500 },
//             "& span:last-of-type": { color: "rgba(0,0,0,0.4)" },
//           }}
//         >
//           <span style={{ fontSize: "45px", fontWeight: "bold" }}><ImportContactsIcon sx={{ fontSize: 35 }}/>bookie</span>
//           <span style={{ fontSize: "40px", fontWeight: "bold" }}>.</span>
//         </Typography>

//         {/* Buttons aligned to the right */}
//         <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
//           {/* Add New Book Button (Only When Logged In) */}
//           {user && (
//             <Button
//               onClick={openModal}
//               variant="contained"
//               size="large"
//               sx={{
//                 backgroundColor: "black",
//                 borderRadius: "8px",
//                 textTransform: "none",
//                 padding: "8px 24px",
//                 fontSize: "0.95rem",
//                 fontWeight: 400,
//                 boxShadow: "none",
//                 "&:hover": {

//                   boxShadow: "none",
//                 },
//               }}
//               startIcon={<AddIcon />}
//             >
//               Add a New Book
//             </Button>
//           )}

//           {/* Login / Logout Button */}
//           <Button
//             onClick={() => user ? handleLogout() : navigate("/login")}
//             variant="contained"
//             size="large"
//             sx={{
//               backgroundColor: "black",
//               color: "white",
//               borderRadius: "8px",
//               fontWeight: "500",
//               textTransform: "none",
//               padding: "8px 24px",
//               fontSize: "0.95rem",
//               boxShadow: "none",
//               "&:hover": {

//                 boxShadow: "none",
//               },
//             }}
//           >
//             {user ? "Logout" : "Login"}
//           </Button>
//         </Stack>
//       </Toolbar>

//       <Modal isOpen={isModalOpen} onClose={closeModal} />
//     </AppBar>
//   ); 
//   // return (
//   //   <div></div>
//   // );
// }

// export default Header;

import React, {useState} from 'react';
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
  Paper
} from '@mui/material';
import {
  LibraryBooks,
  Search as SearchIcon,
  Sort as SortIcon,
  Add as AddIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import '../styles/Header.css';

import Modal from "./Modal";


const Header = ({ 
  user, 
  onLogout, 
  searchQuery, 
  onSearchChange,
  onSort,
  sortAnchorEl,
  onSortClick,
  onSortClose,

}) => {
  // function Header({ user, setUser }) {
  const [isModalOpen, setModal] = useState(false);
//   const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

//   const handleLogout = async () => {
//     await logout();
//     setUser(null); // ✅ Reset user state
//     navigate("/"); // ✅ Redirect to home
//   };
  return (
    <AppBar position="fixed" className="header" elevation={0}>
      <Toolbar className="header-toolbar">
        <motion.div
          className="header-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LibraryBooks className="logo-icon" />
          <Typography variant="h6" className="logo-text">Bookie</Typography>
        </motion.div>

        <motion.div 
          className="header-search"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper className="search-paper">
            <SearchIcon className="search-icon" />
            <InputBase
              placeholder="Search books..."
              value={searchQuery}
              onChange={onSearchChange}
              className="search-input"
              fullWidth
            />
          </Paper>
        </motion.div>

        <motion.div 
          className="header-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Tooltip title="Sort books">
            <IconButton onClick={onSortClick} className="action-btn">
              <SortIcon />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={onSortClose}
            className="sort-menu"
          >
            <MenuItem onClick={() => onSort('date')}>Recently Added</MenuItem>
            <MenuItem onClick={() => onSort('title')}>Title</MenuItem>
            <MenuItem onClick={() => onSort('author')}>Author</MenuItem>
            <MenuItem onClick={() => onSort('rating')}>Rating</MenuItem>
          </Menu>

          <Tooltip title="Add book">
            <IconButton 
              onClick={openModal} 
              className="action-btn add-btn"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Box className="user-section">
            <Avatar className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Tooltip title="Logout">
              <IconButton onClick={onLogout} className="action-btn">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>
      </Toolbar>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </AppBar>
  );
};

export default Header;
