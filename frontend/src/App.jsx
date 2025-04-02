import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/User"; 
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "./utils/cookieUtils";

function App() {
  const [user, setUser] = useState(null);

  // Check for existing user cookie on component mount
  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        deleteCookie('user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Store user data in cookie for 2 days
    setCookie('user', JSON.stringify(userData), 2);
  };

  const handleLogout = () => {
    setUser(null);
    deleteCookie('user');
  };

  return (
    <Router>
      <MainContent 
        user={user} 
        setUser={setUser} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </Router>
  );
}

function MainContent({ user, setUser, onLogin, onLogout }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {!["/register", "/login", "/", "/user"].includes(location.pathname) && (
        <Header user={user} setUser={setUser} onLogout={onLogout} />
      )}

      <main className="container mx-auto px-8 py-12">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/home" replace /> : <LandingPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/home" replace /> : <Register onLogin={onLogin} />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/home" replace /> : <Login onLogin={onLogin} />} 
          />
          <Route 
            path="/home" 
            element={user ? <Home user={user} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/user" 
            element={user ? <User user={user} /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
