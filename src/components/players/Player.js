import React, { useEffect, useState } from "react";
import { Wheel } from "../wheel/Wheel";

export function Player({
  players,
  setPlayers,
  currentPlayerIndex,
  setCurrentPlayerIndex,
}) {
  const WHEEL_VALS = [
    500,
    600,
    650,
    700,
    800,
    900,
    1000,
    "BANKRUPT",
    "LOSE A TURN",
    500,
    600,
    700,
  ];

  const [round, setRound] = useState(1);
  const [lastSpinResult, setLastSpinResult] = useState("---");
  const [wheelValues] = useState(WHEEL_VALS);
  const [message, setMessage] = useState("");

  const currentPlayer = players[currentPlayerIndex];

  function nextPlayer() {
    setCurrentPlayerIndex((idx) => (idx + 1) % players.length);
    setLastSpinResult("---");
    setMessage("");
  }

  function updatePlayerByIndex(index, updater) {
    setPlayers((prev) => prev.map((p, i) => (i === index ? updater(p) : p)));
  }

  //every time the wheel picks a result, update player info
  useEffect(() => {
    handleSpin();
  }, [lastSpinResult]);

  // Spin the wheel
  function handleSpin() {
    const pick = lastSpinResult;

    const me = currentPlayerIndex;

    if (pick === "BANKRUPT") {
      updatePlayerByIndex(me, (p) => ({ ...p, roundBank: 0, bankrupt: true }));
      setMessage(
        `${players[me].name} landed on BANKRUPT and loses all round money.`
      );
      nextPlayer();
      return;
    }

    if (pick === "LOSE A TURN") {
      updatePlayerByIndex(me, (p) => ({ ...p, bankrupt: false }));
      setMessage(`${players[me].name} loses a turn.`);
      nextPlayer();
      return;
    }

    if (typeof pick === "number") {
      updatePlayerByIndex(me, (p) => ({
        ...p,
        roundBank: p.roundBank + pick,
        bankrupt: false,
      }));
      setMessage(`${players[me].name} spun $${pick}. (Added to Round Bank)`);
    }
  }

  function endRoundBankToTotal() {
    setRound(round + 1);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        totalBank: p.totalBank + p.roundBank,
        roundBank: 0,
        bankrupt: false,
      }))
    );
    setMessage("Round ended. Round Banks added to Total Banks.");
    setLastSpinResult("---");
  }

  function resetRoundOnly() {
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, roundBank: 0, bankrupt: false }))
    );
    setMessage("Round reset. Round Banks cleared.");
    setLastSpinResult("---");
  }

  function resetTotals() {
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, roundBank: 0, totalBank: 0, bankrupt: false }))
    );
    setMessage("All totals reset. New game.");
    setLastSpinResult("---");
  }

  function shuffleTurnOrder() {
    const start = Math.floor(Math.random() * players.length);
    setCurrentPlayerIndex(start);
    setMessage(`Player to start: ${players[start].name}.`);
  }

  return (
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
      <button onClick={endRoundBankToTotal} style={{ marginRight: "0.5rem" }}>
        End Round (Total Bank)
      </button>
      <br />
      <br />
      <button onClick={resetRoundOnly} style={{ marginRight: "0.5rem" }}>
        Reset Round
      </button>
      <button onClick={resetTotals} style={{ marginRight: "0.5rem" }}>
        Reset Totals
      </button>
      <br />
      <br />
      <button onClick={shuffleTurnOrder}>Randomize Player who starts</button>
      <div style={{ marginTop: "0.75rem" }}>{message}</div>
    </>
  );
}
