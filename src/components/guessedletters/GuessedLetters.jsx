const GuessedLetters = ({guessed}) => {
    // parameters:
    // "guessed" is an arraycontaining character-wide strings

    const guessedString = [...guessed].join(", ");
    
    return(<>
        <div>
            <h3>Guessed Letters</h3>
            <p id="guessedLetters_listarea">{guessedString}</p>
        </div>
    </>);
}

export default GuessedLetters;