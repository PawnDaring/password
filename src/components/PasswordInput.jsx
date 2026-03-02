import { useState, useRef, useEffect, useCallback } from "react";
import "./PasswordInput.css";

export default function PasswordInput({
  currentInput,
  gameStatus,
  onCharInput,
  onDelete,
  onSubmit,
}) {
  const [displayChars, setDisplayChars] = useState([]);
  const inputRef = useRef(null);
  const timersRef = useRef([]);

  // Focus the hidden input on mount and clicks
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Sync displayChars length with currentInput
  useEffect(() => {
    setDisplayChars((prev) => {
      if (currentInput.length === 0) return [];
      if (currentInput.length < prev.length) {
        return prev.slice(0, currentInput.length);
      }
      return prev;
    });
  }, [currentInput]);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameStatus !== "playing") return;

      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        if (currentInput.length > 0) {
          const newInput = currentInput.slice(0, -1);
          setDisplayChars((prev) => prev.slice(0, -1));
          onDelete(newInput);
        }
        return;
      }

      // Only allow single printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const char = e.key;
        const newInput = currentInput + char;

        // Show real character briefly, then mask
        const charIndex = displayChars.length;
        setDisplayChars((prev) => [...prev, { char, masked: false }]);

        const timer = setTimeout(() => {
          setDisplayChars((prev) =>
            prev.map((c, i) =>
              i === charIndex ? { ...c, masked: true } : c
            )
          );
        }, 300);
        timersRef.current.push(timer);

        onCharInput(newInput);
      }
    },
    [gameStatus, currentInput, displayChars.length, onCharInput, onDelete, onSubmit]
  );

  return (
    <div className="password-input-wrapper" onClick={() => inputRef.current?.focus()}>
      <div className="password-input-glow" />
      <div className="password-input-container">
        <div className="input-display">
          {displayChars.length === 0 && (
            <span className="placeholder">Enter password...</span>
          )}
          {displayChars.map((c, i) => (
            <span
              key={i}
              className={`char ${c.masked ? "masked" : "revealed"}`}
            >
              {c.masked ? "•" : c.char}
            </span>
          ))}
          <span className="cursor" />
        </div>

        {/* Hidden real input for keyboard capture */}
        <input
          ref={inputRef}
          className="hidden-input"
          type="text"
          autoFocus
          onKeyDown={handleKeyDown}
          value=""
          onChange={() => {}}
          disabled={gameStatus !== "playing"}
          aria-label="Password input"
        />

        <button
          className="submit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSubmit();
          }}
          disabled={gameStatus !== "playing" || currentInput.length === 0}
          aria-label="Submit password"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
