import usePasswordGame from "./hooks/usePasswordGame";
import CipherBackground from "./components/CipherBackground";
import GameHUD from "./components/GameHUD";
import PasswordInput from "./components/PasswordInput";
import EmojiFeedback from "./components/EmojiFeedback";
import "./App.css";

function App() {
  const {
    secretPassword,
    currentInput,
    attemptsLeft,
    feedbackQueue,
    gameStatus,
    handleCharInput,
    handleDelete,
    handleSubmit,
    resetGame,
  } = usePasswordGame();

  // Screen shake on wrong submission
  const onSubmit = () => {
    const wasPlaying = gameStatus === "playing";
    handleSubmit();
    // If it's wrong, shake the screen
    if (wasPlaying && currentInput.toLowerCase() !== secretPassword.toLowerCase()) {
      document.getElementById("root").classList.add("shake");
      setTimeout(() => {
        document.getElementById("root").classList.remove("shake");
      }, 500);
    }
  };

  return (
    <>
      <CipherBackground />

      <div className="game-layout">
        <div className="top-container">
          <div className="jester-image" />
          <GameHUD
            attemptsLeft={attemptsLeft}
            gameStatus={gameStatus}
            secretPassword={secretPassword}
            onNewGame={resetGame}
          />
        </div>

        {gameStatus === "playing" && (
          <div className="bottom-container">
            <PasswordInput
              currentInput={currentInput}
              gameStatus={gameStatus}
              onCharInput={handleCharInput}
              onDelete={handleDelete}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </div>

      <EmojiFeedback feedbackQueue={feedbackQueue} />
    </>
  );
}

export default App;
