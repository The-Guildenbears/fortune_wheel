import { useState, useEffect } from "react";
import { Wheel as RouletteWheel } from "react-custom-roulette";
import "./wheel.css";
import CreateWheel from "./CreateWheel";

const Wheel = ({ round, setWinner, hasSpun, setHasSpun }) => {
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
    setHasSpun(true);
  };

  //create the wheel
  const wheelData = wheel.map((segment) => {
    const isNumber = typeof segment.val === "number";

    return {
      option: isNumber
        ? `$${String(segment.val).split("").join("\n")}`
        : segment.val,
      style: {
        backgroundColor: segment.col,
      },
      image: {
        uri: `./${segment.val}_transparent.png`,
        offsetX: 0,
        offsetY: isNumber ? 120 : 130,
        sizeMultiplier: isNumber ? 1.2 : 1.4,
        landscape: false,
      },
    };
  });

  //set color for the wedge text
  const textColors = wheel.map((segment) =>
    segment.val === "LOSE TURN" ? "black" : "white"
  );

  return (
    <>
      <div className="wheel-container">
        <div className="controls">
          <button
            onClick={handleSpinClick}
            disabled={mustSpin || hasSpun}
            style={{ marginBottom: "0.5rem", marginTop: "1rem" }}
          >
            {hasSpun
              ? "Guess a consonant first!"
              : mustSpin
              ? "Now Spinning..."
              : "SPIN! THE! WHEEL!!!"}
          </button>
        </div>

        {wheelData.length > 0 && (
          <div
            className="wheel-wrapper"
            style={{ transform: "scale(1)", transformOrigin: "center" }}
          >
            <RouletteWheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={wheelData}
              textColors={textColors}
              onStopSpinning={handleStopSpinning}
              backgroundColors={["#3e3e3e", "#ff1100ff"]}
              fontSize={16}
              outerBorderColor="#333333"
              outerBorderWidth={4}
              innerBorderColor="#3CB371"
              innerBorderWidth={70}
              innerRadius={0}
              radiusLineColor="#333333"
              radiusLineWidth={1}
              spinDuration={0.4}
              perpendicularText={false}
              textDistance={60}
              // height={500}
              // width={500}
            />
          </div>
        )}
      </div>
    </>
  );
}; //component

export default Wheel;
