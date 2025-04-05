import * as React from "react";
import { useState, useEffect } from "react";
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, IconButton, Slide, Box, Rating, Typography, 
  InputLabel, OutlinedInput, MenuItem, FormControl, Select, Alert 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Animation for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const categories = ["Self-Help", "Science Fiction", "Mystery", "Romance", "Others"];
const statuses = ["Reading", "Completed", "Upcoming"];

const Modal = ({ isOpen, onClose, isEdit, bookData, userid, onBookUpdated }) => {
  // Form state (pre-filled when editing)
  const [formData, setFormData] = useState({
    name: bookData?.name || "",
    author: bookData?.author || "",
    category: bookData?.category || categories[0],
    status: bookData?.status || statuses[0],
    review: bookData?.review || "",
    rating: bookData?.rating || 0,
    keyType: bookData?.keyType || "",
    key: bookData?.key || "",
    uid: userid || "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load existing book details when editing
  useEffect(() => {
    if (isEdit && bookData) {
      setFormData({
        name: bookData.name || "",
        author: bookData.author || "",
        category: bookData.category || categories[0],
        status: bookData.status || statuses[0],
        review: bookData.review || "",
        rating: bookData.rating || 0,
        keyType: bookData.keyType || "",
        key: bookData.key || "",
        uid: userid || "",
      });
    } else {
      setFormData((prev) => ({ ...prev, uid: userid || "" }));
    }
  }, [isEdit, bookData, userid]);

  // Handle input changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle rating change
  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.uid) {
      setError("Error: User ID is missing!");
      setLoading(false);
      return;
    }

    const endpoint = isEdit
      ? `${API_URL}/update/${formData.uid}/${bookData.id}` // Update existing book
      : `${API_URL}/add/${formData.uid}`; // Add new book

    const method = isEdit ? "PUT" : "POST";

    try {
      console.log("Submitting book data:", {
        name: formData.name,
        author: formData.author,
        category: formData.category,
        status: formData.status,
        review: formData.review,
        rating: formData.rating,
        keyType: formData.keyType,
        key: formData.key
      });

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          author: formData.author,
          category: formData.category,
          status: formData.status,
          review: formData.review,
          rating: formData.rating,
          keyType: formData.keyType,
          key: formData.key
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.status === 409) {
        setError("This book already exists in your library!");
      } else if (response.ok) {
        console.log(isEdit ? "✅ Book updated successfully!" : "✅ Book added successfully!");
        if (onBookUpdated) {
          onBookUpdated(); // Refresh the book list
        }
        onClose(); // Close modal after success
      } else {
        console.error("❌ Failed to submit book:", data.error);
        setError(data.error || "Failed to submit book. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting book:", error);
      setError("Failed to submit book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => !loading && onClose()}
      sx={{
        "& .MuiDialog-paper": {
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "500px",
        },
      }}
    >
      {console.log("Modal opened - userid:", userid)}

      {/* Header with Close Button */}
      <DialogTitle 
        sx={{ 
          fontSize: "1.5rem", 
          fontWeight: "bold", 
          textAlign: "center", 
          paddingBottom: "10px",
          backgroundColor: "#2F3C7E",
          color: "white",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px"
        }}
      >
        {isEdit ? "Edit Book Details" : "Add a New Book"}
        <IconButton 
          aria-label="close"
          onClick={() => !loading && onClose()}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "#ffffff",
            transition: "0.3s",
            "&:hover": { color: "#f1f1f1", transform: "rotate(90deg)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* FORM STARTS HERE */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* Book Name */}
          <TextField
            required
            margin="dense"
            name="name"
            label="Book Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />

          {/* Author */}
          <TextField
            required
            margin="dense"
            name="author"
            label="Author"
            fullWidth
            variant="outlined"
            value={formData.author}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />
          {/* category */}
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, minWidth: "140" }}>
            <FormControl sx={{ minWidth: 120 }} fullWidth>
              <InputLabel htmlFor="keyType">Genre</InputLabel>
              <Select
                defaultValue=""
                required
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                input={<OutlinedInput label="category" />}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
           {/* status */}
           <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1, minWidth: "140" }}>
            <FormControl sx={{ minWidth: 120 }} fullWidth>
              <InputLabel htmlFor="keyType">Status</InputLabel>
              <Select
                required
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                input={<OutlinedInput label="status" />}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Review */}
          <TextField
            margin="dense"
            name="review"
            label="Review"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.review}
            onChange={handleChange}
            sx={{ marginBottom: "12px" }}
          />

          {/* Rating Component */}
          <Box sx={{ "& > legend": { mt: 2 } }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
            />
          </Box>

          {/* Select Key Type */}
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <FormControl sx={{  minWidth: 120 }} fullWidth>
              
              <InputLabel htmlFor="keyType">Key Type*</InputLabel>
              <Select
                // {isEdit ? null : required}
                id="keyType"
                name="keyType"
                value={formData.keyType}
                onChange={handleChange}
                input={<OutlinedInput label="Key Type" />}
              >
                <MenuItem value="ISBN">ISBN</MenuItem>
                <MenuItem value="OCLC">OCLC</MenuItem>
                <MenuItem value="LCCN">LCCN</MenuItem>
                <MenuItem value="OLID">OLID</MenuItem>
                <MenuItem value="ID">ID</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Key Input */}
          <TextField
            
            margin="dense"
            name="key"
            label="Key"
            fullWidth
            variant="outlined"
            value={formData.key}
            onChange={handleChange}
            // disabled={isEdit} // Prevent changing key when editing
          />
        </DialogContent>

        {/* Submit Button */}
        <DialogActions sx={{ justifyContent: "space-between", padding: "16px" }}>
          <Button 
            onClick={() => !loading && onClose()} 
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: "#2F3C7E",
              borderRadius: "8px",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#4500b5" },
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Modal;
