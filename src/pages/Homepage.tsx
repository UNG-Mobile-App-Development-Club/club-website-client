import React from 'react';
import { MultiLineTypeWriter } from '../components/MultiLineTypeWriter';
import TopAppBar from '../components/TopAppBar';

export const Homepage: React.FC = () => {
  const heroArt = [
    " █████╗ ██████╗  ██████╗",
    "██╔══██╗██╔══██╗██╔════╝",
    "███████║██║  ██║██║     ",
    "██╔══██║██║  ██║██║     ",
    "██║  ██║██████╔╝╚██████╗",
    "╚═╝  ╚═╝╚═════╝  ╚═════╝",
    "",
    "Application Development Club",
  ];

  return (
    <div className="homepage">
      <TopAppBar />
      
      <section className="hero-section">
        <div className="hero-content">
          <MultiLineTypeWriter
            lines={heroArt}
            speed={40}
            delay={300}
            cursor={true}
            cursorChar="|"
            className="hero-typewriter"
            lineClassName="hero-line"
            loop={false}
          />
          <p className="hero-tagline">Building the future, one line of code at a time</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <h2>Welcome to ADC</h2>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>What We Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Learn & Grow</h3>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Build Projects</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Network</h3>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis 
                praesentium voluptatum deleniti atque corrupti quos dolores et quas.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Compete</h3>
              <p>
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus 
                saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            <div className="event-card">
              <div className="event-date">
                <span className="day">15</span>
                <span className="month">MAR</span>
              </div>
              <div className="event-details">
                <h3>Workshop: Introduction to React</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <span className="event-time">6:00 PM - 8:00 PM</span>
              </div>
            </div>
            
            <div className="event-card">
              <div className="event-date">
                <span className="day">22</span>
                <span className="month">MAR</span>
              </div>
              <div className="event-details">
                <h3>Hackathon 2026</h3>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                  aliquip ex ea commodo consequat.
                </p>
                <span className="event-time">All Day Event</span>
              </div>
            </div>
            
            <div className="event-card">
              <div className="event-date">
                <span className="day">05</span>
                <span className="month">APR</span>
              </div>
              <div className="event-details">
                <h3>Tech Talk: Cloud Computing</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur.
                </p>
                <span className="event-time">7:00 PM - 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Join Us Today</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Application Development Club. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style>{`
        .homepage {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
        }

        .hero-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          opacity: 0.3;
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .hero-typewriter {
          font-family: 'Courier New', monospace;
          font-size: clamp(0.8rem, 2.5vw, 1.8rem);
          font-weight: bold;
          color: #00ff88;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .hero-line {
          line-height: 1.4;
        }

        .hero-tagline {
          margin-top: 2rem;
          font-size: 1.25rem;
          color: #e0e0e0;
          font-style: italic;
          opacity: 0;
          animation: fadeIn 1s ease-in 2s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .about-section {
          padding: 5rem 2rem;
          background: #1a1a1a;
          text-align: center;
        }

        .about-section h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #00ff88;
        }

        .lead {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #b0b0b0;
          max-width: 800px;
          margin: 0 auto;
        }

        .features-section {
          padding: 5rem 2rem;
          background: #0a0a0a;
        }

        .features-section h2 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 3rem;
          color: #00ff88;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #333;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: #00ff88;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .feature-card p {
          color: #b0b0b0;
          line-height: 1.6;
        }

        .events-section {
          padding: 5rem 2rem;
          background: #1a1a1a;
        }

        .events-section h2 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 3rem;
          color: #00ff88;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .event-card {
          display: flex;
          gap: 2rem;
          background: #0a0a0a;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #333;
          transition: border-color 0.3s ease;
        }

        .event-card:hover {
          border-color: #00ff88;
        }

        .event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #00ff88;
          color: #0a0a0a;
          padding: 1rem;
          border-radius: 8px;
          min-width: 80px;
        }

        .event-date .day {
          font-size: 2rem;
          font-weight: bold;
          line-height: 1;
        }

        .event-date .month {
          font-size: 0.875rem;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        .event-details {
          flex: 1;
        }

        .event-details h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .event-details p {
          color: #b0b0b0;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .event-time {
          color: #00ff88;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .cta-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
          text-align: center;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .cta-section p {
          font-size: 1.125rem;
          color: #e0e0e0;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          padding: 1rem 3rem;
          font-size: 1.125rem;
          font-weight: 600;
          background: #00ff88;
          color: #0a0a0a;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }

        .footer {
          padding: 3rem 2rem;
          background: #0a0a0a;
          border-top: 1px solid #333;
        }

        .footer .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer p {
          color: #666;
          margin: 0;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          color: #b0b0b0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #00ff88;
        }

        @media (max-width: 768px) {
          .hero-typewriter {
            font-size: clamp(0.6rem, 3vw, 1rem);
          }

          .hero-tagline {
            font-size: 1rem;
          }

          .about-section h2,
          .features-section h2,
          .events-section h2,
          .cta-section h2 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .event-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .footer .container {
            flex-direction: column;
            text-align: center;
          }

          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage;
