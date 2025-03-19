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
import { loginWithGoogle, registerWithEmail } from "../firebase";

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent duplicate submissions

  // Toggle Password Visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // ✅ Helper function to send user data to backend
  const apiReq = async (userRegistered) => {
    try {
      const formData = { email: userRegistered.user.email, uid: userRegistered.user.uid };
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        alert("❌ This email already exists in the database!");
      } else if (response.status === 201) {
        console.log("✅ User successfully registered:", userRegistered.user);
        onLogin(userRegistered.user); // ✅ Correctly pass the full user object
        navigate("/home");
        alert("✅ Account created successfully!");
      } else {
        console.error("Failed to register user:", await response.text());
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // ✅ Handle Email Registration
  const handleEmailRegister = async (event) => {
    event.preventDefault(); // ✅ Prevent page reload
    if (isSubmitting) return; // ✅ Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      const userRegistered = await registerWithEmail(email, password);
      console.log("✅ Registered user:", userRegistered.user);
      await apiReq(userRegistered);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userReg = await loginWithGoogle();
      console.log("✅ Google registered user:", userReg.user);
      await apiReq(userReg);
      alert("✅ Signed in with Google!");
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
            <Button className="login-signup" size="small" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>

          {/* ✅ Google Signup Button */}
          <button className="google-signup" onClick={handleGoogleSignIn} disabled={isSubmitting}>
            <img src="/google.png" alt="Google logo" className="google-img" />
            Sign up with Google
          </button>

          <Box>
            <div className="or">or</div>

            {/* ✅ Form Submission Correctly Calls `handleEmailRegister` */}
            <form onSubmit={handleEmailRegister}>
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

              {/* ✅ Register Button - Now Works Correctly */}
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
