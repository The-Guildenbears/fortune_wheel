import "./App.css";
import { useState } from "react";
import { Player } from "./components/players/Player";
import { Board } from "./components/board/Board";

function App() {
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 2, name: "Player 2", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 3, name: "Player 3", roundBank: 0, totalBank: 0, bankrupt: false },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const currentPlayer = players[currentPlayerIndex];

  // ----- Vowel Buying Logic -----
  const vowels = ["A", "E", "I", "O", "U"];
  const [revealedVowels, setRevealedVowels] = useState([]);
  const [showVowels, setShowVowels] = useState(false);

  const handleBuyClick = () => {
    if (
      currentPlayer.roundBank >= 500 &&
      revealedVowels.length < vowels.length
    ) {
      setShowVowels(true);
    }
  };

  const buyVowel = (vowel) => {
    if (currentPlayer.roundBank < 500) {
      alert(`${currentPlayer.name} does not have enough money to buy a vowel!`);
      return;
    }

    const confirmed = window.confirm(
      `${currentPlayer.name} wants to buy vowel ${vowel} for $500?`
    );
    if (!confirmed) return;

    // Subtract $500 from the current player's round bank
    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex ? { ...p, roundBank: p.roundBank - 500 } : p
    );
    setPlayers(updatedPlayers);

    setRevealedVowels([...revealedVowels, vowel]);
    setShowVowels(false);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Aidan, Tanna, Emma and Tarik's Wheel of Fortune</h1>

      <Board revealedLetters={revealedVowels} />

      {/* Player Management */}
      <Player
        players={players}
        setPlayers={setPlayers}
        currentPlayerIndex={currentPlayerIndex}
        setCurrentPlayerIndex={setCurrentPlayerIndex}
      />

      {/* Buy a Vowel Section */}
      <div style={{ marginTop: "20px" }}>
        {!showVowels && (
          <button
            onClick={handleBuyClick}
            disabled={
              currentPlayer.roundBank < 500 ||
              revealedVowels.length === vowels.length
            }
            style={{ margin: "5px", padding: "8px 12px" }}
          >
            Buy a Vowel ($500)
          </button>
        )}

        {showVowels && (
          <div style={{ marginTop: "10px" }}>
            {vowels.map((v) => (
              <button
                key={v}
                onClick={() => buyVowel(v)}
                disabled={
                  revealedVowels.includes(v) || currentPlayer.roundBank < 500
                }
                style={{
                  backgroundColor: "#90ee90",
                  margin: "5px",
                  padding: "8px 12px",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
