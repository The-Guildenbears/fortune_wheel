//import styles
import "./App.css";

//import components
import Player from "./components/players/Player";
import Board from "./components/board/Board";
import { Wheel } from "./components/wheel/Wheel";
///////////////////////////////////////////////////
import Keyboard from "./components/keyboard/keyboard"; 

//import React hooks
import { useEffect, useState, useRef } from "react";

//import functions
import { getPuzzles } from "./services/getPuzzles";
import GuessedLetters from "./components/guessedletters/GuessedLetters";

//The component
const App = () => {
  // Startup data hooks
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetching = useRef(true);

  // In-game data hooks
  const [puzzlePicked, setPuzzlePicked] = useState(0);
  const [puzzleFragment, setPuzzleFragment] = useState("");

  // other game data
  ///////////////////////////////////////////////////
  const [guessed, setGuessed] = useState(new Set());

  //get the puzzles only once
  useEffect(() => {
    //skip if data already fetched; otherwise flag fetching
    if(!fetching.current) return;
    fetching.current = false;

    const loadPuzzles = async() => {
      try {
        const data = await getPuzzles();
        console.log(data);
        setPuzzles(data);
      } catch (error) {
        console.error("Failed to load puzzles:", error);
      } finally {
        //Finish load anyways
        setLoading(false);
      }//try-catch-finally
    };
    
    loadPuzzles();
  }, []);//useEffect

  //for rendering purposes, pick any puzzle string
  useEffect(() => {
    if(puzzles.length > 0){
      setPuzzlePicked(Math.floor(Math.random() * puzzles.length));
    }//if
  }, [puzzles]);

  //set up puzzle fragment to pass along to board
  ///////////////////////////////////////////////////
  //Update puzzle display when guesses/puzzles change
  useEffect(() => {
    if(puzzles.length > 0){
      let str = puzzles[puzzlePicked].puzzle;
      let res = "";
      for(let ch of str){
        if(ch === " "){
          res += ch;
        }else{
          if(guessed.has(ch.toUpperCase())){ 
            res += ch;
          }else{
            res += "*";
          }
        }
      }
      //Save the final string to show on board
      setPuzzleFragment(res);
    }
    //run code again when guesses/puzzles changes
  }, [guessed, puzzles, puzzlePicked]); 

  // Player logic
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

    // Also records the vowel as guessed so it shows on the board
    ///////////////////////////////////////////////////
    //update list of guessed letters
    setGuessed(prev => {
      //make a copy of previous guessed letters
      const next = new Set(prev);
      next.add(vowel.toUpperCase());
      return next;
    });

    setShowVowels(false);
  };

  ///////////////////////////////////////////////////
  // When a keyboard letter is clicked
  const onLetterPicked = (letter) => {
    
    //updates the list of guessed letters
    setGuessed(prev => {
      //if letter was already guessed, do nothing
      if (prev.has(letter)) return prev;
      //make a copy of previously guessed letters
      const next = new Set(prev);
      next.add(letter);
      return next;
    });
  };
  
  return (
    <>
  
      {(loading || puzzles.length === 0) ? ( 
        <>
          <h1>Please Wait</h1>
          <p>Loading puzzles...</p>
        </>
      ) : ( 
        <>
          <div>Aidan, Tannah, Emma and Tarik's Wheel of Fortune</div>
  
          <div id="row_board" className="box">
            <Board puzzleFragment={puzzleFragment} category={puzzles[puzzlePicked].category} />
          </div>

          <div className="box" style={{ marginTop: "16px" }}>
            
            {/*/////////////////////////////////////////////////////////*/}
        
        <Keyboard
          guessedLetters={[...guessed]}
          setGuessedLetters={(updater) => {
            const nextArray =
              typeof updater === "function" ? updater([...guessed]) : updater;
        
            setGuessed(new Set(nextArray.map((ch) => ch.toUpperCase())));
          }}
          onLetterPicked={(ch) => onLetterPicked(ch.toUpperCase())}
        />
      </div> 
  
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
        </>
      )}  
    </>
  );
}
  export default App;