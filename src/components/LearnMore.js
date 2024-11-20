import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LearnMore.css';

const LearnMore = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/login');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Learn More About UniRides</h1>
          <p>
            Convenient, affordable, and eco-friendly ride-sharing for campus
            life.
          </p>
          <button className="cta-button" onClick={handleSignUpClick}>
            Get Started
          </button>
        </div>
      </div>

      {/* What is UniRides Section */}
      <div className="content-section">
        <h2 className="section-title">What is UniRides?</h2>
        <p className="section-description">
          UniRides is a ride-sharing platform designed exclusively for
          university students. By creating a community-based approach, we make
          it easier for you to find rides, share costs, and travel safely
          between your campus, home, and anywhere in between.
        </p>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Affordable</h3>
            <p>
              We understand the student budget. UniRides offers cost-effective
              rides, allowing you to save on transportation.
            </p>
          </div>
          <div className="feature-item">
            <h3>Safe & Reliable</h3>
            <p>
              All of our drivers are verified, and we prioritize your safety by
              providing real-time ride tracking and secure ride options.
            </p>
          </div>
          <div className="feature-item">
            <h3>Community-Driven</h3>
            <p>
              Connect with your fellow students and build a community as you
              travel together.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="content-section how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Sign Up & Create a Profile</h4>
            <p>
              Sign up using your university email, create a profile, and verify
              your account to get started. It's quick, easy, and free for all
              university students.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Book a Ride or Offer a Ride</h4>
            <p>
              Whether you need a ride or want to offer one, UniRides makes it
              simple. Enter your starting point and destination, choose the best
              option for you, and book in seconds.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Enjoy Safe & Eco-Friendly Travel</h4>
            <p>
              We prioritize safety with features like verified drivers, in-app
              messaging, and real-time ride tracking. By sharing rides, you're
              also contributing to a greener campus environment by reducing the
              carbon footprint.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose UniRides Section */}
      <div className="content-section">
        <h2 className="section-title">Why Choose UniRides?</h2>
        <ul className="reasons-list">
          <li>
            <strong>Budget-Friendly</strong>: Save money by splitting the cost
            of rides with other students.
          </li>
          <li>
            <strong>Eco-Conscious</strong>: Reduce emissions by carpooling,
            making our campuses more sustainable.
          </li>
          <li>
            <strong>Social Connections</strong>: Meet new people, make friends,
            and share your ride experiences.
          </li>
        </ul>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <h2>Join UniRides Today!</h2>
        <p>
          Ready to start your journey with us? Sign up now and be part of the
          ride-sharing revolution on campus. Together, we can make commuting
          smarter, safer, and more affordable.
        </p>
        <button className="cta-button" onClick={handleSignUpClick}>
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default LearnMore;
