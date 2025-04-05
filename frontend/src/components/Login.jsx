// ...imports remain unchanged
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/Register.css";
import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Button, Alert } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
// ...other imports remain unchanged
import { sendPasswordResetEmail } from "firebase/auth"; // ✅ added sendPasswordResetEmail


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait and try again later.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Signed in successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(getFriendlyError(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("✅ Signed in with Google!");
      navigate("/dashboard");
    } catch (error) {
      
      console.error("Google sign-in error:", error);
      setError(getFriendlyError(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('');
      setError("Please enter your email above to receive a reset link.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError('');
      setMessage("📧 Verification code sent to your registered email.");
    } catch (error) {
      setMessage('');
      console.error("Forgot password error:", error);
      setError(getFriendlyError(error.code));
    }
  };

  return (
    <div className="reg">
      {/* Left Panel */}
      <div className="leftReg">
        <div className="leftText">
          <h1>bookie.</h1>
          <h2>Welcome Back!</h2>
          <h2>Your books are waiting for you.</h2>
        </div>
      </div>

      {/* Right Panel */}
      <div className="rightReg">
        <div className="rightText">
          <h1>Sign In</h1>
          <div className="login">
            Don't have an account?
            <Button className="signup-button" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </div>

          <button className="google-signup" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <img src="/google.png" alt="Google logo" className="google-img" />
            Sign in with Google
          </button>

          <Box>
            <div className="or">or</div>

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

            <form onSubmit={handleEmailLogin}>
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <FormControl sx={{ width: "100%", marginTop: "10px" }} required>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "hide the password" : "show the password"}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <div className="forgot-password">
                <Button className="forgot-password-link" onClick={handleForgotPassword}>
                  Forgot Password?
                </Button>
              </div>

              <Button className="login-btn" type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
}
