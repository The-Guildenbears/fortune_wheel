import { useEffect, useState } from "react";

const GuessedLetters = ({guessedSet}) => {
    // parameters:
    // "guessedSet" is a SET object containing character-wide strings

    const [guessedString, setGuessedString] = useState("");

    useEffect(() => {
        //get text area listing letters
        let listArea = document.getElementById("guessedLetters_listarea");

        //clear the text area
        setGuessedString("");

        if(guessedSet.size !== 0){
            //fill in with guessed letters
            const iterator = guessedSet.values();
            for(const i of iterator){
                setGuessedString(`${guessedString} ${i}, `);
            }//for

            //trim end of guessedString
            setGuessedString(guessedString.slice(0, -2));
        }//if
    }, [guessedSet]);
    
    return(<>
        <div>
            <h3>Guessed Letters</h3>
            <p id="guessedLetters_listarea">{guessedString}</p>
        </div>
    </>);
}

export default GuessedLetters;