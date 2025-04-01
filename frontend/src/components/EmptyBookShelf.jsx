import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Modal from "./Modal";

const EmptyBookShelf = ({ user, onBookAdded }) => {
  const [isModalOpen, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => {
    setModal(false);
    if (onBookAdded) {
      onBookAdded();
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        minHeight: 400,
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        p: 4,
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          My Book Shelf
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openModal}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
            transition: 'all 0.2s ease-in-out',
            borderRadius: '50px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Add Book
        </Button>
      </Box>
      
      <Box 
        sx={{ 
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'grey.300',
          borderRadius: 2,
          bgcolor: 'grey.50',
          p: 4
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          Your book shelf is empty
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Start by adding your first book!
        </Typography>
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        userid={user?.uid}
      />
    </Paper>
  );
};

export default EmptyBookShelf; 