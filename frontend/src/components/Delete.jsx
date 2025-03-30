import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Delete({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete Permanently",
  confirmColor = "red",
  bookId = null,
  userid = null,
}) {
  const handleBookDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${userid}/${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 409) {
        alert("❌ This book does not exist in the database!");
      } else if (response.ok) {
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        console.error("❌ Failed to delete book:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error deleting book:", error);
    }
  };

  const handleConfirm = () => {
    if (bookId && userid) {
      handleBookDelete(); // internal logic for books
    } else if (onConfirm) {
      onConfirm(); // external logic (e.g., account deletion)
    }
    onClose(); // close in both cases
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
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        <WarningAmberIcon sx={{ color: "red", fontSize: "30px" }} />
        {title}
      </DialogTitle>

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

      <DialogContent>
        <Typography
          variant="body1"
          sx={{ color: "gray", textAlign: "center", fontSize: "1rem", mb: 2 }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
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
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: confirmColor,
            borderRadius: "8px",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: confirmColor === "red" ? "#b30000" : confirmColor,
            },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
