import "./VirtualKeyboard.css";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function VirtualKeyboard({ onKey, onBackspace, onEnter, disabled }) {
  const handlePress = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    action();
  };

  return (
    <div className="virtual-keyboard" onMouseDown={(e) => e.preventDefault()}>
      {ROWS.map((row, ri) => (
        <div key={ri} className="kb-row">
          {ri === 2 && (
            <button
              className="kb-key kb-key-wide kb-enter"
              onPointerDown={(e) => handlePress(e, onEnter)}
              disabled={disabled}
              aria-label="Enter"
            >
              ↵
            </button>
          )}
          {row.map((key) => (
            <button
              key={key}
              className="kb-key"
              onPointerDown={(e) => handlePress(e, () => onKey(key.toLowerCase()))}
              disabled={disabled}
            >
              {key}
            </button>
          ))}
          {ri === 2 && (
            <button
              className="kb-key kb-key-wide kb-backspace"
              onPointerDown={(e) => handlePress(e, onBackspace)}
              disabled={disabled}
              aria-label="Backspace"
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
