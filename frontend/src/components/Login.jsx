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
import { Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, loginWithEmail } from "../firebase";

export default function Login({ onLogin }) {
  // State for managing form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents duplicate submission
  const navigate = useNavigate();

  // Toggle Password Visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // ✅ Handle Email Login
  const handleEmailLogin = async (event) => {
    event.preventDefault(); // ✅ Prevents page refresh
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      const userCredential = await loginWithEmail(email, password);
      console.log("✅ Logged in user:", userCredential.user);
      onLogin(userCredential.user); // ✅ Correctly update parent state
      navigate("/home"); // ✅ Redirect to home after login
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userCredential = await loginWithGoogle();
      console.log("✅ Google logged in user:", userCredential.user);
      onLogin(userCredential.user);
      navigate("/home");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
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

          {/* ✅ Google Signup Button */}
          <button className="google-signup" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <img src="/google.png" alt="Google logo" className="google-img" />
            Sign in with Google
          </button>

          <Box>
            <div className="or">or</div>

            {/* ✅ Form Handles Submission Properly */}
            <form onSubmit={handleEmailLogin}>
              {/* Email Input */}
              <TextField
                sx={{ width: "100%" }}
                margin="dense"
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Input */}
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

              {/* Forgot Password */}
              <div className="forgot-password">
                <Button className="forgot-password-link">Forgot Password?</Button>
              </div>

              {/* ✅ Submit Button (Now Works Correctly) */}
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
