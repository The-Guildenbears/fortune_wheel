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
  const consonants = [
    ["Q", "W", "R", "T", "Y", "P"],
    ["S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  const vowels = ["A", "E", "I", "O", "U"];
  const [showVowels, setShowVowels] = useState(false);

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

  // ------------------ vowel buying logic ------------------

  const handleBuyClick = () => {
    setShowVowels(players[currentPlayerIndex].roundBank >= 500);
  };

  const buyVowel = (vowel) => {
    if (players[currentPlayerIndex].roundBank < 500) {
      alert(`${players[currentPlayerIndex].name} does not have enough money to buy a vowel!`);
      return;
    }//if

    const confirmed = window.confirm(
      `${players[currentPlayerIndex].name} wants to buy vowel ${vowel} for $500?`
    );
    if (!confirmed) return;

    if(guessed.includes(vowel)){
      //This shouldn't show up but just in case
      alert("This vowel has already been guessed!\nFortunately, your money will not be spent.");
    }else{
      // Subtract $500 from the current player's round bank
      const updatedPlayers = players.map((p, i) =>
        i === currentPlayerIndex ? { ...p, roundBank: p.roundBank - 500 } : p
      );
      setPlayers(updatedPlayers);

      setGuessed([...guessed, vowel]);
    }//if-else

    setShowVowels(false);
  };

  // ------------------ wheel logic ------------------

  useEffect(() => {
    const toSkip = handleSpinResult(players, setPlayers, currentPlayerIndex, lastSpinResult, setWheelMessage);
    if(toSkip) nextPlayer();
  }, [lastSpinResult])

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
    roundMover(code, round, setRound, setLastSpinResult, setPlayers, setWheelMessage);
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

      {/* Buy a Vowel Section */}
      <div style={{ marginTop: "20px" }}>
        {!showVowels && (
          <button
            onClick={handleBuyClick}
            disabled={players[currentPlayerIndex].roundBank < 500}
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
                  guessed.includes(v) || players[currentPlayerIndex].roundBank < 500
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
  );
}

export default App;
