import { FEEDBACK } from "../hooks/usePasswordGame";
import "./EmojiFeedback.css";

export default function EmojiFeedback({ feedbackQueue }) {
  return (
    <div className="emoji-feedback-layer">
      {feedbackQueue.map((item) => {
        let className = "emoji-item";
        let style = {};

        switch (item.type) {
          case FEEDBACK.EXACT:
            className += " emoji-exact";
            style = randomPosition();
            break;
          case FEEDBACK.CLOSE:
            className += " emoji-close";
            style = randomPosition();
            break;
          case FEEDBACK.WRONG:
            className += " emoji-wrong";
            style = randomPosition();
            break;
          case FEEDBACK.WARMER:
            className += " emoji-warmer";
            style = { left: "50%", top: "40%" };
            break;
          case FEEDBACK.WIN:
            className += " emoji-win";
            style = randomPositionWide();
            break;
          case FEEDBACK.LOSE_ATTEMPT:
            className += " emoji-lose";
            style = randomPosition();
            break;
          case FEEDBACK.GAME_OVER:
            className += " emoji-gameover";
            style = randomPositionWide();
            break;
          default:
            style = randomPosition();
        }

        return (
          <span key={item.id} className={className} style={style}>
            {item.emoji}
          </span>
        );
      })}
    </div>
  );
}

// Random position near the input area
function randomPosition() {
  return {
    left: `${30 + Math.random() * 40}%`,
    top: `${35 + Math.random() * 30}%`,
  };
}

// Wider spread for celebration / game-over
function randomPositionWide() {
  return {
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 70}%`,
  };
}
