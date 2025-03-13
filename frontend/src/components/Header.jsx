import { useState } from "react";
import { Button, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./Modal";
import NavLink from "./NavLink";

function Header({ landing }) {
  const [isModalOpen, setModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#B85042",
        boxShadow: "none",
        borderBottom: "1px solid #f1f1f1",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{
            color: "black",
            letterSpacing: "-0.5px",
            "& span:first-of-type": { fontWeight: 500 },
            "& span:last-of-type": { color: "rgba(0,0,0,0.4)" },
          }}
        >
          {/* <span>
            <img src={logo} alt="Bookie Logo" width="50" height="50" />
          </span> */}
          <span style={{ fontSize: "40px", fontWeight: "bold" }}>bookie</span>
          <span style={{ fontSize: "40px", fontWeight: "bold" }}>.</span>
        </Typography>

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
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              boxShadow: "none",
            },
          }}
          startIcon={!landing ? <AddIcon /> : null}
        >
          {landing ? "Login" : "add a new book"}
        </Button>
      </Toolbar>

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </AppBar>
  );
}

export default Header;
