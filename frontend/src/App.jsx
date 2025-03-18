import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, logout } from "./firebase";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [land, setLand] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <MainContent user={user} setUser={setUser} />
    </Router>
  );
}

// Helper component to conditionally render Header
function MainContent({ user, setUser }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Hide Header on Login & Register Pages */}
      {!(location.pathname === "/register" || location.pathname === "/login") && (
        <Header user={user} setUser={setUser}/>
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
