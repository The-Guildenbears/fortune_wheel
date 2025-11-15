//Keyboard component
//Shows keys to pick and tracks guessed letters

import { Fragment } from "react/jsx-runtime";

const KeyboardMaker = ({ charOptions, guessedLetters, setLetterToBuy }) => {
  // parameters:
  // "charOptions" are the possible characters to select
  // "guessedLetters" is an array of letters guessed so far
  // "setLetterToBuy" is a useState setter

  // create an array of letters
  const letters = charOptions.split("");

  // breakpoints for rows; subject to change with UI
  const rowIndices = [12];

  // callback function for letter buttons
  const handleClick = (letter) => {
    setLetterToBuy(letter);
  };

  return (
    <> 
      <div style={{ textAlign: "center", width: "fit-content" }}>
        {letters.map((ch, i) => (
          // explicit calling of React.Fragment to give it a key value
          <Fragment key={ch}>
            <button
              onClick={() => handleClick(ch)}
              // disable button if the letter was already guessed
              // disable button also when it's a consonant and the wheel hasn't spun yet
              disabled={guessedLetters.includes(ch)}
              style={{
                marginRight: "0.5rem",
                marginBottom: "0.5rem",
                // letter fades if picked
                opacity: guessedLetters.includes(ch) ? 0.5 : 1
              }}
            >
              {ch}
            </button>
            {/* add a break to make the buttons look like a keyboard */}
            {rowIndices.includes(i) ? <br/> : <></>}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default KeyboardMaker;