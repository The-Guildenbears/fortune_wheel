import { useState, useEffect } from "react";
import { Wheel as RouletteWheel } from "react-custom-roulette";
import "./wheel.css";
import CreateWheel from "./CreateWheel";

const Wheel = ({ round, setWinner }) => {
  const [wheel, setWheel] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    setWheel(CreateWheel(round));
  }, [round]);

  const handleSpinClick = () => {
    if (!mustSpin && wheel.length > 0) {
      //starting spinning
      setMustSpin(true);

      //decide winning value
      const newPrizeNumber = Math.floor(Math.random() * wheel.length);
      setPrizeNumber(newPrizeNumber);
    } //if
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setWinner(wheel[prizeNumber].val);
  };

  //create the wheel
  const wheelData = wheel.map((segment) => ({
    option:
      typeof segment.val === "number"
        ? `$${String(segment.val).split("").join("\n")}`
        : segment.val,
    style: {
      backgroundColor: segment.col,
    },
  }));

  //set color for the wedge text
  const textColors = wheel.map((segment) =>
    segment.val === "LOSE TURN" ? "black" : "white"
  );

  return (
    <>
      <div className="wheel-container">
        <h3>Round {round}</h3>

        <div className="controls">
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
              perpendicularText={false}
              textDistance={60}
            />
          </div>
        )}
      </div>
    </>
  );
}; //component

export default Wheel;
