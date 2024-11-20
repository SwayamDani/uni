import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Utility to add animation classes on scroll
    const addAnimation = (elementSelector, animationClass) => {
      const element = document.querySelector(elementSelector);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                element.classList.add(animationClass);
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(element);
      }
    };

    addAnimation('.info-blocks', 'fade-in');
    addAnimation('.news-section', 'fade-in-up');
    addAnimation('.cta-section', 'fade-in');
  }, []);

  const handleLearnMoreClick = () => {
    navigate('/learn-more');
  };

  const handleSignUpClick = () => {
    navigate('/login');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to UniRides!</h1>
          <p>Your Go-To Ride Sharing Solution for Students</p>
          <button className="hero-btn" onClick={handleLearnMoreClick}>
            Learn More
          </button>
        </div>
      </div>

      {/* Three Information Blocks Section */}
      <div className="info-blocks">
        <div className="info-block">
          <h3>Affordable Rides</h3>
          <p>Budget-friendly rates tailored specifically for students.</p>
        </div>
        <div className="info-block">
          <h3>Safe and Reliable</h3>
          <p>Safety is our top priority with thoroughly vetted drivers.</p>
        </div>
        <div className="info-block">
          <h3>Community Driven</h3>
          <p>Join our community and connect with fellow students.</p>
        </div>
      </div>

      {/* Featured News or Testimonials Section */}
      <div className="news-section">
        <h2>Latest News</h2>
        <div className="news-cards">
          <div className="news-card">
            <h4>Campus Sustainability Efforts</h4>
            <p>Join us in making our campus more sustainable.</p>
            <button>Read More</button>
          </div>
          <div className="news-card">
            <h4>New Ride-Sharing Features</h4>
            <p>
              Discover our latest ride-sharing updates for better experiences.
            </p>
            <button>Read More</button>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <h2>Get Involved</h2>
        <p>
          Support our mission to make transportation accessible and sustainable
          for students everywhere.
        </p>
        <button onClick={handleSignUpClick}>Join Us Today</button>
      </div>
    </div>
  );
};

export default Home;
