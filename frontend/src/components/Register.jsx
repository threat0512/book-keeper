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
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // 🔧 Friendly error messages for common Firebase errors
  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Google sign-up was cancelled.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const registerUserInDb = async (email, uid) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, uid }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register user in database");
      }

      return await response.json();
    } catch (err) {
      console.error("Backend registration error:", err);
      throw err;
    }
  };

  const handleEmailRegister = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      await registerUserInDb(email, user.uid);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(getFriendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      await registerUserInDb(user.email, user.uid);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(getFriendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reg">
      {/* Left Panel */}
      <div className="leftReg">
        <div className="leftText">
          <h1>bookie.</h1>
          <h2>Your Digital Bookshelf.</h2>
          <h2>Anytime. Anywhere.</h2>
        </div>
      </div>

      {/* Right Panel */}
      <div className="rightReg">
        <div className="rightText">
          <h1>Create an account</h1>
          <div className="login">
            Already have an account?{" "}
            <Button className="login-signup" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Google Signup Button */}
          <button className="google-signup" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <img src="/google.png" alt="Google logo" className="google-img" />
            Sign up with Google
          </button>

          <Box>
            <div className="or">or</div>

            {/* Form Submission */}
            <form onSubmit={handleEmailRegister}>
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

              <FormControl sx={{ width: "100%", marginTop: "10px" }} required>
                <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  label="Confirm Password"
                />
              </FormControl>

              <Button className="register-btn" type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
}
