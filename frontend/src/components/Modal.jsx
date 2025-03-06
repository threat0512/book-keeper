import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Animation for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const FormModal = ({ isOpen, onClose, isEdit, bookData }) => {
  // Form state (pre-filled when editing)
  console.log(bookData);
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    review: "",
    rating: 0,
    keyType: "",
    key: "",
  });

  // Load existing book details when editing
  useEffect(() => {
    if (isEdit && bookData) {
      setFormData({
        name: bookData.name || "",
        author: bookData.author || "",
        review: bookData.review || "",
        rating: bookData.rating || 0,
        keyType: bookData.keyType || "",
        key: bookData.key || "",
      });
    }
  }, [isEdit, bookData]);

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
    event.preventDefault(); // Prevent page reload

    const endpoint = isEdit
      ? `http://localhost:3000/update/${bookData.id}` // Update existing book
      : "http://localhost:3000/add"; // Add new book

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        alert("❌ This book already exists in the database!");
      } else if (response.ok) {
        console.log(isEdit ? "✅ Book updated successfully!" : "✅ Book added successfully!");
        onClose(); // Close modal after success
        window.location.reload(); // Reload page to reflect changes
      } else {
        console.error("Failed to submit book:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle>{isEdit ? "Edit Book" : "Post a New Book"}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      {/* FORM STARTS HERE */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            {isEdit ? "Edit the book details below." : "Fill in the details below to add a new book."}
          </DialogContentText>

          {/* Book Name */}
          <TextField
            required
            margin="dense"
            name="name"
            label="Name of Book"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Author */}
          <TextField
            required
            margin="dense"
            name="author"
            label="Author of Book"
            type="text"
            fullWidth
            variant="standard"
            value={formData.author}
            onChange={handleChange}
          />

          {/* Review */}
          <TextField
            required
            margin="dense"
            name="review"
            label="Add a review"
            type="text"
            fullWidth
            variant="standard"
            value={formData.review}
            onChange={handleChange}
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
            <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth>
              <InputLabel htmlFor="keyType">Key Type</InputLabel>
              <Select
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
            required
            margin="dense"
            name="key"
            label="Key"
            type="text"
            fullWidth
            variant="standard"
            value={formData.key}
            onChange={handleChange}
            disabled={isEdit} // Prevent changing key when editing
          />
        </DialogContent>

        {/* Submit Button */}
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? "Update Book" : "Post a New Book"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormModal;
