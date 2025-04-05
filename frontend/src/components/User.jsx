import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Mail as MailIcon,
  Key as KeyIcon,
  Logout as LogoutIcon,
  DeleteForever as DeleteIcon,
  LibraryBooks,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import "../styles/User.css";
import {
  auth,
  logout
} from '../firebase';

import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
  onAuthStateChanged 
} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import Delete from "./Delete";

export default function User({ setUser }) {
  const currentUser = auth.currentUser;
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteOpen, setDelOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const navigate = useNavigate();

  const openDel = () => setDelOpen(true);
  const closeDel = () => setDelOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('❌ You must be logged in to update your email.');
      return;
    }

    if (email === currentUser.email) {
      setError('❌ New email is the same as current email.');
      return;
    }

    if (!currentPassword) {
      setError('❌ Please enter your current password to update email.');
      return;
    }

    setIsEmailLoading(true);
    setError('');
    setMessage('');

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update email
      await updateEmail(currentUser, email);
      await sendEmailVerification(currentUser);
      
      setMessage("✅ Email updated successfully! Please check your new email for verification.");
      setCurrentPassword('');
    } catch (err) {
      console.error("Email update error:", err.code, err.message);
      
      switch (err.code) {
        case 'auth/requires-recent-login':
          setError('❌ For security reasons, please re-enter your password to update email.');
          break;
        case 'auth/invalid-password':
          setError('❌ The password you entered is incorrect. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('❌ This email is already registered with another account.');
          break;
        case 'auth/invalid-email':
          setError('❌ Please enter a valid email address.');
          break;
        default:
          setError('❌ Failed to update email: ' + err.message);
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('❌ You must be logged in to update your password.');
      return;
    }

    if (!currentPassword) {
      setError('❌ Please enter your current password.');
      return;
    }

    if (password !== confirmPassword) {
      setError("❌ New passwords do not match. Please try again.");
      setMessage('');
      return;
    }

    if (password.length < 6) {
      setError("❌ New password must be at least 6 characters long.");
      return;
    }

    if (password === currentPassword) {
      setError("❌ New password cannot be the same as your current password.");
      return;
    }

    setIsPasswordLoading(true);
    setError('');
    setMessage('');

    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await firebaseUpdatePassword(currentUser, password);
      
      setMessage("✅ Password updated successfully! Please use your new password for future logins.");
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (err) {
      console.error("Password update error:", err.code, err.message);

      switch (err.code) {
        case "auth/weak-password":
          setError("❌ Password is too weak. Please use at least 6 characters with a mix of letters and numbers.");
          break;
        case "auth/requires-recent-login":
          setError("❌ For security reasons, please re-enter your current password.");
          break;
        case "auth/invalid-password":
          setError("❌ The current password you entered is incorrect. Please try again.");
          break;
        case "auth/too-many-requests":
          setError("❌ Too many attempts. For security reasons, please try again later.");
          break;
        default:
          setError("❌ Failed to update password: " + err.message);
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  const confirmDeleteAccount = async () => {
    if (!currentUser) {
      setError("❌ You must be logged in to delete your account.");
      return;
    }

    try {
      setMessage("🔄 Deleting your account...");
      await fetch("http://localhost:3000/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: currentUser.uid }),
      });
  
      await firebaseDeleteUser(currentUser);
  
      setMessage("✅ Your account has been successfully deleted. We're sorry to see you go!");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Delete account error:", err);
      setError("❌ Failed to delete account. Please try again or contact support if the problem persists.");
    }
  };
  
  const signOut = async () => {
    if (!auth.currentUser) {
      setError("❌ You're already signed out.");
      return;
    }

    try {
      setMessage("🔄 Signing you out...");
      await logout();
      setMessage("✅ You've been successfully signed out. See you next time!");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err.code, err.message);
      setError("❌ Failed to sign out: " + err.message);
    }
  };
  
  return (
    <Box
    className="mainBox"
    sx={{
      marginTop: '0px'
    }}
    
  >
    {/* App Branding */}
    <Box sx={{ textAlign: 'center', mb: 5 }}>
  <LibraryBooks
  className="logo-icon" 
  />
  <Typography
    variant="h4"            // 🔥 Bigger app name
   className="logo-text"
  >
    Bookie
  </Typography>
  <Typography variant="subtitle1" color="text.secondary">
    Account Settings
  </Typography>
</Box>


    {/* Settings Card */}
    <Paper
      elevation={3}
      sx={{
        maxWidth: '600px',
        mx: 'auto',
        p: 4,
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SettingsIcon sx={{ fontSize: 28, color: '#2F3C7E' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>
          Account Settings
        </Typography>
      </Box>

      {/* Alerts */}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email Update Form */}
      <form onSubmit={handleEmailUpdate}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailIcon /> Email Settings
          </Typography>
          <TextField
            label="New Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isEmailLoading}
            sx={{ 
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: '#333333'
              },
              '&:disabled': {
                bgcolor: '#666666',
                color: '#ffffff80'
              }
            }}
          >
            {isEmailLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Updating Email...
              </>
            ) : (
              "Update Email"
            )}
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 4 }} />

      {/* Password Update Form */}
      <form onSubmit={handlePasswordUpdate}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyIcon /> Password Settings
          </Typography>
          <TextField
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isPasswordLoading}
            sx={{ 
              mt: 2,
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: '#333333'
              },
              '&:disabled': {
                bgcolor: '#666666',
                color: '#ffffff80'
              }
            }}
          >
            {isPasswordLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 4 }} />

      {/* Account Actions */}
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon /> Account Actions
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openDel}
          className="delete-button"
          sx={{
            borderColor: '#d32f2f',
            color: '#d32f2f',
            '&:hover': {
              bgcolor: '#d32f2f0a',
              borderColor: '#d32f2f'
            }
          }}
        >
          Delete Account
        </Button>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={signOut}
          sx={{
            borderColor: '#666666',
            color: '#666666',
            '&:hover': {
              bgcolor: '#6666660a',
              borderColor: '#666666'
            }
          }}
        >
          Sign Out
        </Button>
      </Stack>

      {/* Delete Account Dialog */}
      <Delete
        isOpen={isDeleteOpen}
        onClose={closeDel}
        onConfirm={confirmDeleteAccount}
        title="Delete Account?"
        message="This will permanently delete your account and all your data. This action cannot be undone."
      />

    </Paper>
    </Box>
  );
}
