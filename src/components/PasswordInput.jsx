import { useState, useRef, useEffect, useCallback } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
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

  // Shared logic for adding a character (used by both physical and virtual keyboard)
  const addChar = useCallback(
    (char) => {
      if (gameStatus !== "playing") return;
      const newInput = currentInput + char;

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
    },
    [gameStatus, currentInput, displayChars.length, onCharInput]
  );

  const doBackspace = useCallback(() => {
    if (gameStatus !== "playing" || currentInput.length === 0) return;
    const newInput = currentInput.slice(0, -1);
    setDisplayChars((prev) => prev.slice(0, -1));
    onDelete(newInput);
  }, [gameStatus, currentInput, onDelete]);

  const doSubmit = useCallback(() => {
    if (gameStatus !== "playing") return;
    onSubmit();
  }, [gameStatus, onSubmit]);

  const handleKeyDown = useCallback(
    (e) => {
      if (gameStatus !== "playing") return;

      if (e.key === "Enter") {
        e.preventDefault();
        doSubmit();
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        doBackspace();
        return;
      }

      // Only allow single printable characters
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        addChar(e.key);
      }
    },
    [gameStatus, addChar, doBackspace, doSubmit]
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

      <VirtualKeyboard
        onKey={addChar}
        onBackspace={doBackspace}
        onEnter={doSubmit}
        disabled={gameStatus !== "playing"}
      />
    </div>
  );
}
