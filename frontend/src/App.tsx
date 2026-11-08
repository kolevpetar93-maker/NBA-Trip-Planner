import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AppHeader from "./components/app-header";
import Home from "./components/home";
import AIGuide from "./components/ai-guide";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      pathname === "/ai-guide"
        ? "AI Guide | NBA Trip Planner"
        : "NBA Trip Planner";
  }, [pathname]);

  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-guide" element={<AIGuide />} />
        <Route
          path="*"
          element={
            <main id="main-content" className="page-width not-found">
              <h1>Page not found</h1>
              <Link className="button primary" to="/">
                Back to Home
              </Link>
            </main>
          }
        />
      </Routes>
      <footer className="site-footer">
        <div className="page-width footer-content">
          <p>NBA Trip Planner · Student project</p>
          <p>For the love of the game.</p>
        </div>
      </footer>
    </>
  );
}
