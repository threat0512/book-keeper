import "../styles/Home.css";
import React, { useEffect, useState } from "react";
import Book from "./Book";
import { AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton, CircularProgress, TextField, InputAdornment, Paper, Stack, Container, Grid, FormControl, InputLabel, Select, MenuItem, useTheme, Fab } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Star as StarIcon, LibraryBooks, AutoStories as StoriesIcon, Chat as ChatIcon } from "@mui/icons-material";
import Pagination from '@mui/material/Pagination';

import Footer from "./Footer";
import ChatBox from "./ChatBot";
import AnimatedTooltip from "./AnimatedTooltip";
import EmptyBookShelf from "./EmptyBookShelf";

function Home({ user }) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [bookCount, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const theme = useTheme();
  const categories = ["All", "Self-Help", "Science Fiction", "Mystery", "Romance", "Others"];
  const statuses = ["All", "Reading", "Completed", "Upcoming"];
  
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${user.uid}?page=1&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`http://localhost:3000/books/count/${user.uid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCount(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
  
    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${user.uid}?page=${page}&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, [user, page]); // 👈 re-fetch when page changes
  
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

  const refreshBooks = () => {
    if (!user) return;
    
    setLoading(true);
    fetch(`http://localhost:3000/dashboard/${user.uid}?page=${page}&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });

    // Also refresh the book count
    fetch(`http://localhost:3000/books/count/${user.uid}`)
      .then((response) => response.json())
      .then((data) => {
        setCount(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      position: 'relative'
    }}>
      {/* Main Content */}
      <Box sx={{ flex: '1 0 auto', pt: 4, pb: 6 }}>
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

          {/* 🔍 Search Input and Filters - Only show when books exist */}
          {books.length > 0 && (
            <>
              {/* Search Input */}
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

              {/* Filter & Sort */}
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
            </>
          )}

          {/* 📖 Book List */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>
          ) : books.length === 0 ? (
            <EmptyBookShelf user={user} onBookAdded={refreshBooks} />
          ) : (
            <Stack spacing={3}>
              {filteredBooks.map((book) => (
                <Book 
                  key={book.id} 
                  id={book.id} 
                  name={book.name} 
                  author={book.author} 
                  category={book.category} 
                  status={book.status} 
                  rating={book.rating} 
                  review={book.review} 
                  cover={book.cover} 
                  user={user.uid}
                  onDelete={refreshBooks}
                />
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {!loading && bookCount > 1 && (
            <Stack
              spacing={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 3,
                mb: 6,
              }}
            >
              <Pagination
                sx={{
                  marginTop: '2%'
                }}
                count={bookCount}
                color="primary"
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </Stack>
          )}
        </Container>
      </Box>

      {/* Footer - Will stick to bottom */}
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>

      {/* Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <Box
            sx={{
              position: "fixed",
              bottom: 80,
              right: 16,
              zIndex: 1000,
            }}
          >
            <ChatBox 
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              user={user}
            />
          </Box>
        )}
      </AnimatePresence>

      {/* Chat FAB with Animated Tooltip */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
        <AnimatedTooltip 
          isVisible={isTooltipVisible} 
          onClose={() => setIsTooltipVisible(false)} 
        />
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setIsTooltipVisible(false);
          }}
          sx={{
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <ChatIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default Home;

