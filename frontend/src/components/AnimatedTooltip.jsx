import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AnimatedTooltip = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '96px', // 24 * 4px = 96px
        right: '32px', // 8 * 4px = 32px
        width: '256px', // 64 * 4px = 256px
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Triangle pointer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-8px',
          right: '32px',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderTop: '8px solid white',
          borderRight: '8px solid transparent',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
        }}
      />
      
      {/* Main tooltip box */}
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          bgcolor: 'white',
          borderRadius: 2,
          p: 2,
          border: '2px solid',
          borderColor: 'primary.light',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          size="small"
          aria-label="Close tooltip"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2" color="primary">
            Hi there! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            I'm bibble, your personal reading companion! Click me to get personalized book recommendations based on your interests!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AnimatedTooltip; 