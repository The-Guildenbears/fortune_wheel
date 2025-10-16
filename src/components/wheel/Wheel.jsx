import { useState, useEffect } from "react";
import { Wheel as RouletteWheel } from "react-custom-roulette";
import "./wheel.css";
import CreateWheel from "./CreateWheel";

export function Wheel() {
  const [round, setRound] = useState(1);
  const [wheel, setWheel] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  // const [winner, setWinner] = useState(null);

  useEffect(() => {
    setWheel(CreateWheel(round));
  }, [round]);

  const handleClick = () => {
    console.log(typeof round);
    setRound((r) => r + 1);
    // setWinner(null);
  };

  const handleSpinClick = () => {
    if (!mustSpin && wheel.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * wheel.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    // setWinner(wheel[prizeNumber].val);
  };

  const wheelData = wheel.map((segment) => ({
    option:
      typeof segment.val === "number"
        ? `$${String(segment.val).split("").join("\n")}`
        : segment.val,
    style: {
      backgroundColor: segment.col,
    },
  }));

  const textColors = wheel.map((segment) =>
    segment.val === "LOSE TURN" ? "black" : "white"
  );

  return (
    <div className="wheel-container">
      <h1>THE WHEEL</h1>
      <h2>Round {round}</h2>

      <div className="controls">
        <button onClick={handleClick}>Next Round</button>
        <button onClick={handleSpinClick} disabled={mustSpin}>
          {mustSpin ? "Spinning..." : "SPIN"}
        </button>
      </div>
      {wheelData.length > 0 && (
        <div className="wheel-wrapper">
          <RouletteWheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            textColors={textColors}
            onStopSpinning={handleStopSpinning}
            backgroundColors={["#3e3e3e", "#ff1100ff"]}
            fontSize={16}
            outerBorderColor="#333333"
            outerBorderWidth={1}
            innerBorderColor="#333333"
            innerBorderWidth={0}
            innerRadius={5}
            radiusLineColor="#333333"
            radiusLineWidth={1}
            spinDuration={0.4}
            startingOptionIndex={0}
            perpendicularText={false}
            textDistance={60}
          />
        </div>
      )}
    </div>
  );
}
