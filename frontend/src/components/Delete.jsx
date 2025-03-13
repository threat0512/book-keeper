import * as React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Slide Animation for Modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Delete({ isOpen, onClose, bookId }) {
  // Handle book deletion
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      const response = await fetch(`http://localhost:3000/delete/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 409) {
        alert("❌ This book does not exist in the database!");
      } else if (response.ok) {
        console.log("✅ Deletion successful");

        onClose(); // ✅ Close modal first
        setTimeout(() => window.location.reload(), 500); // ✅ Delay refresh slightly for smooth UX
      } else {
        console.error("❌ Failed to delete book:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error deleting book:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "400px",
        },
      }}
    >
      {/* Title with Warning Icon */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.5rem", fontWeight: "bold" }}>
        <WarningAmberIcon sx={{ color: "red", fontSize: "30px" }} />
        Delete this book?
      </DialogTitle>

      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
          color: "#555",
          transition: "0.3s",
          "&:hover": { color: "black", transform: "rotate(90deg)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Warning Message */}
      <DialogContent>
        <Typography variant="body1" sx={{ color: "gray", textAlign: "center", fontSize: "1rem", marginBottom: "15px" }}>
          Deleting this book will permanently remove it from the database. This action <strong>cannot</strong> be undone.
        </Typography>
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions sx={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
        <Button 
          onClick={onClose} 
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
          onClick={handleSubmit}
          sx={{
            backgroundColor: "red",
            borderRadius: "8px",
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#b30000" },
          }}
        >
          Delete Permanently
        </Button>
      </DialogActions>
    </Dialog>
  );
}
