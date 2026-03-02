import { useState, useCallback, useRef } from "react";
import { getRandomPassword } from "../data/words";

// Feedback types
export const FEEDBACK = {
  EXACT: "exact",           // Right letter, right place → 🃏
  CLOSE: "close",           // Right letter, wrong place → 🔮
  WRONG: "wrong",           // Not in password at all → 🎭
  WARMER: "warmer",         // Overall match % increased → 🔥
  WIN: "win",               // Password guessed correctly → 👑
  LOSE_ATTEMPT: "lose_attempt", // Wrong submission → 💀
  GAME_OVER: "game_over",  // All attempts exhausted → 💀☠️
};

const EMOJI_MAP = {
  [FEEDBACK.EXACT]: "🃏",
  [FEEDBACK.CLOSE]: "🔮",
  [FEEDBACK.WRONG]: "🎭",
  [FEEDBACK.WARMER]: "🔥",
  [FEEDBACK.WIN]: "👑",
  [FEEDBACK.LOSE_ATTEMPT]: "💀",
  [FEEDBACK.GAME_OVER]: "☠️",
};

function computeMatchScore(input, password) {
  if (!input || !password) return 0;
  let score = 0;
  const len = Math.min(input.length, password.length);
  for (let i = 0; i < len; i++) {
    if (input[i].toLowerCase() === password[i].toLowerCase()) {
      score++;
    }
  }
  return score / password.length;
}

let feedbackIdCounter = 0;

export default function usePasswordGame() {
  const [secretPassword, setSecretPassword] = useState(() => getRandomPassword());
  const [currentInput, setCurrentInput] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [feedbackQueue, setFeedbackQueue] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing"); // "playing" | "won" | "lost"
  const prevMatchScoreRef = useRef(0);

  // Add a feedback item that auto-expires
  const pushFeedback = useCallback((type, duration = 2500) => {
    const id = ++feedbackIdCounter;
    const emoji = EMOJI_MAP[type] || "❓";
    const item = { id, type, emoji, timestamp: Date.now() };

    setFeedbackQueue((prev) => [...prev, item]);

    setTimeout(() => {
      setFeedbackQueue((prev) => prev.filter((f) => f.id !== id));
    }, duration);

    return item;
  }, []);

  // Called on each keystroke (new character added)
  const handleCharInput = useCallback(
    (newInput) => {
      if (gameStatus !== "playing") return;

      setCurrentInput(newInput);

      if (newInput.length === 0) {
        prevMatchScoreRef.current = 0;
        return;
      }

      // Only evaluate the latest character added
      if (newInput.length > currentInput.length) {
        const charIndex = newInput.length - 1;
        const typedChar = newInput[charIndex].toLowerCase();
        const passwordLower = secretPassword.toLowerCase();

        // Per-character feedback
        if (charIndex < secretPassword.length && typedChar === passwordLower[charIndex]) {
          pushFeedback(FEEDBACK.EXACT);
        } else if (passwordLower.includes(typedChar)) {
          pushFeedback(FEEDBACK.CLOSE);
        } else {
          pushFeedback(FEEDBACK.WRONG);
        }

        // "Getting warmer" check
        const newScore = computeMatchScore(newInput, secretPassword);
        if (newScore > prevMatchScoreRef.current && newScore > 0) {
          setTimeout(() => pushFeedback(FEEDBACK.WARMER, 2000), 300);
        }
        prevMatchScoreRef.current = newScore;
      }
    },
    [gameStatus, currentInput, secretPassword, pushFeedback]
  );

  // Handle backspace / deletion
  const handleDelete = useCallback(
    (newInput) => {
      if (gameStatus !== "playing") return;
      setCurrentInput(newInput);
      prevMatchScoreRef.current = computeMatchScore(newInput, secretPassword);
    },
    [gameStatus, secretPassword]
  );

  // Submit the password guess
  const handleSubmit = useCallback(() => {
    if (gameStatus !== "playing") return;

    if (currentInput.toLowerCase() === secretPassword.toLowerCase()) {
      setGameStatus("won");
      pushFeedback(FEEDBACK.WIN, 5000);
      // Fire extra celebration emojis
      setTimeout(() => pushFeedback(FEEDBACK.WIN, 4500), 200);
      setTimeout(() => pushFeedback(FEEDBACK.WIN, 4000), 400);
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);

      if (newAttempts <= 0) {
        setGameStatus("lost");
        pushFeedback(FEEDBACK.GAME_OVER, 5000);
        setTimeout(() => pushFeedback(FEEDBACK.GAME_OVER, 4500), 200);
      } else {
        pushFeedback(FEEDBACK.LOSE_ATTEMPT, 3000);
        setCurrentInput("");
        prevMatchScoreRef.current = 0;
      }
    }
  }, [gameStatus, currentInput, secretPassword, attemptsLeft, pushFeedback]);

  // Start a new game
  const resetGame = useCallback(() => {
    setSecretPassword(getRandomPassword());
    setCurrentInput("");
    setAttemptsLeft(3);
    setFeedbackQueue([]);
    setGameStatus("playing");
    prevMatchScoreRef.current = 0;
    feedbackIdCounter = 0;
  }, []);

  return {
    secretPassword,
    currentInput,
    attemptsLeft,
    feedbackQueue,
    gameStatus,
    handleCharInput,
    handleDelete,
    handleSubmit,
    resetGame,
  };
}
