import React, { useState } from 'react';
import './TopAppBar.css';

interface TopAppBarProps {
  title?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'ADC',
  leftContent,
  rightContent,
  backgroundColor,
  textColor,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const defaultNavLinks = (
    <>
      <a href="#home" className="nav-link">Home</a>
      <a href="#about" className="nav-link">About</a>
      <a href="#events" className="nav-link">Events</a>
      <a href="#projects" className="nav-link">Projects</a>
      <a href="#team" className="nav-link">Team</a>
      <a href="#contact" className="nav-link">Contact</a>
    </>
  );

  const defaultRightContent = (
    <button className="join-button">Join Now</button>
  );

  return (
    <header
      className="top-app-bar"
      style={{
        ...(backgroundColor && { backgroundColor }),
        ...(textColor && { color: textColor }),
      }}
    >
      <div className="top-app-bar__container">
        <div className="top-app-bar__left">
          {leftContent || (
            <div className="logo">
              <span className="logo-bracket">{'<'}</span>
              <span className="logo-text">{title}</span>
              <span className="logo-bracket">{'/>'}</span>
            </div>
          )}
        </div>
        
        <nav className="top-app-bar__nav">
          {defaultNavLinks}
        </nav>

        <div className="top-app-bar__right">
          {rightContent || defaultRightContent}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {defaultNavLinks}
          <div className="mobile-menu-action">
            {rightContent || defaultRightContent}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
