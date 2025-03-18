import "../styles/Home.css"
import React, { useEffect, useState } from "react";
import Book from "./Book";
import Sorter from "./Sorter";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from "./Modal";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating
} from '@mui/material';
import Header from './Header';
import { useNavigate } from 'react-router-dom'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
function Home() {
  const [books, setBooks] = useState([]);
  const [uid, setUid] = useState(null); // ✅ Store UID in state
  const [isModalOpen, setModal] = useState(false);
  const auth = getAuth();
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    // ✅ Track User Authentication State
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // ✅ Store UID in state when user logs in
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // ✅ Fetch books only when uid is available
    if (!uid) return;

    fetch(`http://localhost:3000/dashboard/${uid}`)
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, [uid]); // ✅ Re-run API call when `uid` changes

  const handleSort = (sortOption) => {
    let sorted = [...books];
    
    if (sortOption === "title") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "author") {
      sorted.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setBooks(sorted);
  };

  return (
    <div className="layout">
      <div className="header-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "99.2%" }}>
        <span className="intro" style={{ fontSize: "2.2rem", fontWeight: "bold", marginLeft: "1.1%" }}>My Library</span>
        <Sorter className="sorter" onSortChange={handleSort} />
      </div>

      {books.length > 0 ? (
        books.map((book, index) => (
          <Book key={index} id={book.id} name={book.name} author={book.author} rating={book.rating} review={book.review} cover={book.cover} />
        ))
      ) : (
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="empty-state"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="empty-state-content"
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconButton className="add-button" onClick={openModal}>
                    <AddIcon />
                  </IconButton>
                </motion.div>
                <Typography variant="h5" className="empty-state-title">
                  Your bookshelf is empty
                </Typography>
                <Typography variant="body1" className="empty-state-subtitle">
                  Start building your collection by adding your first book
                </Typography>
              </motion.div>
            </motion.div>
        
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Home;
