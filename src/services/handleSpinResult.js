import { updatePlayerByIndex } from "./updatePlayerByIndex";
import { WHEEL_CONFIG } from "../components/wheel/WheelConfig";

export const handleSpinResult = (
  players,
  setPlayers,
  currentPlayerIndex,
  lastSpinResult,
  setMessage,
  setMoneyToWin
) => {
  let message = "Message goes here";
  let roundMoney = players[currentPlayerIndex].roundBank;
  let toBankrupt = false;
  let toSkip = false;

  if (typeof lastSpinResult === "number") {
    setMoneyToWin(lastSpinResult);
    message = `${players[currentPlayerIndex].name} can win $${lastSpinResult} for each instance of the consonant they guess!`;
  } else {
    if (lastSpinResult === "BANKRUPT") {
      roundMoney = 0;
      toBankrupt = true;
      message = `${players[currentPlayerIndex].name} landed on BANKRUPT and loses all their money from this round!`;
      toSkip = true;
    } else if (lastSpinResult === "LOSE TURN") {
      message = `${players[currentPlayerIndex].name} loses a turn!`;
      toSkip = true;
    } else if (lastSpinResult === "MYSTERY") {
      const safeCash = WHEEL_CONFIG.MY_SAFE_CASH;
      setMoneyToWin(safeCash);

      message = `${players[currentPlayerIndex].name} landed on the MYSTERY wedge! They can win $${safeCash} for each instance of the consonant they guess, or flip using the Switch button for a chance at the bonus!`;

      toSkip = false;
    } else {
      message = `${players[currentPlayerIndex].name} loses a turn!`;
      toSkip = true;
    }
  }

  updatePlayerByIndex(
    currentPlayerIndex,
    setPlayers,
    (p) => ({ ...p, roundBank: roundMoney, bankrupt: toBankrupt }),
    false
  );

  setMessage(message);
  return toSkip ? true : false;
};

