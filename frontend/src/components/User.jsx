import React, { useState,useEffect  } from 'react';
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
  InputAdornment
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
export default function User({
  setUser
}) {
  const currentUser = auth.currentUser;

  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteOpen, setDelOpen] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const openDel = () => setDelOpen(true);
  const closeDel = () => setDelOpen(false);

// Inside the component
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setEmail(user.email || '');
    }
  });

  return () => unsubscribe(); // Clean up listener
}, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (email === currentUser.email) {
      setError('❌ New email is the same as current email.');
      return;
    }

    try {
      // Step 1: Re-authenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Step 2: Update email in Firebase
      await updateEmail(currentUser, email);

      // Step 3: Send verification to new email
      await sendEmailVerification(currentUser);

      // Step 4: Update in PostgreSQL
      await fetch("http://localhost:3000/user/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: currentUser.uid, email }),
      });

      setMessage("✅ Email updated. Please verify your new email.");
      setError('');
      setCurrentPassword('');
    } catch (err) {
      console.error(err.code, err.message);
      setError("❌ " + err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("❌ Passwords do not match");
      setMessage('');
      return;
    }
  
    try {
      await firebaseUpdatePassword(currentUser, password);
      setMessage("✅ Password updated successfully!");
      setError('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Password update error:", err.code, err.message);
  
      switch (err.code) {
        case "auth/weak-password":
          setError("❌ Password is too weak. It should be at least 6 characters.");
          break;
        case "auth/requires-recent-login":
          setError("❌ Please re-authenticate to update your password.");
          break;
        case "auth/too-many-requests":
          setError("❌ Too many attempts. Try again later.");
          break;
        default:
          setError("❌ Failed to update password: " + err.message);
          break;
      }
  
      setMessage('');
    }
  };
  
  const confirmDeleteAccount = async () => {
    try {
      await fetch("http://localhost:3000/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: currentUser.uid }),
      });
  
      await firebaseDeleteUser(currentUser);
  
      setMessage("✅ Account deleted successfully!");
      setUser(null); // logout local state
      navigate("/"); // redirect
    } catch (err) {
      setError("❌ Failed to delete account");
    }
  };
  

  const signOut = async () => {
    if (!auth.currentUser) {
        setError("You're already signed out.");
        return;
      }


    try {
      await logout();
      setMessage("✅ Signed out successfully!");
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

      {/* Email Form */}
      <form onSubmit={handleEmailUpdate} style={{ marginBottom: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MailIcon sx={{ fontSize: 20, color: '#555' }} />
          <Typography variant="subtitle1" color="text.secondary">
            Update Email
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            label="New Email"
            variant="outlined"
          />
          <TextField
            label="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: 'black',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            Update Email
          </Button>
        </Stack>
      </form>

      {/* Password Update */}
      <form onSubmit={handlePasswordUpdate} style={{ marginBottom: '2rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <KeyIcon sx={{ fontSize: 20, color: '#555' }} />
          <Typography variant="subtitle1" color="text.secondary">
            Change Password
          </Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            label="New Password"
            variant="outlined"
          />
          <TextField
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            label="Confirm Password"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: 'black',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#333' },
            }}
          >
            Update Password
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }} />

      {/* Sign Out & Delete */}
      <Stack spacing={2}>
        <Button
          onClick={signOut}
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            color: '#444',
            borderColor: '#ccc',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Sign Out
        </Button>

        <Button
  onClick={openDel}
  variant="outlined"
  color="error"
  fullWidth
  startIcon={<DeleteIcon />}
  sx={{
    backgroundColor: '#ffe5e5',
    textTransform: 'none',
    fontSize: '1rem',
    color: '#b30000',
    borderColor: '#fca5a5',
    '&:hover': {
      backgroundColor: '#ffcaca',
    },
  }}
>
  Delete Account
</Button>

      </Stack>
      <Delete
  isOpen={isDeleteOpen}
  onClose={closeDel}
  onConfirm={confirmDeleteAccount}
  title="Delete Account"
  message="Are you sure you want to delete your account? This will permanently remove all your data."
  confirmLabel="Delete Account"
  confirmColor="red"
/>

    </Paper>
    </Box>
  );
}
