//Keyboard component
//Shows keys and tracks guessed letters
const Keyboard = ({ guessedLetters, setLetterToBuy }) => {
  // Makes a list of letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&".split("");

  const handleClick = (letter) => {
    setLetterToBuy(letter);
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
            disabled={guessedLetters.includes(ch)}
            style={{
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              //letter fades if picked
              opacity: guessedLetters.includes(ch) ? 0.5 : 1
            }}
          >
            {ch}
          </button>
        ))}
      </div>
    </>
  );
};

export default Keyboard;