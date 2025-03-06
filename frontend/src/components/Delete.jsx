import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function Delete({ isOpen, onClose, bookId }) {
  // Handle form submission
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
        setTimeout(() => window.location.reload(), 500); // ✅ Delay refresh
      } else {
        console.error("❌ Failed to delete book:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error deleting book:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">{"Delete this book?"}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "grey",
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* FORM STARTS HERE */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText>
            Deleting this book will result in complete removal from our database.
            Are you sure?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Delete book
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
