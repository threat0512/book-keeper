import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/User"; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <MainContent user={user} setUser={setUser} onLogin={handleLogin} />
    </Router>
  );
}

function MainContent({ user, setUser, onLogin }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {!["/register", "/login", "/", "/user"].includes(location.pathname) && (
        <Header user={user} setUser={setUser} />
      )}

      <main className="container mx-auto px-8 py-12">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register onLogin={onLogin} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/user" element={<User user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
