const GuessedLetters = ({ guessed, preguessed }) => {
  // parameters:
  // "guessed" is an array containing character-wide strings
  // "preguessed" is the array of characters shown by default in the show

  // make a new string of guessed characters
  // filter non-alphabeticals out while constructing string
  let guessedString = "";
  for (let g of guessed) {
    guessedString += preguessed.includes(g) ? "" : g + ", ";
  } //for

  guessedString = guessedString.slice(0, -2);

  return (
    <>
      <div>
        <h3 style={{margin: "0", marginBottom: "0.25em"}}>Guessed Letters</h3>
        <div id="guessedLetters_listarea">{guessedString}</div>
      </div>
    </>
  );
};

export default GuessedLetters;
