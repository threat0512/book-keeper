import { Box, Typography, Link, Stack } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import PolicyModal from './PolicyModal';
import { useState } from 'react';

/**
 * Footer Component
 * 
 * A responsive footer component that includes navigation links, category filters,
 * and policy information. Features quick links for filtering books by status and category.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [policyModal, setPolicyModal] = useState({
    open: false,
    type: null
  });

  // Navigation handlers
  const handleStatusClick = (status) => {
    navigate('/dashboard', { 
      state: { 
        selectedStatus: status,
        resetFilters: true // Reset existing filters before applying new one
      } 
    });
  };

  const handleCategoryClick = (category) => {
    navigate('/dashboard', { 
      state: { 
        selectedCategory: category,
        resetFilters: true // Reset existing filters before applying new one
      } 
    });
  };

  const handleHomeClick = () => {
    navigate('/dashboard', { 
      state: { 
        resetFilters: true // Reset all filters
      } 
    });
  };

  // Email and policy handlers
  const handleMailClick = () => {
    window.location.href = 'mailto:bookieHelp@gmail.com';
  };

  const handlePolicyClick = (type) => {
    setPolicyModal({ open: true, type });
  };

  const handleCloseModal = () => {
    setPolicyModal({ open: false, type: null });
  };

  // Styles for consistent footer appearance
  const styles = {
    footer: {
      backgroundColor: '#1e1e1e',
      color: '#ccc',
      px: 2,
      py: 6,
      mt: 8,
    },
    gridContainer: {
      maxWidth: '1200px',
      mx: 'auto',
      display: 'grid',
      gridTemplateColumns: { 
        xs: '1fr', 
        sm: 'repeat(2, 1fr)', 
        md: 'repeat(4, 1fr)' 
      },
      gap: 4,
      mb: 6,
    },
    link: {
      textAlign: 'left'
    },
    mailIcon: {
      display: 'flex',
      alignItems: 'center',
      '&:hover': {
        color: '#fff'
      }
    },
    bottomBar: {
      borderTop: '1px solid #333',
      pt: 3,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
    }
  };

  return (
    <Box component="footer" sx={styles.footer}>
      {/* Grid Content */}
      <Box sx={styles.gridContainer}>
        {/* About Us Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body2">
            Track what you're reading, what you've finished, and what's next on your shelf.
            Made with love for book lovers everywhere.
          </Typography>
        </Box>

        {/* Quick Links Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            <Link 
              component="button" 
              onClick={handleHomeClick}
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Home
            </Link>
            <Link 
              component="button" 
              onClick={() => handleStatusClick('Reading')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Reading now
            </Link>
            <Link 
              component="button" 
              onClick={() => handleStatusClick('Upcoming')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Upcoming
            </Link>
            <Link 
              component="button" 
              onClick={() => handleStatusClick('Completed')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Completed
            </Link>
          </Stack>
        </Box>

        {/* Categories Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Stack spacing={1}>
            <Link 
              component="button" 
              onClick={() => handleCategoryClick('Others')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Others
            </Link>
            <Link 
              component="button" 
              onClick={() => handleCategoryClick('Mystery')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Mystery
            </Link>
            <Link 
              component="button" 
              onClick={() => handleCategoryClick('Romance')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Romance
            </Link>
            <Link 
              component="button" 
              onClick={() => handleCategoryClick('Science Fiction')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Science Fiction
            </Link>
            <Link 
              component="button" 
              onClick={() => handleCategoryClick('Self-Help')} 
              color="inherit" 
              underline="hover"
              sx={styles.link}
            >
              Self-Help
            </Link>
          </Stack>
        </Box>

        {/* Connect Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Connect With Us
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Link 
              component="button" 
              onClick={handleMailClick} 
              color="inherit"
              sx={styles.mailIcon}
            >
              <MailOutlineIcon fontSize="small" />
            </Link>
          </Stack>
          <Typography variant="body2">
            Subscribe to our newsletter for weekly book recommendations!
          </Typography>
        </Box>
      </Box>

      {/* Bottom Bar */}
      <Box sx={styles.bottomBar}>
        <Typography variant="body2">
          © {currentYear} <strong>Bookie</strong>. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Link 
            component="button"
            onClick={() => handlePolicyClick('privacy')}
            color="inherit" 
            underline="hover"
            sx={styles.link}
          >
            Privacy Policy
          </Link>
          <Link 
            component="button"
            onClick={() => handlePolicyClick('terms')}
            color="inherit" 
            underline="hover"
            sx={styles.link}
          >
            Terms of Service
          </Link>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Made with</Typography>
            <FavoriteBorderIcon fontSize="small" sx={{ color: 'red' }} />
            <Typography variant="body2">by ThreaT</Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Policy Modal */}
      <PolicyModal 
        open={policyModal.open}
        onClose={handleCloseModal}
        type={policyModal.type}
      />
    </Box>
  );
};

export default Footer;
