import React from 'react';
import { MultiLineTypeWriter } from '../components/MultiLineTypeWriter';
import TopAppBar from '../components/TopAppBar';
import './Homepage.css';

/**
 * Homepage — The main (and currently only) page of the ADC website.
 *
 * HOW THIS COMPONENT IS STRUCTURED (React concepts explained):
 * ─────────────────────────────────────────────────────────────
 * This is a **functional component** — a plain JavaScript function that
 * returns JSX (the HTML-like syntax React uses). React calls this function
 * every time it needs to render the page.
 *
 * LAYOUT (XP window metaphor):
 * The entire page is wrapped in `div.window` from xp.css, so it looks like
 * a single Windows XP application window. Inside:
 *   - `<TopAppBar />` renders the blue XP title bar + nav menu.
 *   - `<div className="window-body">` holds all page sections.
 *   - `<div className="status-bar">` acts as the footer.
 *
 * NESTED WINDOW:
 * The hero section contains a *second* xp.css window (`terminal-window`)
 * embedded inside the main window body. This creates the classic XP
 * "window-inside-a-window" look — like opening Command Prompt inside
 * Explorer. xp.css styles both independently.
 *
 * WHY `React.FC`:
 * `React.FC` (FunctionComponent) is a TypeScript type that tells the
 * compiler "this is a valid React component". It automatically types the
 * return value as `React.ReactElement` and provides `children` if needed.
 */
export const Homepage: React.FC = () => {
  // The ASCII art lines fed to the typewriter effect.
  // Each string is one line of output — the component renders them
  // sequentially to simulate a terminal typing animation.
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
    // ── XP Window Shell ────────────────────────────────────────────
    // `div.window` is the outermost xp.css class — it draws the raised
    // 3D border that looks like a real XP application window.
    // `homepage-window` adds our crisp-edge overrides (no border-radius).
    <div className="window homepage-window">
      <TopAppBar />

      {/* ── Window Body ──────────────────────────────────────────────
       * `window-body` is an xp.css class that provides the interior
       * padding and background of the window content area.
       */}
      <div className="window-body homepage-body">

        {/* ── IE6 Content Viewport ────────────────────────────────────
         * This wrapper mimics the actual content viewport of Internet
         * Explorer 6 — the white rectangle with a sunken/inset border
         * where web pages rendered. It sits inside the grey browser
         * chrome (toolbars above, status bar below) and visually
         * separates "browser UI" from "page content".
         *
         * REACT CONCEPT — Wrapper / Container Components:
         * This is a pure presentational wrapper — it doesn't manage
         * state or handle events. Its only job is to apply layout and
         * visual styling to its children. In React, wrapping children
         * in a styled container like this is the standard way to group
         * and style a set of sibling components without adding logic.
         */}
        <div className="ie6-content-viewport">

        {/* ── Hero Section — Nested Terminal Window ──────────────────
         * This section embeds a *second* xp.css `div.window` inside the
         * main window body, creating the nested-window look.
         *
         * REACT CONCEPT — Component Composition:
         * Instead of building one monolithic component, we compose small
         * pieces of xp.css markup together. The `div.window` here reuses
         * the exact same xp.css classes as the outer window. xp.css
         * doesn't care about nesting depth — it styles each `.window`
         * independently. This is the power of class-based CSS libraries:
         * your component structure is decoupled from the styling.
         */}
        <section className="hero-section">
          <div className="window terminal-window">
            {/* ── Terminal Title Bar ─────────────────────────────────
             * Same xp.css markup as the outer title bar. The
             * `aria-label` values on the buttons tell xp.css which
             * icons to render (Minimize / Maximize / Close).
             */}
            <div className="title-bar">
              <div className="title-bar-text">
                Application Development Club
              </div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
              </div>
            </div>

            {/* ── Terminal Body ───────────────────────────────────────
             * Black background with gray monospace text — mimics the
             * classic Windows command prompt. The `<pre>` prompt line
             * appears first, then the typewriter animation plays below.
             */}
            <div className="window-body terminal-body">
              <pre className="terminal-prompt">C:\&gt; _</pre>
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
            </div>
          </div>
        </section>

        {/* ── About Section ──────────────────────────────────────────
         * Uses an xp.css `fieldset` (GroupBox) to frame the intro text.
         */}
        <section className="about-section">
          <fieldset>
            <legend>Welcome to ADC</legend>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </fieldset>
        </section>

        {/* ── Features Section ───────────────────────────────────────
         * Each feature card is an xp.css `fieldset` (GroupBox) with a
         * `legend` label — the classic XP "group of controls" pattern.
         */}
        <section className="features-section">
          <h2 className="section-heading">What We Do</h2>
          <div className="features-grid">
            <fieldset className="feature-card">
              <legend>Learn &amp; Grow</legend>
              <div className="feature-icon">💻</div>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </fieldset>

            <fieldset className="feature-card">
              <legend>Build Projects</legend>
              <div className="feature-icon">🚀</div>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
              </p>
            </fieldset>

            <fieldset className="feature-card">
              <legend>Network</legend>
              <div className="feature-icon">👥</div>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                praesentium voluptatum deleniti atque corrupti quos dolores et quas.
              </p>
            </fieldset>

            <fieldset className="feature-card">
              <legend>Compete</legend>
              <div className="feature-icon">🎯</div>
              <p>
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus
                saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
            </fieldset>
          </div>
        </section>

        {/* ── Events Section ─────────────────────────────────────────
         * Event cards use a simple table-like layout inside a fieldset.
         */}
        <section className="events-section">
          <h2 className="section-heading">Upcoming Events</h2>
          <div className="events-list">
            <fieldset className="event-card">
              <legend>MAR 15</legend>
              <div className="event-details">
                <h3>Workshop: Introduction to React</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <span className="event-time">6:00 PM - 8:00 PM</span>
              </div>
            </fieldset>

            <fieldset className="event-card">
              <legend>MAR 22</legend>
              <div className="event-details">
                <h3>Hackathon 2026</h3>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
                <span className="event-time">All Day Event</span>
              </div>
            </fieldset>

            <fieldset className="event-card">
              <legend>APR 05</legend>
              <div className="event-details">
                <h3>Tech Talk: Cloud Computing</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                  eu fugiat nulla pariatur.
                </p>
                <span className="event-time">7:00 PM - 8:30 PM</span>
              </div>
            </fieldset>
          </div>
        </section>

        {/* ── CTA Section ────────────────────────────────────────────
         * Simple call-to-action with a native <button> element.
         * xp.css automatically styles <button> with the classic 3D look.
         */}
        <section className="cta-section">
          <fieldset>
            <legend>Join Us Today</legend>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <button className="cta-button">Get Started</button>
          </fieldset>
        </section>
        </div>{/* ── end .ie6-content-viewport ── */}
      </div>

      {/* ── Status Bar (Footer) ──────────────────────────────────────
       * xp.css's `status-bar` class renders the classic bottom bar seen
       * in XP apps like Explorer or Notepad.
       *
       * IE6 STATUS BAR LAYOUT:
       * In the real Internet Explorer 6, the status bar had:
       *   - Left field: "Done" (page load status) or a URL on hover
       *   - Right field: "Internet" zone indicator (with a globe icon)
       *
       * We repurpose this to show club info on the left and a fake zone
       * indicator on the right — blending the IE6 metaphor with real
       * footer content. The middle field shows copyright.
       *
       * The `status-bar-field` class from xp.css gives each <p> the
       * classic sunken inset border look with the 1px shadow ridges.
       */}
      <div className="status-bar ie6-status-bar">
        <p className="status-bar-field status-bar__done">Done</p>
        <p className="status-bar-field status-bar__info">&copy; 2026 Application Development Club</p>
        <p className="status-bar-field status-bar__zone">Internet</p>
      </div>
    </div>
  );
};

export default Homepage;
