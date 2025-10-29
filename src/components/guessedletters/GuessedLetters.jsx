const GuessedLetters = ({guessed, preguessed}) => {
    // parameters:
    // "guessed" is an array containing character-wide strings
    // "preguessed" is the array of characters shown by default in the show
    
    // make a new string of guessed characters
    // filter non-alphabeticals out while constructing string
    let guessedString = "";
    for(let g of guessed){
        guessedString += preguessed.includes(g) ? "" : g + ", ";
    }//for

    guessedString = guessedString.slice(0, -2);
    
    return(<>
        <div>
            <h3>Guessed Letters</h3>
            <p id="guessedLetters_listarea">{guessedString}</p>
        </div>
      </div>
    </>
  );
};

export default GuessedLetters;
