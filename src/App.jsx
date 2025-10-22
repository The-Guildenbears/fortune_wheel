// import styles
import "./App.css";

// import components
import Player from "./components/players/Player";
import Board from "./components/board/Board";
import Wheel from "./components/wheel/Wheel";

// import React hooks
import { useEffect, useState, useRef } from "react";

// import functions
import { getPuzzles } from "./services/getPuzzles";
import GuessedLetters from "./components/guessedletters/GuessedLetters";
import { roundMover } from "./services/roundMover";
import { handleSpinResult } from "./services/handleSpinResult";
import Keyboard from "./components/keyboard/Keyboard";
import buyVowel from "./services/buyVowel";

// the component
const App = () => {
  // --------- data hooks ---------

  // Startup data hooks
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetching = useRef(true);

  // puzzle data hooks
  const [puzzlePicked, setPuzzlePicked] = useState(0);
  const [puzzleFragment, setPuzzleFragment] = useState("");

  // data hooks for guessed letters
  const [guessed, setGuessed] = useState([]);

  // player data hooks
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 2, name: "Player 2", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 3, name: "Player 3", roundBank: 0, totalBank: 0, bankrupt: false },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // wheel data hooks
  const [lastSpinResult, setLastSpinResult] = useState("---");
  const [wheelMessage, setWheelMessage] = useState("");

  // round data hooks
  const [round, setRound] = useState(0);
  
  // letter data hooks
  const vowels = ["A", "E", "I", "O", "U"];
  const [letterToBuy, setLetterToBuy] = useState("");

  // ------------------ puzzle logic ------------------

  // get the puzzles only once
  useEffect(() => {
    // skip if data already fetched; otherwise flag fetching
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

  // for rendering purposes, pick any puzzle
  useEffect(() => {
    if(puzzles.length > 0){
      setPuzzlePicked(Math.floor(Math.random() * puzzles.length));
    }//if
  }, [puzzles]);

  // set up puzzle fragment to pass along to board
  useEffect(() => {
    if(puzzles.length > 0){
      let str = puzzles[puzzlePicked].puzzle;
      let res = "";
      for(let ch of str){
        if(ch === " "){
          res += ch;
        }else{
           if(guessed.includes(ch)){
              res += ch;
            }else {
              res += "*";
            }//if-else
        }//if-else
      }//for

      setPuzzleFragment(res);
    }//if
  }, [guessed, puzzles, puzzlePicked]);//useEffect

  // ------------------ letter buying logic ------------------

  useEffect(() => {
    if(letterToBuy.length === 1){
      onLetterPicked(letterToBuy);
    }//if
  }, [letterToBuy]);

  const onLetterPicked = (letter) => {
    let toAddLetter = true;

    if(vowels.includes(letter)){
      toAddLetter = buyVowel(letter, players, setPlayers, currentPlayerIndex, guessed);
    }

    if(toAddLetter){
      setGuessed([...guessed, letter]);
    }
  };

  // ------------------ wheel logic ------------------

  const hasRun = useRef(false);
  useEffect(() => {
    const toSkip = handleSpinResult(players, setPlayers, currentPlayerIndex, lastSpinResult, setWheelMessage);

    if(!hasRun.current && toSkip){
      nextPlayer();
      hasRun.current = true;
    }else{
      hasRun.current = false;
    }
  }, [lastSpinResult]);

  // ------------------ round and turn logic ------------------

  const nextPlayer = () => {
    let ind = (currentPlayerIndex < 2 ? currentPlayerIndex + 1 : 0);

    while(players[ind].bankrupt){
      ind = (ind < 2 ? ind + 1 : 0);
    }//while

    setCurrentPlayerIndex(ind)
    setLastSpinResult("---");
    setWheelMessage("");
  }//func
  
  // only difference between calling a round move in the component is the code
  const requestRoundMove = (code) => {
    roundMover(code, round, setRound, setLastSpinResult, setPlayers, setWheelMessage, setGuessed);
  }//const

  // escape freezing when all players are bankrupt
  useEffect(() => {
    const allBankrupt = players[0].bankrupt && players[1].bankrupt && players[2].bankrupt;
    if(allBankrupt) requestRoundMove("ROUND_ENDED");
  }, [players]);

  // ------------------ the render ------------------

  return ( (puzzles.length === 0) ? <>
      {loading ? <>
        <h1>Please Wait</h1>
        <p>Loading puzzles...</p>
      </> : <>
        <h1>Oh no!</h1>
        <p>It looks like the puzzles couldn't load in. 
           Please refresh the page and try again.
        </p>
      </>}
    </>: 
    <>
      <div>Aidan, Tanna, Emma and Tarik's Wheel of Fortune</div>
      
      <div id="row_board" className="box">
        <Board puzzleFragment={puzzleFragment} category={puzzles[puzzlePicked].category} />
      </div>
      
      <div id="row_guessed" className="box">
        <GuessedLetters guessed={guessed}/>
      </div>
      
      <div id="row_wheel" className="box">
        <Wheel round={round} setWinner={setLastSpinResult}/>
      </div>

      <Keyboard
          guessedLetters={guessed}
          setLetterToBuy={setLetterToBuy}
        />

      {/* Player Management */}
      <Player
        players={players}
        currentPlayerIndex={currentPlayerIndex}
      />

      <button onClick={nextPlayer} style={{ marginRight: "0.5rem" }}>
        Next Player
      </button>

      {/* Round debug */}
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Last Spin Result:</strong> {lastSpinResult}
      </div>
      <br />
      <br />

      <button onClick={() => requestRoundMove("ROUND_ENDED")} style={{ marginRight: "0.5rem" }}>
        End Round (Total Bank)
      </button>
      <br />
      <br />

      <button onClick={() => requestRoundMove("ROUND_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Round
      </button>
      <button onClick={() => requestRoundMove("TOTAL_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Totals
      </button>
      <br />
      <br />

      <div style={{ marginTop: "0.75rem" }}>{wheelMessage}</div>
    </>
  );
}

export default App;
