import { useEffect, useState } from "react";

export default function Clock() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [startCountdown, setCountdown] = useState(false);
  // Decrease the number every second
  useEffect(() => {
    if (timeLeft === 0) return;
    if (!startCountdown) {
      setTimeLeft(10);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, startCountdown]);

  const handleCountdown = () => {
    setCountdown(!startCountdown);
  };

  // Circle settings
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((10 - timeLeft) / 10) * circumference;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#ddd"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="red"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: "stroke-dashoffset 1s linear",
          }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="24"
          fill="black"
        >
          {timeLeft}
        </text>
      </svg>
      <button onClick={handleCountdown}>START</button>
    </div>
  );
}
