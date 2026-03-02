import { useMemo } from "react";
import "./CipherBackground.css";

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+*=#@$%&!?<>{}[]|~^";

function randomChar() {
  return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
}

export default function CipherBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      char: randomChar(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${10 + Math.random() * 16}px`,
      opacity: 0.03 + Math.random() * 0.12,
      animDuration: `${15 + Math.random() * 30}s`,
      animDelay: `${-Math.random() * 20}s`,
      driftX: `${-30 + Math.random() * 60}px`,
      driftY: `${-40 + Math.random() * 80}px`,
    }));
  }, []);

  return (
    <div className="cipher-background">
      {/* Gradient glows */}
      <div className="glow glow-green" />
      <div className="glow glow-magenta" />

      {/* Floating cipher characters */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="cipher-char"
          style={{
            left: p.left,
            top: p.top,
            fontSize: p.fontSize,
            opacity: p.opacity,
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
            "--drift-x": p.driftX,
            "--drift-y": p.driftY,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
