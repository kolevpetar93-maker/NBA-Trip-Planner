import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main id="main-content" className="page-width home-content">
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero-photo"
          src="/images/figma/imgArenaPhotography.png"
          alt="Basketball arena"
          fetchPriority="high"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <span />
            THE GAME IS ONLY THE BEGINNING
          </p>
          <h1 id="hero-title">
            Plan Your Next<br />NBA Game
          </h1>
          <p className="hero-subtitle">Get guidance for your next NBA visit.</p>
          <Link className="button primary" to="/ai-guide">
            Ask AI Guide
            <img src="/images/figma/imgArrowUpRight.svg" alt="" width="18" height="18" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="games-title">
        <div className="section-heading">
          <h2 id="games-title">Upcoming Games</h2>
        </div>
        <div className="empty-state">
          <p className="empty-title">No game data yet</p>
          <p>Game schedules will be added when the NBA API is connected.</p>
        </div>
      </section>

      <section aria-labelledby="teams-title">
        <div className="section-heading">
          <h2 id="teams-title">Teams</h2>
        </div>
        <div className="empty-state">
          <p className="empty-title">No team data yet</p>
          <p>Teams will be added as the application develops.</p>
        </div>
      </section>
    </main>
  );
}
