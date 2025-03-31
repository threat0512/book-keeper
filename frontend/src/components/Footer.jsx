import { Box, Typography, Link, Stack } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1e1e1e',
        color: '#ccc',
        px: 2,
        py: 6,
        mt: 8,
      }}
    >
      {/* Grid Content */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 4,
          mb: 6,
        }}
      >
        {/* About Us */}
        <Box>
          <Typography variant="h6" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body2">
          Track what you're reading, what you've finished, and what's next on your shelf.
          Made with love for book lovers everywhere.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Stack spacing={1}>
            <Link href="/" color="inherit" underline="hover">Home</Link>
            <Link href="/" color="inherit" underline="hover">Reading now</Link>
            <Link href="/" color="inherit" underline="hover">Upcoming</Link>
            <Link href="/" color="inherit" underline="hover">Completed</Link>
          </Stack>
        </Box>

        {/* Categories */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <Stack spacing={1}>
            <Link href="#" color="inherit" underline="hover">Fiction</Link>
            <Link href="#" color="inherit" underline="hover">Mystery</Link>
            <Link href="#" color="inherit" underline="hover">Romance</Link>
            <Link href="#" color="inherit" underline="hover">Science Fiction</Link>
          </Stack>
        </Box>

        {/* Connect */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Connect With Us
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Link href="#" color="inherit">
              <MailOutlineIcon fontSize="small" />
            </Link>
          </Stack>
          <Typography variant="body2">
            Subscribe to our newsletter for weekly book recommendations!
          </Typography>
        </Box>
      </Box>

      {/* Bottom Bar */}
      <Box
        sx={{
          borderTop: '1px solid #333',
          pt: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2">
          © {currentYear} <strong>Bookie</strong>. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Link href="#" color="inherit" underline="hover">Privacy Policy</Link>
          <Link href="#" color="inherit" underline="hover">Terms of Service</Link>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Made with</Typography>
            <FavoriteBorderIcon fontSize="small" sx={{ color: 'red' }} />
            <Typography variant="body2">by ThreaT</Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
