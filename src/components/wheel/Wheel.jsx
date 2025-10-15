import { useState, useEffect } from "react";
import CreateWheel from "./CreateWheel";

export function Wheel() {
  const [round, setRound] = useState(1);
  const [wheel, setWheel] = useState([]);

  useEffect(() => {
    setWheel(CreateWheel(round));
  }, [round]);

  const handleClick = () => {
    setRound((r) => r + 1);
  };

  return (
    <>
      <div>
        <h1>THE WHEEL</h1>
        <h2>Round {round}</h2>
        <button onClick={handleClick}>Create Wheel</button>
        <ul>
          {wheel.map((space, i) => (
            <li key={i} style={{ color: space.col }}>
              {space.val}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
