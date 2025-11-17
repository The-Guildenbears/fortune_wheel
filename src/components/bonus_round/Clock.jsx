import { useEffect, useState } from "react";

export default function Clock({ bonusSolved, startCountdown, setCountdown }) {
  const [timeLeft, setTimeLeft] = useState(10);
  // Countdown logic
  useEffect(() => {
    if (!startCountdown) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startCountdown, timeLeft, bonusSolved]);

  const handleCountdown = () => {
    if (startCountdown) {
      setCountdown(false);
      setTimeLeft(10);
    } else {
      setTimeLeft(10);
      setCountdown(true);
    }
  };

  // DOT ORDER (symmetric reveal left+right)
  const DOT_ANGLES = Array.from({ length: 20 }, (_, i) => 9 + i * 18);
  const DOT_ORDER = [];

  for (let i = 0; i < 10; i++) {
    DOT_ORDER.push(DOT_ANGLES[i], DOT_ANGLES[19 - i]);
  }

  const elapsed = 10 - timeLeft;
  const visibleDots = startCountdown ? Math.min(20, (elapsed + 1) * 2) : 0;

  if (timeLeft === 0 && !bonusSolved) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="70" fill="#FF0000" />

          <text
            x="50%"
            y="42%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="22"
          >
            You Lose!
          </text>

          <text
            x="50%"
            y="57%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="12"
          >
            Bonus Prize Lost
          </text>

          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="16"
          >
            $50,000.00
          </text>
        </svg>
      </div>
    );
  }
  if (bonusSolved && timeLeft >= 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="70" fill="#00A43A" />

          <text
            x="50%"
            y="42%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="18"
          >
            You've Won
          </text>

          <text
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="22"
          >
            $50,000.00
          </text>

          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="'Play-Bold','Play',system-ui,sans-serif"
            fontSize="14"
          >
            Congratulations
          </text>
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <svg
        width="300"
        height="300"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="70" fill="none" stroke="none" />

        <defs>
          <circle id="dot" cx="0" cy="-70" r="5" fill="red" />
        </defs>

        {startCountdown && (
          <>
            <g transform="translate(100,100)">
              {DOT_ORDER.slice(0, visibleDots).map((angle, idx) => (
                <use key={idx} href="#dot" transform={`rotate(${angle})`} />
              ))}
            </g>

            <text
              x="100"
              y="100"
              style={{ fontFamily: "play-bold" }}
              fontSize="32"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
            >
              {timeLeft}
            </text>
          </>
        )}
      </svg>

      <button onClick={handleCountdown}>
        {startCountdown ? "RESET" : "START"}
      </button>
    </div>
  );
}
