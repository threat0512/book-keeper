import "../styles/Home.css";
import React, { useEffect, useState } from "react";
import Book from "./Book";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Modal from "./Modal";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton, CircularProgress, TextField, InputAdornment, Paper, Stack, Container, Grid, FormControl, InputLabel, Select, MenuItem, useTheme } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Star as StarIcon, LibraryBooks, AutoStories as StoriesIcon } from "@mui/icons-material";
import Pagination from '@mui/material/Pagination';
function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  const [bookCount, setCount] = useState(0);
  const [uid, setUid] = useState(null);
  const [isModalOpen, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const theme = useTheme();
  const auth = getAuth();
  const categories = ["All", "Self-Help", "Science Fiction", "Mystery", "Romance", "Others"];
  const statuses = ["All", "Reading", "Completed", "Upcoming"]
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${uid}?page=1&limit=5`)

      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    fetch(`http://localhost:3000/books/count/${uid}`)

      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCount(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      
      });
  }, [uid]);
  useEffect(() => {
    if (!uid) return;
  
    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${uid}?page=${page}&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, [uid, page]); // 👈 re-fetch when page changes
  
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);
  
  const filteredBooks = books
    .filter(book =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(book => selectedCategory === "All" || book.category === selectedCategory)
    .filter(book => selectedStatus === "All" || book.status === selectedStatus)
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "title") return a.name.localeCompare(b.name);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      return 0;
    });
 
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <LibraryBooks sx={{ fontSize: 48, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
            Book Library
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto" }}>
            Discover your next favorite book from our carefully curated collection
          </Typography>
        </Box>

        {/* 🔍 Search Input */}
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: "600px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                transition: "all 0.3s",
                "&:hover": { backgroundColor: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
              },
            }}
          />
        </Box>

        {/* 📚 Filter & Sort */}
        <Paper elevation={0} sx={{ p: 2, mb: 4, backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StoriesIcon color="primary" />
            <Typography variant="h6" component="h2">
              Browse Books
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} label="Status">
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="rating"><StarIcon sx={{ mr: 1, fontSize: 18 }} /> Highest Rated</MenuItem>
                <MenuItem value="title">📖 Title (A-Z)</MenuItem>
                <MenuItem value="author">👤 Author (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* 📖 Book List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>
        ) : (
          <Stack spacing={3}>
            {filteredBooks.map((book) => (
              <Book key={book.id} id={book.id} name={book.name} author={book.author} category={book.category} status={book.status} rating={book.rating} review={book.review} cover={book.cover} user={uid} />
            ))}
          </Stack>
        )}
      </Container>
      {!loading && bookCount > 1 && (
  <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
    <Pagination
      count={bookCount}
      color="primary"
      page={page}
      onChange={(e, value) => setPage(value)}
    />
  </Stack>
)}

    </Box>
  );
}

export default Home;
