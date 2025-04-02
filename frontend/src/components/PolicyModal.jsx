import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Security, LibraryBooks, Favorite, EmojiEmotions, Lock, Celebration } from '@mui/icons-material';

/**
 * PolicyModal Component
 * 
 * A reusable modal component that displays either Privacy Policy or Terms of Service
 * content in a user-friendly and engaging format.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls the visibility of the modal
 * @param {function} props.onClose - Callback function to close the modal
 * @param {string} props.type - Type of policy to display ('privacy' or 'terms')
 */
const PolicyModal = ({ open, onClose, type }) => {
  const isPrivacyPolicy = type === 'privacy';

  // Content for Privacy Policy with icons and friendly messages
  const privacyContent = [
    {
      icon: <Lock />,
      text: "Your book list is your secret garden! We won't peek or share it with anyone. 📚"
    },
    {
      icon: <LibraryBooks />,
      text: "We only store what you share: your email, book lists, and ratings. No sneaky stuff! 🎯"
    },
    {
      icon: <Favorite />,
      text: "Your reading preferences help us make better recommendations, just for you! ❤️"
    }
  ];

  // Content for Terms of Service with icons and friendly messages
  const termsContent = [
    {
      icon: <EmojiEmotions />,
      text: "Be nice! This is a happy place for book lovers. 😊"
    },
    {
      icon: <Security />,
      text: "Keep your account secure - it's your cozy reading corner! 🏠"
    },
    {
      icon: <Celebration />,
      text: "Have fun organizing your books and discovering new reads! 🎉"
    }
  ];

  // Styles for consistent modal appearance
  const styles = {
    dialog: {
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: 24,
    },
    title: {
      bgcolor: 'primary.main',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    },
    content: {
      mt: 2
    },
    listItem: {
      py: 2
    },
    icon: {
      color: 'primary.main'
    },
    text: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    button: {
      borderRadius: 2,
      textTransform: 'none',
      px: 4
    },
    actions: {
      p: 3,
      bgcolor: 'background.paper'
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: styles.dialog }}
    >
      <DialogTitle sx={styles.title}>
        {isPrivacyPolicy ? <Lock /> : <Security />}
        {isPrivacyPolicy ? "Privacy Policy" : "Terms of Service"}
      </DialogTitle>

      <DialogContent sx={styles.content}>
        {/* Header message */}
        <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
          {isPrivacyPolicy 
            ? "Here's how we keep your bookish adventures private and secure! 🔒"
            : "Quick rules for a great experience in our book-loving community! 📚"
          }
        </Typography>

        {/* Policy content list */}
        <List>
          {(isPrivacyPolicy ? privacyContent : termsContent).map((item, index) => (
            <ListItem key={index} sx={styles.listItem}>
              <ListItemIcon sx={styles.icon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  style: styles.text
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={styles.actions}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={styles.button}
        >
          Got it! 👍
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyModal; 