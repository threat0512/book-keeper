import React, { useState } from "react";
import Delete from "./Delete";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Rating,
  TextField,
  Box,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import FaceIcon from "@mui/icons-material/Face";
import CategoryIcon from '@mui/icons-material/Category';
import Modal from "./Modal"; // Import the Modal component
export default function Book(props) {
  const [isModalOpen, setModal] = useState(false);
  const [isEditOpen, setEdit] = useState(false);
  const [bookData, setBookData] = useState({});
  const [isDeleteOpen, setDelOpen] = useState(false);

  const openDel = () => setDelOpen(true);
  const closeDel = () => setDelOpen(false);

  const openModal = async () => {
    setModal(true);
    setEdit(true);

    try {
      const response = await fetch(
        `http://localhost:3000/getData/${props.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookData(data);
      } else {
        console.error("Failed to fetch book details:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
    setEdit(false);
    setBookData({});
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        height: "200px",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          "& .edit-delete-buttons": {
            display: "flex",
            opacity: 1,
          },
        },
        overflow: "hidden",
        borderRadius: 2,
        marginBottom: "1%",
        position: "relative",
      }}
    >
      {/* Book Cover */}
      <Box
        sx={{
          width: "140px",
          flexShrink: 0,
          position: "relative",
          height: "200px",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          image={props.cover}
          alt={props.title}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          p: 2,
          overflow: "hidden",
        }}
      >
        <>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "bold",
              fontSize: "1.1em",
              marginBottom: "0px"
            }}
          >
            {props.author}
          </Typography>
          <Box 
  sx={{ 
    display: "flex",  // Aligns items in the same row
    alignItems: "center", // Ensures proper vertical alignment
    gap: 1,  // Adds spacing between Chips
    flexWrap: "wrap", // Ensures proper wrapping if screen is small
    marginBottom: "5px"
  }}
>
  <Chip
    icon={<CategoryIcon sx={{ flexShrink: 0 }} />}
    label={props.category}
    size="small"
    sx={{
      display: "flex",
      alignItems: "center",
      width: "auto",
      maxWidth: "fit-content",
      minWidth: 80,
      paddingRight: "8px",
    }}
  />
  
  <Chip
    icon={<CategoryIcon sx={{ flexShrink: 0 }} />}
    label={props.status}
    size="small"
    sx={{
      display: "flex",
      alignItems: "center",
      width: "auto",
      maxWidth: "fit-content",
      minWidth: 80,
      paddingRight: "8px",
    }}
  />
</Box>

          

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating
              value={props.rating}
              precision={0.5}
              readOnly
              size="small"
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            {props.review ||
              "A captivating book that takes readers on an unforgettable journey through its pages, offering insights and entertainment in equal measure."}
          </Typography>
        </>
      </Box>

      {/* Edit/Delete Buttons */}
      <Box
        className="edit-delete-buttons"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          opacity: 0,
          gap: 1,
          backgroundColor: "black",
          borderRadius: "20px",
          padding: "4px",
          zIndex: 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <IconButton size="small" onClick={openModal} sx={{ color: "white" }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={openDel}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        isEdit={isEditOpen}
        bookData={bookData}
        userid={props.user}
        onBookUpdated={props.onDelete}
      />
      <Delete
        isOpen={isDeleteOpen}
        onClose={closeDel}
        bookId={props.id}
        userid={props.user}
        onDelete={props.onDelete}
      />
    </Paper>
  );
}
