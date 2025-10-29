// import styles
import "./App.css";

// import components
import Player from "./components/players/Player";
import Board from "./components/board/Board";
import Wheel from "./components/wheel/Wheel";
import GuessedLetters from "./components/guessedletters/GuessedLetters";
import Keyboard from "./components/keyboard/Keyboard";
import ModalComponent from "./components/modalcomponent/ModalComponent";

// import React hooks
import { useEffect, useState, useRef } from "react";

// import functions
import { getPuzzles } from "./services/getPuzzles";
import { roundMover } from "./services/roundMover";
import { handleSpinResult } from "./services/handleSpinResult";
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
  const preguessed = [",", ".", "?", "!", "&", "-", "'", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [guessed, setGuessed] = useState(preguessed);

  // player data hooks
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 2, name: "Player 2", roundBank: 0, totalBank: 0, bankrupt: false },
    { id: 3, name: "Player 3", roundBank: 0, totalBank: 0, bankrupt: false },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const allBankrupt = useRef(false);

  // wheel data hooks
  const [lastSpinResult, setLastSpinResult] = useState("---");
  const [wheelMessage, setWheelMessage] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [moneyToWin, setMoneyToWin] = useState(0);

  // round data hooks
  const [round, setRound] = useState(1);
  
  // letter data hooks
  const vowels = ["A", "E", "I", "O", "U"];
  const [letterToBuy, setLetterToBuy] = useState("");

  // final winner modal data hooks
  const [showFinalWinnerModal, setShowFinalWinnerModal] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState([]);

  // modal data hooks
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(0);

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

  // pick a new puzzle whenever a new round starts
  useEffect(() => {
    if (puzzles.length > 0 && round > 0) {
      // pick a random puzzle
      setPuzzlePicked(Math.floor(Math.random() * puzzles.length));

      // reset guessed letters for the new puzzle
      setGuessed(preguessed);
    }//if
  }, [round, puzzles]);

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
    }//if

    if(toAddLetter){
      // update the guessed letters 
      const newGuessed = [...guessed, letter.toUpperCase()];
      setGuessed(newGuessed);

      const currentPuzzle = puzzles[puzzlePicked].puzzle.toUpperCase();
      if(!currentPuzzle.includes(letter.toUpperCase())){
        alert(`${letter} is incorrect! Moving to next player.`);
        nextPlayer();
      } else {
        // track number of times letter appears in puzzle 
        let count = 0;
        for(const p of puzzles[puzzlePicked].puzzle){
          if(letter === p) count++;
        }//for

        const wonAmount = moneyToWin * count;
        setWheelMessage(`${players[currentPlayerIndex].name} has won $${wonAmount}! (Added to Round Bank)`);

        // add consonant money to player's round money
        let updatedPlayers = players.map((p, i) => {
          if(i === currentPlayerIndex){
            return { ...p, roundBank: p.roundBank + (wonAmount) };
          } else {
            return { ...p};
          }//if-else
        });

        setPlayers(updatedPlayers);

        // Check if all letters are revealed
        const revealed = currentPuzzle
          .split("")
          .filter(ch => /[A-Z]/.test(ch))
          .every(ch => newGuessed.includes(ch));

        // move to next round, bank all round money
        if(revealed){
          alert(`All letters revealed! ${players[currentPlayerIndex].name} wins the round!`);

          updatedPlayers = players.map((p, i) => {
            if(i === currentPlayerIndex){
              return { ...p, totalBank: p.totalBank + p.roundBank, roundBank: 0 };
            } else {
              return { ...p, roundBank: 0 };
            }//if-else
          });

          setPlayers(updatedPlayers);
          requestRoundMove("ROUND_ENDED");
        }//if
      }//if-else

      // regardless of whether the guess was correct, we need to spin the wheel again afterwards  
      setHasSpun(false);
    }//if
  };

  // ---------------- full clue logic ---------------

  const onClueGuess = (guess) => {
    const currentPuzzle = puzzles[puzzlePicked].puzzle.toUpperCase().trim();
    if(guess.toUpperCase().trim() === currentPuzzle){
      alert(`Correct! ${players[currentPlayerIndex].name} wins the round!`);
      
      const updatedPlayers = players.map((p, i) => {
        if(i === currentPlayerIndex){
          return { ...p, totalBank: p.totalBank + p.roundBank, roundBank: 0 };
        } else {
          return { ...p, roundBank: 0 };
        }//if-else
      });

      setPlayers(updatedPlayers);
      requestRoundMove("ROUND_ENDED");
    } else {
      alert(`Incorrect! ${players[currentPlayerIndex].name}'s turn is over.`);
      nextPlayer();
    }//if-else
  };


  // ------------------ wheel logic ------------------

  const hasRun = useRef(false);
  useEffect(() => {
    // prevent skipping on startup
    if(lastSpinResult === "---") return;

    // determine whether to skip player while handling spin result 
    const toSkip = handleSpinResult(players, setPlayers, currentPlayerIndex, lastSpinResult, setWheelMessage, setMoneyToWin);

    if(toSkip) nextPlayer();
  }, [lastSpinResult]);

  // ------------------ round and turn logic ------------------

  const nextPlayer = () => {
    //get index of the next player
    let ind = (currentPlayerIndex < 2 ? currentPlayerIndex + 1 : 0);

    //skip any bankrupt players
    while(players[ind].bankrupt && !allBankrupt.current){
      ind = (ind < 2 ? ind + 1 : 0);
    }//while

    setCurrentPlayerIndex(ind);
    setHasSpun(false);
    setLastSpinResult("---");
    setWheelMessage("");
  }//func

  // only difference in how a round is moved in this component is the code string
  const requestRoundMove = (code) => {
    roundMover(code, round, setRound, setPlayers, setWheelMessage);
    
    setLastSpinResult("---");
    setGuessed(preguessed);
  }//const

  // escape freezing when all players are bankrupt
  useEffect(() => {
    allBankrupt.current = players[0].bankrupt && players[1].bankrupt && players[2].bankrupt;
    if(allBankrupt.current) requestRoundMove("ROUND_ENDED");
  }, [players]);

  // code to display the winners  
  const showFinalResults = () => {
    // sort players by totalBank descending
    const sorted = [...players].sort((a, b) => b.totalBank - a.totalBank);
    setSortedPlayers(sorted);
    setShowFinalWinnerModal(true);
  };

  // show final results after round 3 ends
  useEffect(() => {
    if (round > 3) {
      showFinalResults();
    }//if
  }, [round]);

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
      <div>Aidan, Tannah, Emma and Tarik's Wheel of Fortune</div>
      
      <h2>Round {round}</h2>
      <div id="row_board" className="box">
        <Board puzzleFragment={puzzleFragment} category={puzzles[puzzlePicked].category} />
      </div>
      
      <div id="row_guessed" className="box">
        <GuessedLetters guessed={guessed} preguessed={preguessed}/>
      </div>
      
      <div id="row_wheel" className="box">
        <Wheel round={round} setWinner={setLastSpinResult} hasSpun={hasSpun} setHasSpun={setHasSpun}/>
        <div style={{ marginTop: "0.75rem" }}>{wheelMessage}</div>
      </div>

      <Keyboard
          guessedLetters={guessed}
          setLetterToBuy={setLetterToBuy}
          hasSpun={hasSpun}
        />

      {/* Player Management */}
      <Player
        players={players}
        currentPlayerIndex={currentPlayerIndex}
      />

      {/* Solve Full Puzzle */}
      <div style={{ marginBottom: "0.5rem", marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Guess the Clue"
          id="clueInput"
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={() => {
          const guess = document.getElementById("clueInput").value;
          onClueGuess(guess);
          document.getElementById("clueInput").value = "";
        }}>
          Solve Puzzle
        </button>
      </div>


      {/* Round debug */}
      <h3>DEBUGGING BUTTONS</h3>
      <p>Manually move to next player</p>
      <button onClick={nextPlayer} style={{ marginRight: "0.5rem" }}>
        Next Player
      </button>
      <br />
      <br />

      <p>End Round (Add unbanked money to Total Bank, reset unbanked money to 0, and move to next round)</p>
      <button onClick={() => requestRoundMove("ROUND_ENDED")} style={{ marginRight: "0.5rem" }}>
        End Round
      </button>
      <br />
      <br />
      
      <p>Reset Round (Reset unbanked money to 0, does not move to next round)</p>
      <button onClick={() => requestRoundMove("ROUND_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Round
      </button>
      <br />
      <br />
      
      <p>Reset Game (Resets unbanked AND banked money to 0, reset to round 1)</p>
      <button onClick={() => requestRoundMove("TOTAL_RESET")} style={{ marginRight: "0.5rem" }}>
        Reset Game
      </button>
      <br />
      <br />

      {/* Modal to display winners for the base game */}
      {showFinalWinnerModal ?
        <ModalComponent>
          <h2>🏆 Game Over! </h2>
            <p>1st Place: {sortedPlayers[0]?.name} (${sortedPlayers[0]?.totalBank})</p>
            <p>2nd Place: {sortedPlayers[1]?.name} (${sortedPlayers[1]?.totalBank})</p>
            <p>3rd Place: {sortedPlayers[2]?.name} (${sortedPlayers[2]?.totalBank})</p>

            {/* Bonus Round Button */}
            <button disabled style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "not-allowed" }}>
              1st Place Proceed to Bonus Round
            </button>

            {/* Close Button */}
            <button 
              onClick={() => {
                //hide the modal
                setShowFinalWinnerModal(false);
                
                //start new game with the same players
                requestRoundMove("TOTAL_RESET");
              }} 
              className="modalcomponent-button"
            >
              Start a new game
            </button>
        </ModalComponent>
      : <></> }

    </>
  );
}

export default App;