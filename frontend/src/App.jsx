import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.uid || "No user logged in");
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router> {/* ✅ Wrap everything inside <Router> */}
      <MainContent user={user} setUser={setUser} />
    </Router>
  );
}

// ✅ Move useLocation() inside MainContent
function MainContent({ user, setUser }) {
  const location = useLocation();
  const isLanding = location.pathname === "/"; // ✅ Now it's inside <Router>

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Hide Header on Login, Register, and Landing Page */}
      {!["/register", "/login", "/"].includes(location.pathname) && (
        <Header user={user} setUser={setUser} />
      )}

      <main className="container mx-auto px-8 py-12">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/home" element={<Home user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
