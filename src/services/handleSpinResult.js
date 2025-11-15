import { updatePlayerByIndex } from "./updatePlayerByIndex";
import { WHEEL_CONFIG } from "../components/wheel/WheelConfig"; // adjust path if needed

export const handleSpinResult = (
  players,
  setPlayers,
  currentPlayerIndex,
  lastSpinResult,
  setMessage,
  setMoneyToWin
) => {
  let message = "";
  let roundMoney = players[currentPlayerIndex].roundBank;
  let toBankrupt = false;
  let toSkip = false;

  const playerName = players[currentPlayerIndex].name;

  // -----Cash wedge-----
  if (typeof lastSpinResult === "number") {
    setMoneyToWin(lastSpinResult);
    message = `${playerName} can win $${lastSpinResult} for each instance of the consonant they guess!`;

  // -----Mystery wedge-----
  } else if (lastSpinResult === "MYSTERY") {
    const safeCash = WHEEL_CONFIG.MY_SAFE_CASH ?? 1000;
    const bonusCash = WHEEL_CONFIG.MY_BONUS_CASH ?? 10000;

    const takeRisk = window.confirm(
      `${playerName} landed on the MYSTERY wedge!\n\n` +
        `Click "OK" to FLIP it (50/50 chance of BANKRUPT or $${bonusCash}).\n` +
        `Click "Cancel" to play it safe and use it as $${safeCash} per consonant.`
    );

    if (!takeRisk) {
      // Play it safe just behaves like a regular cash wedge
      setMoneyToWin(safeCash);
      message = `${playerName} plays it safe. MYSTERY acts like $${safeCash} for each consonant they guess.`;
      // They still get to guess
    } else {
      // Flip the wedge and do a coin flip
      const winBig = Math.random() < 0.5;

      if (winBig) {
        roundMoney += bonusCash;
        message = `${playerName} FLIPPED the MYSTERY wedge and WON $${bonusCash}!`;
        // Turn ends after this big win
        toSkip = true;
      } else {
        roundMoney = 0;
        toBankrupt = true;
        message = `${playerName} FLIPPED the MYSTERY wedge and went BANKRUPT!`;
        // Turn ends as they go bankrupt
        toSkip = true;
      }
    }

  // -----BANKRUPT/LOSE TURN-----
  } else {
    if (lastSpinResult === "BANKRUPT") {
      roundMoney = 0;
      toBankrupt = true;
      message = `${playerName} landed on BANKRUPT and loses all their money from this round!`;
    } else {
      // covers "LOSE TURN" (and any other non-number, non-MYSTERY string)
      message = `${playerName} loses a turn!`;
    }
    toSkip = true;
  }

  // Apply updates to current player state
  updatePlayerByIndex(
    currentPlayerIndex,
    setPlayers,
    (p) => ({ ...p, roundBank: roundMoney, bankrupt: toBankrupt }),
    false
  );

  setMessage(message);

  // Return whether the caller should move to the next player
  return toSkip;
};
