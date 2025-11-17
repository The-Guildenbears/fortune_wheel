//Keyboard component
//Shows keys and tracks guessed letters

import { Fragment } from "react/jsx-runtime";

const Keyboard = ({ guessedLetters, setLetterToBuy, hasSpun }) => {
  // parameters:
  // "guessedLetters" is an array of letters guessed so far
  // "setLetterToBuy" is a useState setter

  // create an array of letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // breakpoints for rows; subject to change with UI
  const rowIndices = [10, 19, 26];

  // vowels are not restricted by the wheel
  const vowels = ["A", "E", "I", "O", "U"];

  // callback function for letter buttons
  const handleClick = (letter) => {
    setLetterToBuy(letter);
  };

  return (
    <>
      <h2>KEYBOARD</h2>

      {!hasSpun ? (
        <>
          {/* prompt the player to spin the wheel first */}
          <strong>To guess a consonant, spin the wheel first!</strong>
          <br />
          <br />
        </>
      ) : (
        <></>
      )}

      <div
        style={{
          marginBottom: "0.75rem",
          textAlign: "center",
          width: "fit-content",
        }}
      >
        {letters.map((ch, i) => (
          // explicit calling of React.Fragment to give it a key value
          <Fragment key={ch}>
            <button
              onClick={() => handleClick(ch)}
              // disable button if the letter was already guessed
              // disable button also when it's a consonant and the wheel hasn't spun yet
              disabled={
                guessedLetters.includes(ch) ||
                (!hasSpun && !vowels.includes(ch))
              }
              style={{
                marginRight: "0.5rem",
                marginBottom: "0.5rem",
                // letter fades if picked
                opacity: guessedLetters.includes(ch) ? 0.5 : 1,
              }}
            >
              {ch}
            </button>
            {/* add a break to make the buttons look like a keyboard */}
            {rowIndices.includes(i) ? <br /> : <></>}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default Keyboard;
