import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, logout } from "./firebase";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";

function App() {
  const [landStatus, setLand] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <MainContent landStatus={landStatus} user={user} />
    </Router>
  );
}

// Helper component to conditionally render Header
function MainContent({ landStatus, user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Only show header if not on login/register page */}
      {!(location.pathname === "/register" || location.pathname === "/login") && (
        <Header landing={landStatus} />
      )}

      <main className="container mx-auto px-8 py-12">
        <Routes>
          <Route path="/" element={user ? <Home user={user} /> : <LandingPage />} />
          <Route path="/register" element={user ? <Home user={user} /> : <Register onLogin={setUser}/>} />
          <Route path="/login" element={user ? <Home user={user} /> : <Login onLogin={setUser} />} />
          <Route path="/home" element={user ? <Home user={user} /> : <Login onLogin={setUser}/>} />
        </Routes>
      </main> 

      {/* ✅ Show Logout Button If User is Logged In */}
      {user && (
        <button
          onClick={() => {
            logout();
            navigate("/"); // Redirect to landing page after logout
          }}
          className="logout-button"
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            padding: "8px 16px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default App;
