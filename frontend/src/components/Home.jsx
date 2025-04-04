import "../styles/Home.css";
import React, { useEffect, useState } from "react";
import Book from "./Book";
import { AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton, CircularProgress, TextField, InputAdornment, Paper, Stack, Container, Grid, FormControl, InputLabel, Select, MenuItem, useTheme, Fab, useMediaQuery, Alert } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Star as StarIcon, LibraryBooks, AutoStories as StoriesIcon, Chat as ChatIcon } from "@mui/icons-material";
import Pagination from '@mui/material/Pagination';
import { useLocation } from 'react-router-dom';

import Footer from "./Footer";
import ChatBox from "./ChatBot";
import AnimatedTooltip from "./AnimatedTooltip";
import EmptyBookShelf from "./EmptyBookShelf";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Home({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

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
  const [error, setError] = useState(null);
  
  const categories = ["All", "Self-Help", "Science Fiction", "Mystery", "Romance", "Others"];
  const statuses = ["All", "Reading", "Completed", "Upcoming"];

  const fetchBooks = async () => {
    if (!user) {
      console.log("No user found, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: isMobile ? 3 : 5,
        search: searchTerm,
        category: selectedCategory,
        status: selectedStatus,
        sortBy
      });

      const url = `${API_URL}/dashboard/${user.uid}?${queryParams}`;
      console.log("Fetching books from:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      
      setBooks(data.books || []);
      setCount(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [user, page, searchTerm, selectedCategory, selectedStatus, sortBy, isMobile]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  // Update filters when navigating from footer
  useEffect(() => {
    if (location.state) {
      if (location.state.resetFilters) {
        // Reset all filters
        setSearchTerm("");
        setSelectedCategory("All");
        setSelectedStatus("All");
        setSortBy("rating");
      }
      // Apply new filter if provided
      if (location.state.selectedStatus) {
        setSelectedStatus(location.state.selectedStatus);
      }
      if (location.state.selectedCategory) {
        setSelectedCategory(location.state.selectedCategory);
      }
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const refreshBooks = () => {
    fetchBooks();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      position: 'relative'
    }}>
      <Box sx={{ flex: '1 0 auto', pt: { xs: 2, sm: 4 }, pb: { xs: 4, sm: 6 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 6 }, position: "relative" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <LibraryBooks sx={{ fontSize: { xs: 36, sm: 48 }, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant={isMobile ? "h4" : "h2"} component="h1" sx={{ fontWeight: "bold", mb: 2 }}>
              Book Library
            </Typography>
            <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" sx={{ maxWidth: "600px", mx: "auto", px: { xs: 2, sm: 0 } }}>
              Discover your next favorite book from our carefully curated collection
            </Typography>
          </Box>

          {books.length > 0 && (
            <>
              <Box sx={{ mb: { xs: 3, sm: 4 }, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TextField
                  fullWidth
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={handleSearch}
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

              <Paper elevation={0} sx={{ 
                p: { xs: 1, sm: 2 }, 
                mb: { xs: 3, sm: 4 }, 
                backgroundColor: "rgba(255, 255, 255, 0.9)", 
                borderRadius: 2, 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap", 
                gap: 2, 
                alignItems: { xs: "flex-start", sm: "center" }, 
                justifyContent: "space-between" 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoriesIcon color="primary" />
                  <Typography variant={isMobile ? "subtitle1" : "h6"} component="h2">
                    Browse Books
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  width: { xs: "100%", sm: "auto" }
                }}>
                  <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={selectedStatus} onChange={handleStatusChange} label="Status">
                      {statuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                      <MenuItem value="rating"><StarIcon sx={{ mr: 1, fontSize: 18 }} /> Highest Rated</MenuItem>
                      <MenuItem value="title">📖 Title (A-Z)</MenuItem>
                      <MenuItem value="author">👤 Author (A-Z)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 4, mb: 2 }}>{error}</Alert>
          ) : books.length === 0 ? (
            <EmptyBookShelf user={user} onBookAdded={refreshBooks} />
          ) : (
            <Stack spacing={3}>
              {books.map((book) => (
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

          {!loading && bookCount > 1 && (
            <Stack
              spacing={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 3,
                mb: { xs: 4, sm: 6 },
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
                size={isMobile ? "small" : "medium"}
              />
            </Stack>
          )}
        </Container>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>

      <AnimatePresence>
        {isChatOpen && (
          <Box
            sx={{
              position: "fixed",
              bottom: { xs: 60, sm: 80 },
              right: { xs: 8, sm: 16 },
              zIndex: 1000,
              width: { xs: "90%", sm: "400px" }
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

      <Box sx={{ position: "fixed", bottom: { xs: 8, sm: 16 }, right: { xs: 8, sm: 16 }, zIndex: 1000 }}>
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
            width: { xs: 40, sm: 56 },
            height: { xs: 40, sm: 56 }
          }}
        >
          <ChatIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </Fab>
      </Box>
    </Box>
  );
}

export default Home;

