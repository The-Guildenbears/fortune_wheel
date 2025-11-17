import { useState, useEffect, useMemo } from "react";
import { Wheel as RouletteWheel } from "react-custom-roulette";
import "./wheel.css";
import { CreateWheel, MysteryWedge } from "./CreateWheel";

const Wheel = ({
  round,
  setWinner,
  hasSpun,
  setHasSpun,
  onMysteryLanded,
  onMysteryFlipped,
}) => {
  const [mysteryRevealed, setReveal] = useState(false);
  const [regularWheel, setRegularWheel] = useState([]);
  const [mysteryWheel, setMysteryWheel] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    const base = CreateWheel(round);
    const withMystery = MysteryWedge(base, round);
    setRegularWheel(base);
    setMysteryWheel(withMystery);
    setHasSpun(false);
    // reset reveal when round changes
    setReveal(false);
  }, [round, setHasSpun]);

  const wheel = mysteryRevealed ? regularWheel : mysteryWheel;

  const handleSpinClick = () => {
    if (!mustSpin && wheel.length > 0) {
      setMustSpin(true);
      const newPrizeNumber = Math.floor(Math.random() * wheel.length);
      setPrizeNumber(newPrizeNumber);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    const segment = wheel[prizeNumber];
    const value = segment?.val;

    setWinner(value);
    setHasSpun(true);

    if (value === "MYSTERY" && typeof onMysteryLanded === "function") {
      onMysteryLanded();
    }
  };

  const wheelData = useMemo(() => {
    return wheel.map((segment) => {
      const isNumber = typeof segment.val === "number";
      return {
        option: isNumber
          ? `$${String(segment.val).split("").join("\n")}`
          : segment.val,
        style: { backgroundColor: segment.col },
        // image: {
        //   uri: `./${segment.val}_transparent.png`,
        //   offsetX: 0,
        //   offsetY: isNumber ? 120 : 130,
        //   sizeMultiplier: isNumber ? 1.2 : 1.4,
        //   landscape: false,
        // },
      };
    });
  }, [wheel]);

  const textColors = useMemo(
    () => wheel.map((s) => (s.val === "LOSE TURN" ? "black" : "white")),
    [wheel]
  );

  return (
    <div className="wheel-container">
      <div className="controls">
        <button
          onClick={handleSpinClick}
          disabled={mustSpin || hasSpun || wheel.length === 0}
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
          />
        </div>
      )}

      {round === 2 && (
        <button
          onClick={() => {
            // flip between mysteryWheel and regularWheel
            setReveal((prev) => !prev);

            if (typeof onMysteryFlipped === "function") {
              onMysteryFlipped();
            }
          }}
        >
          Switch
        </button>
      )}
    </div>
  );
};

export default Wheel;
