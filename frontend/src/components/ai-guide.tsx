import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface GuideResponse {
  summary: string;
  facts: string[];
  recommendations: string[];
}

const teams = [
  ["Los Angeles Lakers", "Los Angeles"],
  ["Golden State Warriors", "San Francisco"],
  ["Boston Celtics", "Boston"],
  ["Chicago Bulls", "Chicago"],
  ["New York Knicks", "New York"],
  ["Dallas Mavericks", "Dallas"],
  ["Other NBA team", ""],
] as const;

export default function AIGuide() {
  const [question, setQuestion] = useState("");
  const [team, setTeam] = useState<string>(teams[0][0]);
  const [city, setCity] = useState<string>(teams[0][1]);
  const [visitDate, setVisitDate] = useState("");
  const [language, setLanguage] = useState("en");
  const [answer, setAnswer] = useState<GuideResponse | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function sendQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || question.trim().length < 3) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 50000);
    setLoading(true);
    setError("");
    setAnswer(null);
    setAskedQuestion(question.trim());

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          team,
          city,
          visit_date: visitDate || null,
          language,
        }),
        signal: controller.signal,
      });
      const data: GuideResponse & { error?: string } = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "AI Guide could not answer. Please try again.",
        );
      setAnswer(data);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.name === "AbortError"
            ? "The request timed out. Please try again."
            : failure.message
          : "Could not connect to AI Guide. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      setLoading(false);
    }
  }

  return (
    <main id="main-content" className="page-width guide-page">
      <div className="guide-heading">
        <div>
          <p className="eyebrow">A LITTLE GUIDANCE. A BETTER GAME NIGHT.</p>
          <h1>Your courtside companion.</h1>
          <p>
            Ask about basketball, team history, players or rules, get game
            suggestions, or plan your next NBA visit.
          </p>
        </div>
        <span className="provider-badge">
          <span />
          Google Gemini
        </span>
      </div>
      <form className="guide-layout" onSubmit={sendQuestion}>
        <aside className="guide-sidebar">
          <section className="panel context-panel">
            <div className="context-heading">
              <span aria-hidden="true">◈</span>
              <div>
                <h2>Make it your game.</h2>
                <p>Give your guide a little context.</p>
              </div>
            </div>
            <fieldset disabled={loading} className="context-fields">
              <legend className="visually-hidden">Question context</legend>
              <div className="field">
                <label htmlFor="team">Team context</label>
                <select
                  id="team"
                  value={team}
                  onChange={(event) => {
                    setTeam(event.target.value);
                    setCity(
                      teams.find(
                        ([name]) => name === event.target.value,
                      )?.[1] || "",
                    );
                  }}
                >
                  {teams.map(([name]) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">
                  Destination <span>Optional</span>
                </label>
                <input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  maxLength={100}
                  placeholder="City you would like to visit"
                />
              </div>
              <div className="field">
                <label htmlFor="visit-date">
                  Your visit date <span>Optional</span>
                </label>
                <input
                  id="visit-date"
                  type="date"
                  value={visitDate}
                  onChange={(event) => setVisitDate(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="language">Answer language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="mk">Македонски</option>
                  <option value="sl">Slovenščina</option>
                </select>
              </div>
            </fieldset>
          </section>
          <p className="context-note">
            Your question and selected context are sent to Gemini. Live games,
            scores, weather and travel routes are not connected yet.
          </p>
        </aside>
        <section className="panel chat-panel" aria-labelledby="chat-title">
          <header className="chat-header">
            <div className="chat-identity">
              <span aria-hidden="true">✦</span>
              <div>
                <h2 id="chat-title">AI Guide</h2>
                <p>Basketball questions. Game-day ideas.</p>
              </div>
            </div>
            <button
              type="button"
              className="quiet-button"
              disabled={loading || (!answer && !error)}
              onClick={() => {
                setAnswer(null);
                setError("");
                setQuestion("");
              }}
            >
              Start again
            </button>
          </header>
          <div className="conversation" aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="thinking" role="status">
                <span aria-hidden="true">✦</span>
                <p>Preparing your answer…</p>
              </div>
            ) : answer ? (
              <div className="answer">
                <p className="asked-question">{askedQuestion}</p>
                <p className="answer-author">✦ AI Guide</p>
                <p className="answer-summary">{answer.summary}</p>
                {answer.facts.length > 0 && (
                  <section>
                    <h3>Good to know</h3>
                    <ul>
                      {answer.facts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {answer.recommendations.length > 0 && (
                  <section>
                    <h3>Suggestions</h3>
                    <ul>
                      {answer.recommendations.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            ) : (
              <div className="welcome">
                <span className="welcome-symbol" aria-hidden="true">
                  ✦
                </span>
                <p className="eyebrow">WELCOME TO YOUR AI GUIDE</p>
                <h3>What would you like to know?</h3>
                <p>
                  Ask any basketball question. Add team or visit context if useful.
                  <br />
                  Explore teams, players, rules, history and game-day ideas.
                </p>
                <div className="suggestions">
                  <button
                    type="button"
                    onClick={() =>
                      setQuestion(
                        `Tell me about the history of ${team} and their most memorable players.`,
                      )
                    }
                  >
                    <strong>Get to know your team</strong>Explore their history
                    and memorable players.
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setQuestion(
                        `Help me prepare for an NBA visit${city ? ` in ${city}` : ""}${visitDate ? ` on ${visitDate}` : ""}.`,
                      )
                    }
                  >
                    <strong>Make a game day plan</strong>How should I prepare
                    for my visit?
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="composer">
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="question-box">
              <label className="visually-hidden" htmlFor="question">
                Your question for AI Guide
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about teams, players, rules, history, which game to watch, or an NBA visit…"
                rows={3}
                minLength={3}
                maxLength={2000}
                required
                disabled={loading}
              />
              <div className="composer-bottom">
                <span>Make it personal. Ask your own question.</span>
                <button
                  className="button primary"
                  type="submit"
                  disabled={loading || question.trim().length < 3}
                >
                  {loading ? "Asking…" : "Ask AI Guide"}
                  <img
                    src="/images/figma/imgArrowUpRight.svg"
                    alt=""
                    width="18"
                    height="18"
                  />
                </button>
              </div>
            </div>
            <p className="ai-note">
              AI can make mistakes. Always verify current schedules and visit
              information.
            </p>
          </div>
        </section>
      </form>
    </main>
  );
}
