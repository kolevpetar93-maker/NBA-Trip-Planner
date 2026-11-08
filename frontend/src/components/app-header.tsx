import { Link, NavLink } from "react-router-dom";

export default function AppHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="page-width navigation">
          <Link className="brand" to="/" aria-label="NBA Trip Planner home">
            <span className="brand-emblem">
              <img
                src="/images/figma/imgDribbble.svg"
                alt=""
                width="24"
                height="24"
              />
            </span>
            <span>
              <strong>NBA</strong> Trip Planner
            </span>
          </Link>
          <nav className="main-menu" aria-label="Main navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <button type="button" disabled title="To be added later">
              Games
            </button>
            <button type="button" disabled title="To be added later">
              Teams
            </button>
            <button type="button" disabled title="To be added later">
              My Trip
            </button>
            <NavLink to="/ai-guide">AI Guide</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}
