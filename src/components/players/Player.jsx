import { useEffect, useState } from "react";
import Wheel from "../wheel/Wheel";

const Player = ({
  players,
  setPlayers,
  currentPlayerIndex,
  setCurrentPlayerIndex,
}) => {
  // Round counters
  const [round, setRound] = useState(1);
  const currentPlayer = players[currentPlayerIndex];

  // Spinner data
  const [lastSpinResult, setLastSpinResult] = useState("---");
  const [message, setMessage] = useState("");

  const nextPlayer = () => {
    setCurrentPlayerIndex((idx) => (idx + 1) % players.length);
    setLastSpinResult("---");
    setMessage("");
  }//func

  const updatePlayerByIndex = (index, updater) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? updater(p) : p)));
  }//func

  //every time the wheel picks a result, update player info
  useEffect(() => {
    handleSpin();
  }, [lastSpinResult]);

  // Spin the wheel
  const handleSpin = () => {
    //keep track of all values for updating a player
    let message = "Message goes here";
    let banked = players[currentPlayerIndex].roundBank;
    let toBankrupt = false;
    let toSkip = false;

    if(typeof lastSpinResult === "number"){
      //landed on a cash value
      banked += lastSpinResult;
      message = `${players[currentPlayerIndex].name} has earned $${lastSpinResult}! (Added to Round Bank)`;
    }else{
      //landed on either "BANKRUPT" or "LOSE A TURN"
      if(lastSpinResult === "BANKRUPT"){
        banked = 0;
        toBankrupt = true;
        message = `${players[currentPlayerIndex].name} landed on BANKRUPT and loses all their money from this round!`;
      }else{
        toSkip = true;
        message = `${players[currentPlayerIndex].name} loses a turn!`;
      }//if-else
    }//if-else

    //update player info as needed
    updatePlayerByIndex(currentPlayerIndex, (p) => ({ ...p, roundBank: banked, bankrupt: toBankrupt}));
    setMessage(message);

    //skip player as needed
    if(toSkip) nextPlayer();
  }//func

  const roundMover = (code) => {
    //keep track of all values used to update the round
    let message = "Message goes here";
    let isRoundEnded = false;
    let isTotalReset = false;
    let toSetRound = round;

    //by default, just reset the round because it's the simplest
    switch(code){
      case "ROUND_ENDED":
        isRoundEnded = true;
        message = "Round ended; unbanked money added to player banks.";
        toSetRound = round + 1;
        break;
      case "TOTAL_RESET":
        isTotalReset = true;
        message = "New Game: All totals reset."
        toSetRound = 0;
        break;
      case "ROUND_RESET":
      default:
        message = "Round reset; unbanked money cleared.";
        break;
    }//switch

    //update players, message, spin result, and the round number
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        totalBank: isTotalReset ? 0 : (p.totalBank + (isRoundEnded ? p.roundBank : 0)),
        roundBank: 0,
        bankrupt: false,
      }))
    );
    setMessage(message);
    setLastSpinResult("---");
    setRound(toSetRound);
  }//func

  const shuffleTurnOrder = () => {
    const start = Math.floor(Math.random() * players.length);
    setCurrentPlayerIndex(start);
    setMessage(`Player to start: ${players[start].name}.`);
  }//func

  return(
    <>
      <h2>PLAYERS</h2>
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Current Player:</strong> {currentPlayer.name}
        </div>

        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {players.map((p, i) => (
            <li key={p.id}>
              {i === currentPlayerIndex ? "👉 " : ""}
              {p.name} — Round: ${p.roundBank} | Total: ${p.totalBank}{" "}
              {p.bankrupt ? "(Bankrupt)" : ""}
            </li>
          ))}
        </ul>
      </div>
      <Wheel round={round} setWinner={setLastSpinResult} />
      <button onClick={nextPlayer} style={{ marginRight: "0.5rem" }}>
        Next Player
      </button>
      <br /> <br />
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Last Spin Result:</strong> {lastSpinResult}
      </div>
      <br />
      <br />
      <button onClick={() => roundMover("ROUND_ENDED")} style={{ marginRight: "0.5rem" }}>
        End Round (Total Bank)
      </button>
      <br />
      <br />
      <button onClick={() => roundMover("ROUND_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Round
      </button>
      <button onClick={() => roundMover("TOTAL_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Totals
      </button>
      <br />
      <br />
      <button onClick={shuffleTurnOrder}>Randomize Player who starts</button>
      <div style={{ marginTop: "0.75rem" }}>{message}</div>
    </>
  );
}

export default Player;