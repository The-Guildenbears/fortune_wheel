import "./guessed.css";
const GuessedLetters = ({ guessed }) => {
  // parameters:
  // "guessed" is an arraycontaining character-wide strings

  const guessedString = guessed.join(", ");

  return (
    <>
      <div className="guess-cont">
        <h3 className="play-bold">Guessed Letters</h3>
        <div id="guessedLetters_listarea" className="play-bold letter-cont">
          {guessedString}
        </div>
      </div>
    </>
  );
};

export default GuessedLetters;
