import "./GameHUD.css";

export default function GameHUD({
  attemptsLeft,
  gameStatus,
  secretPassword,
  onNewGame,
}) {
  return (
    <div className="game-hud">
      <div className="hud-top">
        <h1 className="game-title">
          <span className="title-icon">🃏</span> H-AUTH: REQUIRED
        </h1>

        <div className="attempts">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`lock ${i < attemptsLeft ? "locked" : "broken"}`}
            >
              {i < attemptsLeft ? "🔒" : "🔓"}
            </span>
          ))}
        </div>
      </div>

      {gameStatus === "won" && (
        <div className="game-end-overlay">
          <div className="end-card win-card">
            <div className="end-emoji">👑🃏👑</div>
            <h2>ACCESS GRANTED</h2>
            <p className="reveal-password">
              The password was: <strong>{secretPassword}</strong>
            </p>
            <button className="new-game-btn" onClick={onNewGame}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="game-end-overlay">
          <div className="end-card lose-card">
            <div className="end-emoji">💀☠️💀</div>
            <h2>ACCESS DENIED</h2>
            <p className="reveal-password">
              The password was: <strong>{secretPassword}</strong>
            </p>
            <button className="new-game-btn" onClick={onNewGame}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {gameStatus === "playing" && (
        <p className="hint-text">
          
        </p>
      )}
    </div>
  );
}
