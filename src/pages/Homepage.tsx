import React, { useState } from 'react';
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
 * STATE MANAGEMENT — `useState` for window visibility:
 * ────────────────────────────────────────────────────
 * We use React's `useState` hook to track whether the IE browser window
 * is open or closed. This is the simplest form of state in React:
 *
 *   const [value, setValue] = useState(initialValue);
 *
 * - `value` is the *current* state (read-only snapshot)
 * - `setValue` is a function to *update* state (triggers a re-render)
 * - `initialValue` is what `value` starts as on first render
 *
 * When `setIsBrowserOpen(false)` is called (via the Close button), React:
 *   1. Schedules a re-render of this component
 *   2. Calls `Homepage()` again
 *   3. `isBrowserOpen` is now `false`
 *   4. The `{isBrowserOpen && (...)}` expression evaluates to `false`
 *   5. React removes the entire browser window from the DOM
 *
 * The desktop icons remain visible because they're rendered unconditionally
 * outside the conditional block.
 *
 * LAYOUT (XP Desktop metaphor):
 *   ┌─── .xp-desktop (fills viewport) ─────────────────────────┐
 *   │                                                           │
 *   │  ┌── .desktop-icons ──┐                                   │
 *   │  │ [ADC Website]      │   ┌── .window (conditional) ──┐  │
 *   │  │ [Project 1]        │   │ TopAppBar (title bar +     │  │
 *   │  │ [Project 2]        │   │   toolbars)                │  │
 *   │  │ [Project 3]        │   │ Window body (sections)     │  │
 *   │  └────────────────────┘   │ Status bar (footer)        │  │
 *   │                           └────────────────────────────┘  │
 *   └──────────────────────────────────────────────────────────┘
 */
export const Homepage: React.FC = () => {
  // ── Window State ──────────────────────────────────────────────
  // Tracks whether the IE browser window is visible on the desktop.
  //
  // REACT CONCEPT — useState Hook:
  // `useState` is one of the most fundamental React hooks. It lets a
  // functional component "remember" a value across re-renders.
  //
  // The `<boolean>` generic tells TypeScript this state is specifically
  // a boolean — not string, not number. This catches bugs at compile
  // time (e.g., accidentally doing `setIsBrowserOpen("yes")` would
  // be a type error).
  //
  // The destructured tuple `[isBrowserOpen, setIsBrowserOpen]`:
  //   - `isBrowserOpen`    → current value (starts as `true`)
  //   - `setIsBrowserOpen` → function to change the value
  //
  // When `setIsBrowserOpen` is called, React re-renders this component.
  // The old DOM nodes for the browser window are removed, and React
  // builds new DOM based on the updated state. This is what makes
  // React "reactive" — UI is always a function of current state.
  const [isBrowserOpen, setIsBrowserOpen] = useState<boolean>(true);

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

  // ── Desktop Icons ───────────────────────────────────────────────
  // Data-driven array of desktop shortcut icons. Each entry defines
  // a label, an icon type (used for CSS styling), and an action.
  //
  // REACT CONCEPT — Data-Driven Rendering:
  // Instead of hard-coding each icon's JSX, we define the *data* in
  // an array and use `.map()` to generate the markup. This means
  // adding a new icon is just one line in the array — no copy-paste
  // of HTML, no risk of typos in repeated markup.
  const desktopIcons = [
    {
      id: 'adc-website',
      label: 'ADC Website',
      iconType: 'globe' as const,
      onDoubleClick: () => setIsBrowserOpen(true),
    },
    { id: 'project-1', label: 'Project 1', iconType: 'folder' as const },
    { id: 'project-2', label: 'Project 2', iconType: 'folder' as const },
    { id: 'project-3', label: 'Project 3', iconType: 'folder' as const },
  ];

  return (
    // ── XP Desktop Surface ──────────────────────────────────────
    // The outermost container fills the viewport and acts as the
    // Windows XP desktop. The Bliss wallpaper is on <body> (set in
    // index.css), so this div is transparent — the wallpaper shows
    // through. Desktop icons and the browser window sit on top.
    <div className="xp-desktop">

      {/* ── Desktop Icons ──────────────────────────────────────────
       * Arranged in a CSS Grid that flows top-to-bottom, then
       * left-to-right — mimicking XP's default icon arrangement.
       *
       * REACT CONCEPT — .map() for Lists:
       * We iterate over `desktopIcons` and produce one <button> per
       * entry. The `key` prop (set to `icon.id`) tells React which
       * DOM node corresponds to which data item. React uses keys to
       * efficiently determine which items changed, were added, or
       * removed during re-renders. Without keys, React would have
       * to re-create every list item on every render.
       *
       * WHY <button> INSTEAD OF <div>?
       * Desktop icons are interactive (double-clickable), so they
       * should be <button> elements for accessibility. Screen readers
       * announce them as interactive controls, and keyboard users can
       * Tab to them and press Enter to activate.
       */}
      <div className="desktop-icons">
        {desktopIcons.map((icon) => (
          <button
            key={icon.id}
            className="desktop-icon"
            onDoubleClick={icon.onDoubleClick}
            title={icon.label}
          >
            <div className={`desktop-icon__img desktop-icon__img--${icon.iconType}`} />
            <span className="desktop-icon__label">{icon.label}</span>
          </button>
        ))}
      </div>

      {/* ── Browser Window (Conditional) ─────────────────────────
       * REACT CONCEPT — Conditional Rendering:
       * `{isBrowserOpen && (...)}` is a common React pattern. In
       * JavaScript, `true && expression` evaluates to `expression`,
       * while `false && expression` evaluates to `false`. React
       * ignores `false` in JSX output (renders nothing).
       *
       * So when `isBrowserOpen` is true → the browser window renders.
       * When false → React removes it entirely from the DOM.
       *
       * WHY NOT `display: none`?
       * We *could* toggle CSS visibility instead of unmounting. But
       * conditional rendering is more idiomatic React — it completely
       * removes the DOM nodes, freeing memory and stopping any
       * animations or timers inside the unmounted subtree. For a
       * complex component like the browser window, this is cleaner.
       */}
      {isBrowserOpen && (
        <div className="window homepage-window">
          {/* Pass onClose callback so the Close button can hide the window.
           *
           * REACT CONCEPT — Passing Callbacks as Props:
           * We create an inline arrow function `() => setIsBrowserOpen(false)`
           * and pass it as the `onClose` prop. When TopAppBar's Close button
           * is clicked, it calls this function, which updates our state,
           * which triggers a re-render, which unmounts the browser window.
           *
           * The data flows: Child event → Parent callback → State update → Re-render
           * This is React's "one-way data flow" or "unidirectional data flow".
           */}
          <TopAppBar onClose={() => setIsBrowserOpen(false)} />

          <div className="window-body homepage-body">
            <div className="ie6-content-viewport">

            {/* ── Hero Section — Nested Terminal Window ──────────── */}
            <section className="hero-section">
              <div className="window terminal-window">
                <div className="title-bar">
                  <div className="title-bar-text">
                    Application Development Club
                  </div>
                  {/* Title-bar controls (Minimize/Maximize/Close) intentionally
                   * omitted — this terminal window is decorative chrome, not an
                   * interactive window the user can close. The blue title bar
                   * still renders via xp.css's `.title-bar` styles; removing
                   * `.title-bar-controls` simply leaves the right side empty. */}
                </div>

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
                    <p className="hero-tagline">Software Engineering @ UNG</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── About Section ──────────────────────────────────── */}
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

            {/* ── Features Section ───────────────────────────────── */}
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

            {/* ── Events Section ─────────────────────────────────── */}
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

            {/* ── CTA Section ────────────────────────────────────── */}
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

          {/* ── Status Bar (Footer) ──────────────────────────────── */}
          <div className="status-bar ie6-status-bar">
            <p className="status-bar-field status-bar__done">Done</p>
            <p className="status-bar-field status-bar__info">&copy; 2026 Application Development Club</p>
            <p className="status-bar-field status-bar__zone">Internet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
