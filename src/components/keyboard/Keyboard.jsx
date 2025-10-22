import { useEffect, useState } from "react";

//Keyboard component
//Shows keys and tracks guessed letters
const Keyboard = ({ guessedLetters, setGuessedLetters, onLetterPicked, resetFlag }) => {
  // Makes a list of letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&".split("");

  // Local guessed letters. If App.jsx doesn't give the letters as a prop
  const [localGuesses, setLocalGuesses] = useState([]);

  const guesses = guessedLetters ?? localGuesses;
  const setGuesses = setGuessedLetters ?? setLocalGuesses;

  //Clear all guessed letters when new round
  useEffect(() => {
    if (resetFlag !== undefined) {
      setGuesses([]);
    }
  }, [resetFlag, setGuesses]);

  const handleClick = (letter) => {
    if (guesses.includes(letter)) return;

    //Add new letter to guessed list
    setGuesses((prev) => [...prev, letter]);

    //Tell parent component which letter was picked
    if (onLetterPicked) onLetterPicked(letter);
  };

  return (
    <>
      <h2>KEYBOARD</h2>

      <div style={{ marginBottom: "0.75rem" }}>
        {letters.map((ch) => (
          <button
          //key for each button
            key={ch}
            onClick={() => handleClick(ch)}
            disabled={guesses.includes(ch)}
            style={{
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              //letter fades if picked
              opacity: guesses.includes(ch) ? 0.5 : 1
            }}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Guessed letters box */}
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Guessed Letters:</strong>
      </div>
      <div
        id="guessed_letters_box"
        style={{
          minHeight: "36px",
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "6px",
          backgroundColor: "#FFFFFF"
        }}
      >
        {guesses && guesses.length ? guesses.join(" ") : "(none yet)"}
      </div>
    </>
  );
};

export default Keyboard;