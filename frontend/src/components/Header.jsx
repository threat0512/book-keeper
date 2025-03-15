
import { useState } from "react";
import { Button, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
function Header({ user, setUser }) {
  const [isModalOpen, setModal] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleLogout = async () => {
    await logout();
    setUser(null); // ✅ Reset user state
    navigate("/"); // ✅ Redirect to home
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#B9B28A",
        boxShadow: "none",
        borderBottom: "1px solid #f1f1f1",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            color: "black",
            letterSpacing: "-0.5px",
            "& span:first-of-type": { fontWeight: 500 },
            "& span:last-of-type": { color: "rgba(0,0,0,0.4)" },
          }}
        >
          <span style={{ fontSize: "45px", fontWeight: "bold" }}><ImportContactsIcon sx={{ fontSize: 35 }}/>bookie</span>
          <span style={{ fontSize: "40px", fontWeight: "bold" }}>.</span>
        </Typography>

        {/* Buttons aligned to the right */}
        <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
          {/* Add New Book Button (Only When Logged In) */}
          {user && (
            <Button
              onClick={openModal}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "black",
                borderRadius: "8px",
                textTransform: "none",
                padding: "8px 24px",
                fontSize: "0.95rem",
                fontWeight: 400,
                boxShadow: "none",
                "&:hover": {
              
                  boxShadow: "none",
                },
              }}
              startIcon={<AddIcon />}
            >
              Add a New Book
            </Button>
          )}

          {/* Login / Logout Button */}
          <Button
            onClick={() => user ? handleLogout() : navigate("/login")}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "8px",
              fontWeight: "500",
              textTransform: "none",
              padding: "8px 24px",
              fontSize: "0.95rem",
              boxShadow: "none",
              "&:hover": {
        
                boxShadow: "none",
              },
            }}
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Stack>
      </Toolbar>

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </AppBar>
  );
}

export default Header;
