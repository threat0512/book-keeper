import React from 'react';
import { LibraryBooks, MenuBook, Bookmark, TrendingUp, PersonAdd, LibraryAdd, Timeline } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <nav className="navbar">
      <div className="navbar-content">
        <a href="/" className="logo">
          <LibraryBooks /> Bookie.
        </a>
        <div className="nav-links">
          <button
            className="btn-get-started"
            onClick={() => (navigate("/login"))}
          >
            Log in
          </button>
        </div>
      </div>
    </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="hero-section">
          <h1 className="hero-title">
            Your Reading Journey Starts Here
          </h1>
          <p className="hero-description">
            Join thousands of readers who use Bookie to track their reading progress, discover new books, and connect with fellow book lovers.
          </p>
          <div className="cta-buttons">
            <button className="btn-get-started" onClick={() => (navigate("/register"))}>
              Get Started - It's Free
            </button>
            
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(27, 58, 75, 0.1)' }}>
              <MenuBook style={{ color: '#1B3A4B', fontSize: '1.75rem' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Your Reading</h3>
            <p className="text-gray-600">
              Log books, set reading goals, and monitor your progress over time.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(27, 58, 75, 0.1)' }}>
              <Bookmark style={{ color: '#2C5364', fontSize: '1.75rem' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Your Library</h3>
            <p className="text-gray-600">
              Create your digital bookshelf and organize your collection your way.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper" style={{ background: 'rgba(27, 58, 75, 0.1)' }}>
              <TrendingUp style={{ color: '#006D77', fontSize: '1.75rem' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Reading Goals</h3>
            <p className="text-gray-600">
              Challenge yourself with reading goals and track your achievements.
            </p>
          </div>
        </section>

        <section className="steps-section">
          <h2>Get Started in 3 Easy Steps</h2>
          <div className="steps-grid">
            <div className="step-card">
              <PersonAdd className="step-icon" />
              <div className="step-number">1</div>
              <h3 className="step-title">Create Account</h3>
              <p className="step-description">
                Sign up for free and create your personalized reading profile in just a few clicks
              </p>
            </div>
            
            <div className="step-card">
              <LibraryAdd className="step-icon" />
              <div className="step-number">2</div>
              <h3 className="step-title">Add Your Books</h3>
              <p className="step-description">
                Build your digital library by adding books you've read or want to read
              </p>
            </div>
            
            <div className="step-card">
              <Timeline className="step-icon" />
              <div className="step-number">3</div>
              <h3 className="step-title">Start Tracking</h3>
              <p className="step-description">
                Set reading goals, track your progress, and celebrate your reading achievements
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;