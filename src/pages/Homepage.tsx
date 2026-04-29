import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MultiLineTypeWriter } from '../components/MultiLineTypeWriter';
import TopAppBar from '../components/TopAppBar';
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';
import { getUsernameFromJwt } from '../utils/jwt';
import './Homepage.css';
import xpMonitor from '../assets/xp-monitor.svg';
import xpRocket from '../assets/xp-rocket.svg';
import xpPeople from '../assets/xp-people.svg';
import xpTarget from '../assets/xp-target.svg';

type DesktopWindowId = 'browser' | 'cwInfo';

type WindowPosition = {
  x: number;
  y: number;
};

type DesktopWindowPositions = Record<DesktopWindowId, WindowPosition>;

type DesktopWindowOpenState = Record<DesktopWindowId, boolean>;

type DesktopWindowDraggedState = Record<DesktopWindowId, boolean>;

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
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const desktopWindowRefs = useRef<Record<DesktopWindowId, HTMLDivElement | null>>({
    browser: null,
    cwInfo: null,
  });
  const dragStateRef = useRef<{
    windowId: DesktopWindowId;
    pointerId: number;
    pointerOffsetX: number;
    pointerOffsetY: number;
  } | null>(null);

  // ── Login Modal State ───────────────────────────────────────
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // ── User State (JWT) ────────────────────────────────────────
  // Holds username if logged in, null otherwise. Decoded from JWT.
  const [username, setUsername] = useState<string | null>(null);

  const syncUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUsername(null);
      return;
    }

    setUsername(getUsernameFromJwt(token));
  };

  // On mount, check for JWT in localStorage and decode username
  useEffect(() => {
    syncUsernameFromToken();
  }, []);

  // Called after successful login (from LoginModal)
  const handleLoginSuccess = () => {
    syncUsernameFromToken();
    setIsLoginOpen(false);
  };

  // Logout handler: clear token and user state
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };
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
  const [openWindows, setOpenWindows] = useState<DesktopWindowOpenState>({
    browser: true,
    cwInfo: false,
  });
  const [draggedWindows, setDraggedWindows] = useState<DesktopWindowDraggedState>({
    browser: false,
    cwInfo: false,
  });
  const [windowPositions, setWindowPositions] = useState<DesktopWindowPositions>({
    browser: { x: 152, y: 20 },
    cwInfo: { x: 230, y: 68 },
  });

  // These constants define the "default launch slot" of the browser
  // window on the XP desktop. We keep the browser offset from the icon
  // column, then clamp it back into the visible desktop when the user
  // resizes the viewport or drags the window around.
  const MOBILE_BREAKPOINT = 768;
  const WINDOW_MIN_POSITIONS: DesktopWindowPositions = {
    browser: { x: 152, y: 20 },
    cwInfo: { x: 230, y: 68 },
  };
  const DESKTOP_WINDOW_EDGE_PADDING = 16;

  const clampWindowPosition = (
    windowId: DesktopWindowId,
    nextPosition: WindowPosition,
  ) => {
    const desktopElement = desktopRef.current;
    const desktopWindowElement = desktopWindowRefs.current[windowId];

    if (
      !desktopElement ||
      !desktopWindowElement ||
      window.innerWidth <= MOBILE_BREAKPOINT
    ) {
      return WINDOW_MIN_POSITIONS[windowId];
    }

    const maxX = Math.max(
      WINDOW_MIN_POSITIONS[windowId].x,
      desktopElement.clientWidth -
        desktopWindowElement.offsetWidth -
        DESKTOP_WINDOW_EDGE_PADDING,
    );
    const maxY = Math.max(
      WINDOW_MIN_POSITIONS[windowId].y,
      desktopElement.clientHeight -
        desktopWindowElement.offsetHeight -
        DESKTOP_WINDOW_EDGE_PADDING,
    );

    return {
      x: Math.min(Math.max(nextPosition.x, WINDOW_MIN_POSITIONS[windowId].x), maxX),
      y: Math.min(Math.max(nextPosition.y, WINDOW_MIN_POSITIONS[windowId].y), maxY),
    };
  };

  // Re-clamp the browser window whenever it mounts or the viewport size
  // changes. This mirrors a real desktop manager: windows keep their
  // coordinates, but the system nudges them back into view if the screen
  // becomes too small to fit the old position.
  useLayoutEffect(() => {
    if (!openWindows.browser && !openWindows.cwInfo) {
      return undefined;
    }

    const syncWindowIntoViewport = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        return;
      }

      setWindowPositions((currentPositions) => {
        const nextPositions = { ...currentPositions };

        (Object.keys(currentPositions) as DesktopWindowId[]).forEach((windowId) => {
          let preferredPosition = currentPositions[windowId];
          const desktopElement = desktopRef.current;
          const desktopWindowElement = desktopWindowRefs.current[windowId];

          if (!draggedWindows[windowId] && desktopElement && desktopWindowElement) {
            const centerX = Math.max(
              WINDOW_MIN_POSITIONS[windowId].x,
              (desktopElement.clientWidth - desktopWindowElement.offsetWidth) / 2,
            );
            const centerY = Math.max(
              WINDOW_MIN_POSITIONS[windowId].y,
              (desktopElement.clientHeight - desktopWindowElement.offsetHeight) / 2,
            );
            preferredPosition = { x: centerX, y: centerY };
          } else if (!draggedWindows[windowId]) {
            preferredPosition = WINDOW_MIN_POSITIONS[windowId];
          }

          nextPositions[windowId] = clampWindowPosition(windowId, preferredPosition);
        });

        return nextPositions;
      });
    };

    syncWindowIntoViewport();
    window.addEventListener('resize', syncWindowIntoViewport);

    return () => {
      window.removeEventListener('resize', syncWindowIntoViewport);
    };
  }, [draggedWindows, openWindows]);

  const setWindowOpen = (windowId: DesktopWindowId, isOpen: boolean) => {
    setOpenWindows((currentWindows) => ({
      ...currentWindows,
      [windowId]: isOpen,
    }));
  };

  const launchDesktopWindow = (windowId: DesktopWindowId) => {
    setDraggedWindows((currentDraggedWindows) => ({
      ...currentDraggedWindows,
      [windowId]: false,
    }));
    setWindowPositions((currentPositions) => ({
      ...currentPositions,
      [windowId]: WINDOW_MIN_POSITIONS[windowId],
    }));
    setWindowOpen(windowId, true);
  };

  const stopWindowDrag = () => {
    dragStateRef.current = null;
    document.body.classList.remove('xp-window-dragging');
  };

  const handleWindowTitleBarPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    windowId: DesktopWindowId,
  ) => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, label')) {
      return;
    }

    const desktopWindowElement = desktopWindowRefs.current[windowId];
    if (!desktopWindowElement) {
      return;
    }

    const windowRect = desktopWindowElement.getBoundingClientRect();

    dragStateRef.current = {
      windowId,
      pointerId: event.pointerId,
      pointerOffsetX: event.clientX - windowRect.left,
      pointerOffsetY: event.clientY - windowRect.top,
    };

    setDraggedWindows((currentDraggedWindows) => ({
      ...currentDraggedWindows,
      [windowId]: true,
    }));
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.classList.add('xp-window-dragging');
  };

  const handleWindowTitleBarPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const dragState = dragStateRef.current;
    const desktopElement = desktopRef.current;

    if (
      !dragState ||
      dragState.pointerId !== event.pointerId ||
      !desktopElement ||
      window.innerWidth <= MOBILE_BREAKPOINT
    ) {
      return;
    }

    const desktopRect = desktopElement.getBoundingClientRect();
    const unclampedPosition = {
      x: event.clientX - desktopRect.left - dragState.pointerOffsetX,
      y: event.clientY - desktopRect.top - dragState.pointerOffsetY,
    };

    setWindowPositions((currentPositions) => ({
      ...currentPositions,
      [dragState.windowId]: clampWindowPosition(dragState.windowId, unclampedPosition),
    }));
  };

  const handleWindowTitleBarPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    stopWindowDrag();
  };

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
  const cwArt = [
    " ██████╗██╗    ██╗",
    "██╔════╝██║    ██║",
    "██║     ██║ █╗ ██║",
    "██║     ██║███╗██║",
    "╚██████╗╚███╔███╔╝",
    " ╚═════╝ ╚══╝╚══╝ ",
  ];
  const cwInfoRows: { label: string; value: React.ReactNode }[] = [
    { label: 'OS', value: 'CodingWarriors @ UNG' },
    { label: 'Host', value: 'Online Discord / Teams' },
    { label: 'Kernel', value: 'ICPC Preparation' },
    { label: 'Uptime', value: 'Biweekly online meetings' },
    { label: 'Shell', value: 'bash, zsh, and last-minute stdin hacks' },
    { label: 'Languages', value: 'Java Python' },
    { label: 'Practice', value: 'LeetCode Codeforces Kattis UVA' },
    { label: 'Connect', value: <a href="https://connect.ung.edu/organization/the-coding-warriors--gvl-" target="_blank" rel="noopener noreferrer" style={{ color: '#7dd6ff', textDecoration: 'underline' }}>UNG Connect</a> },
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
      onDoubleClick: () => launchDesktopWindow('browser'),
    },
    {
      id: 'cw-info',
      label: 'Coding Warriors',
      iconType: 'terminal' as const,
      onDoubleClick: () => launchDesktopWindow('cwInfo'),
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
    <div className="xp-desktop" ref={desktopRef}>

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
       * removing the DOM nodes frees memory and stops any
       * animations or timers inside the unmounted subtree. For a
       * complex component like the browser window, this is cleaner.
       */}
      {openWindows.browser && (
        <div
          className="window homepage-window"
          ref={(element) => {
            desktopWindowRefs.current.browser = element;
          }}
          style={{
            left: `${windowPositions.browser.x}px`,
            top: `${windowPositions.browser.y}px`,
          }}
        >
          <TopAppBar
            onClose={() => {
              stopWindowDrag();
              setWindowOpen('browser', false);
            }}
            onTitleBarPointerDown={(event) => handleWindowTitleBarPointerDown(event, 'browser')}
            onTitleBarPointerMove={handleWindowTitleBarPointerMove}
            onTitleBarPointerUp={handleWindowTitleBarPointerUp}
            onTitleBarPointerCancel={stopWindowDrag}
            onLoginClick={() => setIsLoginOpen(true)}
            username={username}
            onLogout={handleLogout}
          />
          {/* XP-style Login Modal (focuses screen, XP window style) */}
          <LoginModal
            open={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
          />

          <SignupModal
            open={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSwitchToLogin={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
            onLoginSuccess={() => {
              handleLoginSuccess();
              setIsSignupOpen(false);
            }}
          />

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
                  Welcome to the Application Development Club at the University of North Georgia! We meet every Wednesday and Friday to learn, build projects, and connect with others who love technology. Everyone is welcome, no experience needed. Join us and let's grow together!
                </p>
              </fieldset>
            </section>

            {/* ── Features Section ───────────────────────────────── */}

            <section className="features-section">
              <h2 className="section-heading">What We Do</h2>
              <div className="features-grid">
                {/* Learn & Grow Notepad Window */}
                <div className="window feature-window">
                  <div className="title-bar">
                    <div className="title-bar-text">Learn &amp; Grow</div>
                  </div>
                  <div className="window-body feature-window-body">
                    <div className="feature-icon">
                      <img src={xpMonitor} alt="Windows XP Monitor" style={{ width: 28, height: 28, verticalAlign: 'middle' }} />
                    </div>
                    <p>
                      Expand your skills with hands-on coding sessions, workshops, and peer learning. We cover everything from the basics to advanced topics, so you can grow at your own pace and ask questions any time.
                    </p>
                  </div>
                </div>

                {/* Build Projects Notepad Window */}
                <div className="window feature-window">
                  <div className="title-bar">
                    <div className="title-bar-text">Build Projects</div>
                  </div>
                  <div className="window-body feature-window-body">
                    <div className="feature-icon">
                      <img src={xpRocket} alt="Windows XP Rocket" style={{ width: 28, height: 28, verticalAlign: 'middle' }} />
                    </div>
                    <p>
                      Work together on real projects that make a difference. Whether you want to build apps, games, or websites, you will find teammates and mentors ready to help you turn your ideas into reality.
                    </p>
                  </div>
                </div>

                {/* Network Notepad Window */}
                <div className="window feature-window">
                  <div className="title-bar">
                    <div className="title-bar-text">Network</div>
                  </div>
                  <div className="window-body feature-window-body">
                    <div className="feature-icon">
                      <img src={xpPeople} alt="Windows XP People" style={{ width: 28, height: 28, verticalAlign: 'middle' }} />
                    </div>
                    <p>
                      Meet new friends and connect with students who share your interests. Our club is a great place to network, share experiences, and support each other as we learn and grow together.
                    </p>
                  </div>
                </div>

                {/* Compete Notepad Window */}
                <div className="window feature-window">
                  <div className="title-bar">
                    <div className="title-bar-text">Compete</div>
                  </div>
                  <div className="window-body feature-window-body">
                    <div className="feature-icon">
                      <img src={xpTarget} alt="Windows XP Target" style={{ width: 28, height: 28, verticalAlign: 'middle' }} />
                    </div>
                    <p>
                      Challenge yourself in coding competitions and hackathons. Test your skills, learn from others, and celebrate your achievements in a fun and encouraging environment.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Events Section ─────────────────────────────────── */}
            <section className="events-section">
              <h2 className="section-heading">
                <span className="xp-calendar-icon" aria-hidden="true">
                  {/* SVG: Windows XP-style calendar icon */}
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="26" height="22" rx="5" fill="#fff" stroke="#316ac5" stroke-width="2"/>
                    <rect x="3" y="6" width="26" height="6" rx="2" fill="#316ac5"/>
                    <rect x="7" y="10" width="18" height="2" rx="1" fill="#7ec8ff"/>
                    <rect x="8" y="15" width="4" height="4" rx="1.2" fill="#eaf3ff" stroke="#316ac5" stroke-width="1"/>
                    <rect x="14" y="15" width="4" height="4" rx="1.2" fill="#eaf3ff" stroke="#316ac5" stroke-width="1"/>
                    <rect x="20" y="15" width="4" height="4" rx="1.2" fill="#eaf3ff" stroke="#316ac5" stroke-width="1"/>
                  </svg>
                </span>
                <span className="events-splash-animate">Upcoming Events</span>
              </h2>
              <div className="events-list">
                <fieldset className="event-card">
                  <legend>APR 22</legend>
                  <div className="event-details">
                    <h3>App Development Club Weekly Meeting</h3>
                    <p>
                      Join us for our regular club meeting! We'll discuss ongoing projects, upcoming opportunities, and help each other with app ideas and coding challenges. All skill levels welcome.
                    </p>
                    <span className="event-time">1:00 PM - 2:00 PM</span>
                  </div>
                </fieldset>

                <fieldset className="event-card">
                  <legend>APR 24</legend>
                  <div className="event-details">
                    <h3>Code and Coffee</h3>
                    <p>
                      Bring your laptop and your favorite mug! This is a relaxed, social coding session - work on personal projects, get help from peers, or just hang out and chat about tech over coffee.
                    </p>
                    <span className="event-time">12:00 PM - 1:00 PM</span>
                  </div>
                </fieldset>

                <fieldset className="event-card">
                  <legend>APR 29</legend>
                  <div className="event-details">
                    <h3>Website Launch Party</h3>
                    <p>
                      Celebrate the official launch of our new club website! We'll demo features, thank contributors, and enjoy snacks and retro themed fun. Everyone is invited—don't miss it!
                    </p>
                    <span className="event-time">1:00 PM - 2:00 PM</span>
                  </div>
                </fieldset>
              </div>
            </section>

            {/* ── CTA Section ────────────────────────────────────── */}
            <section className="cta-section">
              <fieldset>
                <legend>Join Us Today</legend>
                <p>
                  Join us on UNG Connect to stay up to date with our meetings, events, and announcements. It's the best way to get involved and never miss out!
                </p>
                <button className="cta-button" onClick={() => window.open("https://connect.ung.edu/organization/app-development-club-of-ung--dah-", "_blank", "noopener,noreferrer")}>Get Started</button>
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

      {openWindows.cwInfo && (
        <div
          className="window homepage-window cw-window"
          ref={(element) => {
            desktopWindowRefs.current.cwInfo = element;
          }}
          style={{
            left: `${windowPositions.cwInfo.x}px`,
            top: `${windowPositions.cwInfo.y}px`,
          }}
        >
          <div
            className="title-bar cw-window-title-bar"
            onPointerDown={(event) => handleWindowTitleBarPointerDown(event, 'cwInfo')}
            onPointerMove={handleWindowTitleBarPointerMove}
            onPointerUp={handleWindowTitleBarPointerUp}
            onPointerCancel={stopWindowDrag}
          >
            <div className="title-bar-text">Command Prompt</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button
                aria-label="Close"
                onClick={() => {
                  stopWindowDrag();
                  setWindowOpen('cwInfo', false);
                }}
              ></button>
            </div>
          </div>

          <div className="window-body cw-window-body">
            <pre className="terminal-prompt cw-terminal-prompt">C:\CW\UNG&gt; neofetch.exe</pre>
            <div className="cw-neofetch">
              <pre className="cw-ascii-art" aria-hidden="true">
                {cwArt.join('\n')}
              </pre>
              <div className="cw-neofetch-details">
                <p className="cw-neofetch-title">cw@ung</p>
                <div className="cw-neofetch-rule" aria-hidden="true"></div>
                {cwInfoRows.map((row) => (
                  <p key={row.label} className="cw-neofetch-row">
                    <span className="cw-neofetch-label">{row.label}</span>
                    <span className="cw-neofetch-separator">:</span>
                    <span className="cw-neofetch-value">{row.value}</span>
                  </p>
                ))}
                <div className="cw-color-swatches" aria-hidden="true">
                  <span className="cw-swatch cw-swatch--blue"></span>
                  <span className="cw-swatch cw-swatch--green"></span>
                  <span className="cw-swatch cw-swatch--gold"></span>
                  <span className="cw-swatch cw-swatch--silver"></span>
                </div>
                <div className="cw-color-swatches cw-color-swatches--bright" aria-hidden="true">
                  <span className="cw-swatch cw-swatch--navy"></span>
                  <span className="cw-swatch cw-swatch--teal"></span>
                  <span className="cw-swatch cw-swatch--amber"></span>
                  <span className="cw-swatch cw-swatch--ice"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
