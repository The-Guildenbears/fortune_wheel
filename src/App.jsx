// import styles
import "./App.css";

// import React hooks
import { useEffect, useState, useRef } from "react";

// import components
import Player from "./components/players/Player";
import Board from "./components/board/Board";
import GuessedLetters from "./components/guessedletters/GuessedLetters";
import FinalWinnerModal from "./components/finalwinnermodal/FinalWinnerModal";
import BonusModal from "./components/bonusmodal/BonusModal";
import ModalComponent from "./components/modalcomponent/ModalComponent";
import KeyboardMaker from "./components/keyboard/KeyboardMaker";
import WheelModal from "./components/wheelmodal/WheelModal";

// import functions
import { getPuzzles } from "./services/getPuzzles";
import { roundMover } from "./services/roundMover";
import { handleSpinResult } from "./services/handleSpinResult";
import { buyVowel } from "./services/buyVowel";
import { updatePlayerByIndex } from "./services/updatePlayerByIndex";

// the component
const App = () => {
  // --------- data hooks ---------

  // startup data hooks
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetching = useRef(true);

  // puzzle data hooks
  const [puzzlePicked, setPuzzlePicked] = useState(0);
  const [puzzleFragment, setPuzzleFragment] = useState("");

  // data hooks for guessed letters
  const preguessed = [ ",", ".", "?", "!", "&", "-", "'", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
  const [guessed, setGuessed] = useState(preguessed);

  // player data hooks
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", roundBank: 500, totalBank: 0, bankrupt: false },
    { id: 2, name: "Player 2", roundBank: 500, totalBank: 0, bankrupt: false },
    { id: 3, name: "Player 3", roundBank: 500, totalBank: 0, bankrupt: false },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // wheel data hooks
  const [lastSpinResult, setLastSpinResult] = useState("---");
  const [wheelMessage, setWheelMessage] = useState("");
  const [hasSpun, setHasSpun] = useState(false);
  const [moneyToWin, setMoneyToWin] = useState(0);

  // round data hooks
  const [round, setRound] = useState(1);
  const bonusRoundNumber = 6;
  const bonusCategories = ["phrase", "thing", "living-thing|living-things", "person|people", "event", "food-and-drink", "fun-and-games", "around-the-house", "same-letter|same-name", "what-are-you-doing|what-are-you-wearing", "before-and-after", "character|fictional-character", "on-the-map"].sort();
  const playingBonus = useRef(false);

  // letter data hooks
  const vowels = ["A", "E", "I", "O", "U"];
  const [letterToBuy, setLetterToBuy] = useState("");

  // modal data hooks
  const [showFinalWinnerModal, setShowFinalWinnerModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);

  // prompt data hooks
  const [promptMode, setPromptMode] = useState("");

  // ------------------ puzzle logic ------------------

  const loadPuzzles = async (cat = "") => {
    try {
      // attempt to get a list of puzzles
      const data = await getPuzzles(cat);
      // uncomment line below for debugging purposes
      //console.log(data);

      // add to list of puzzles to choose from
      setPuzzles(data);
    } catch (error) {
      // something went wrong
      console.error("Failed to load puzzles:", error);
    } finally {
      // finish loading anyways
      setLoading(false);
    }//try-catch-finally
  };

  // get the puzzles only once
  useEffect(() => {
    // skip if data already fetched; otherwise flag fetching
    if (!fetching.current) return;
    fetching.current = false;

    loadPuzzles();
  }, []); //useEffect

  // pick a new puzzle whenever a new round starts
  useEffect(() => {
    if (puzzles.length > 0 && round > 0) {
      // pick a new puzzle
      // check whether it's the bonus round
      setPuzzlePicked((round !== bonusRoundNumber) ? round : 0);

      // reset guessed letters for the new puzzle
      setGuessed(preguessed);

      // lock consonants
      setHasSpun(false);
    } //if
  }, [round, puzzles]);

  // set up puzzle fragment to pass along to board
  useEffect(() => {
    // check if puzzles exist
    if (puzzles.length > 0) {
      // get copy of puzzle string
      let str = puzzles[puzzlePicked].puzzle;

      // build the fragmentary string to pass to the board
      let res = "";
      for (let ch of str) {
        if (ch === " ") {
          // spaces are not treated as part of the answer
          res += ch;
        } else {
          // check guessed letters array
          if (guessed.includes(ch)) {
            res += ch;
          } else {
            // asterisks are treated as empty spaces in the puzzle fragment by the board
            res += "*";
          } //if-else
        } //if-else
      } //for

      setPuzzleFragment(res);
    } //if
  }, [guessed, puzzles, puzzlePicked]); //useEffect

  // ------------------ letter buying logic ------------------

  useEffect(() => {
    // don't run picking code when value is blank ("");
    if (letterToBuy.length === 1) {
      onLetterPicked(letterToBuy);
    } //if
  }, [letterToBuy]);

  const onLetterPicked = (letter) => {
    // assume the letter can be bought by default
    let toAddLetter = true;

    // check for a vowel and run vowel-buying code to update flag
    if (vowels.includes(letter)) toAddLetter = buyVowel(letter, players, setPlayers, currentPlayerIndex, guessed);

    // assuming the letter can be bought
    if (toAddLetter) {
      // update the guessed letters
      const newGuessed = [...guessed, letter.toUpperCase()];
      setGuessed(newGuessed);

      // get current puzzle and check if letter is in the string
      const puzzleAllCaps = puzzles[puzzlePicked].puzzle.toUpperCase();
      if (!puzzleAllCaps.includes(letter.toUpperCase())) {
        // alert incorrectness and move to next player
        alert(`${letter} is incorrect!${playingBonus.current ? "" : " Moving to next player."}`);
        nextPlayer();
      } else {
        // earn money from guessing a consonant correctly
        if(!vowels.includes(letter)){
          // track number of times letter appears in puzzle
          let count = 0;
          for (const p of puzzles[puzzlePicked].puzzle) {
            if (letter === p) count++;
          }// for

          // calculate money won from guess; add it to player's round bank
          updatePlayerByIndex(
            currentPlayerIndex,
            setPlayers,
            (p) => ({ ...p, roundBank: p.roundBank + (moneyToWin * count) }),
            false
          );

          // declare the guess correct
          setWheelMessage(`${players[currentPlayerIndex].name} has won $${(moneyToWin * count)}! (Added to Round Bank)`);
        }//if
        
        // check if every letter got revealed
        checkForAllRevealed(letter);
      } //if-else

      // regardless of whether the guess was correct, we need to spin the wheel again afterwards
      setHasSpun(false);
      setPromptMode("PROMPT_CHOICES");
    } //if
  };

  const checkForAllRevealed = (letter) => {
    // check if all letters are revealed using a regex
    const revealed = puzzles[puzzlePicked].puzzle.toUpperCase()
      .split("")
      .filter((ch) => /[A-Z]/.test(ch))
      .every((ch) => [...guessed, letter.toUpperCase()].includes(ch));

    // move to next round, bank all round money
    if(revealed){
      alert(
        `All letters revealed! ${players[currentPlayerIndex].name} wins the round!`
      );

      // bank winner's money, reset round money for everyone
      updatePlayerByIndex(
        currentPlayerIndex,
        setPlayers,
        (p) => ({
          ...p,
          totalBank: p.totalBank + p.roundBank,
          roundBank: 0,
        }),
        true
      );

      // move to next round
      requestRoundMove("ROUND_ENDED");
    } //if
  }//const

  // ---------------- full clue logic ---------------

  const onClueGuess = (guess) => {
    // puzzle string to compare guess to
    const puzzleAllCaps = puzzles[puzzlePicked].puzzle.toUpperCase().trim();
    const guessAllCaps = guess.toUpperCase().trim();

    if (guessAllCaps === puzzleAllCaps) {
      // declare winner of the round
      alert(`Correct! ${players[currentPlayerIndex].name} wins the round!`);

      // bank winner's money, reset round money for everyone
      updatePlayerByIndex(
        currentPlayerIndex,
        setPlayers,
        (p) => ({ ...p, totalBank: p.totalBank + p.roundBank, roundBank: 500 }),
        true
      );

      // move to next round
      requestRoundMove("ROUND_ENDED");
    } else {
      // alert for incorrect answer, move to next player
      alert(`Incorrect! ${playingBonus.current ? "" : players[currentPlayerIndex].name+"'s turn is over."}`);
      nextPlayer();
    } //if-else
  };

  // ------------------ wheel logic ------------------

  useEffect(() => {
    // prevent skipping on startup
    if (lastSpinResult === "---") return;

    // determine whether to skip player while also handling spin result
    const toSkip = handleSpinResult(
      players,
      setPlayers,
      currentPlayerIndex,
      lastSpinResult,
      setWheelMessage,
      setMoneyToWin
    );

    // skip player as necessary
    if (toSkip) nextPlayer();
  }, [lastSpinResult]);

  // ------------------ round and turn logic ------------------

  const clearEverything = (goingToNewRound) => {
    // clear spin result, spin message and reset guessed array to default
    setLastSpinResult("---");
    setWheelMessage("");
    setHasSpun(false);
    setPromptMode("PROMPT_CHOICES");

    if(goingToNewRound){
      setGuessed(preguessed);
    }//if
  }//const func

  const nextPlayer = () => {
    // get index of the next player
    let ind = currentPlayerIndex < 2 ? currentPlayerIndex + 1 : 0;

    // if player is bankrupt, revert bankruptcy
    if(players[ind].bankrupt){
      updatePlayerByIndex(
        ind,
        setPlayers,
        (p) => ({ ...p, bankrupt: false }),
        false
      );
    }//if

    setCurrentPlayerIndex(ind);
    clearEverything(false);
  }; //func

  // only difference in how a round is moved in this component is the code string
  const requestRoundMove = (code) => {
    if((code !== "TOTAL_RESET") && ((round === 5 && playingBonus.current === false) || (round === 6))){
      setShowFinalWinnerModal(true);
    }else{
      //move the round here
      roundMover(code, round, setRound, setPlayers, setWheelMessage);
      clearEverything(true);
    }//if-else
  }; //const

  // the new roundResetter()
  const gameResetter = () => {
    // get new puzzles
    setLoading(true);
    loadPuzzles();

    // disable everything
    setHasSpun(false);
    setShowBonusModal(false);
    setShowFinalWinnerModal(false);
    playingBonus.current = false;
    setPromptMode("PROMPT_CHOICES");

    // start new game with the same players
    requestRoundMove("TOTAL_RESET");
  }//const func

  // ------------------ choice prompt ------------------
  const promptSwitcher = () => {
    let fragmentToShow = <></>;

    switch(promptMode){
      case "PROMPT_CONSONANT":
        fragmentToShow = <>        
          <KeyboardMaker charOptions={"BCDFGHJKLMNPQRSTVWXYZ"} guessedLetters={guessed} setLetterToBuy={setLetterToBuy}/>
        </>;
        break;
      
      case "PROMPT_VOWEL":
        fragmentToShow = <>
          <KeyboardMaker charOptions={"AEIOU"} guessedLetters={guessed} setLetterToBuy={setLetterToBuy}/>
        </>;
        break;
      
      case "PROMPT_SOLVE":
        fragmentToShow = <>
          <input
            type="text"
            placeholder="Guess the Clue"
            id="clueInput"
            style={{ marginRight: "0.5rem" }}
          />
          <button
            onClick={() => {
              const guess = document.getElementById("clueInput").value;
              onClueGuess(guess);
              document.getElementById("clueInput").value = "";
            }}
          >
            Solve Puzzle
          </button>
        </>;
        break;

      case "PROMPT_CHOICES":
      default:
        fragmentToShow = <>
          <p>Does {players[currentPlayerIndex].name} want to...</p>
          <ul style={{listStyleType: "none", display: "flex", justifyContent: "center", gap: "1em"}}>
            <li>
              <button className="prompt-button" onClick={() => {
                setShowWheelModal(true);
                setPromptMode("PROMPT_CONSONANT");
              }}>Guess a Consonant</button>
            </li>
            <li>
              <button className="prompt-button" onClick={() => {setPromptMode("PROMPT_VOWEL")}}>Buy a Vowel</button>
            </li>
            <li>
              <button className="prompt-button" onClick={() => {setPromptMode("PROMPT_SOLVE")}}>Solve the Puzzle</button>
            </li>
          </ul>
        </>;
        break;
    }//switch

    return <>
      {promptMode !== "PROMPT_CHOICES" ? <>
        <button className="prompt-button" disabled={hasSpun} onClick={() => {setPromptMode("PROMPT_CHOICES")}}> Go Back </button>
      </> : <></>}
      <br/>
      <div className="prompt-fragment">
        {fragmentToShow}
      </div>
    </>
  }//const

  // ------------------ the render ------------------

  return (puzzles.length === 0) ? (
    <>
      {loading ? (
        <>
          <h1>Please Wait</h1>
          <p>Loading puzzles...</p>
        </>
      ) : (
        <>
          <ModalComponent>
            <h1>Oh no!</h1>
            <p>
              It looks like the puzzles couldn't load in. Please refresh the page
              and try again.
            </p>
            <button onClick={() => {
              window.location.reload();
            }}>
              Refresh the Page
            </button>
          </ModalComponent>
        </>
      )}
    </>
  ) : (
    <div className="main_container">
      <div className="main_title play-bold">
        The Guildenbear's Wheel of Fortune
      </div>

      <div id="main_gridbox">
        <div id="main_gridbox_status" className="box">
          <h3 style={{marginLeft: "0.5em"}}>Round {round}- {players[currentPlayerIndex].name}'s Turn</h3>
          <div>{wheelMessage}</div>
        </div>
        <div id="main_gridbox_board" className="box">
          <Board
              puzzleFragment={puzzleFragment}
              category={puzzles[puzzlePicked].category}
            />
        </div>
        <div id="main_gridbox_prompt" className="box">
          {promptSwitcher()}
        </div>
        <div id="main_gridbox_guessed" className="box">
          <GuessedLetters guessed={guessed} preguessed={preguessed} />
        </div>
        <div id="main_gridbox_player" className="box">
          <Player players={players} currentPlayerIndex={currentPlayerIndex} />
        </div>
      </div>

      <button onClick={() => {setShowDebugModal(true)}}>Show Debug Options</button>
    
    {/* --------- MODALS GO HERE ---------*/}

      {/* Modal to display winners for the base game */}
      {showFinalWinnerModal ? (
        <FinalWinnerModal
          players={players}
          round={round}
          bonusRoundValue={bonusRoundNumber}
          onToBonus={() => {
            setShowFinalWinnerModal(false);
            setShowBonusModal(true);
            playingBonus.current = true;
            requestRoundMove("ROUND_ENDED");
          }}
          onToReset={() => {
            setShowFinalWinnerModal(false);
            gameResetter();
          }}
        />
      ) : (
        <></>
      )}

      {/* Modal to select bonus round category */}
      {showBonusModal ? (
        <BonusModal
          bonusCategories={bonusCategories}
          loadPuzzles={loadPuzzles}
          setShowBonusModal={setShowBonusModal}
        />
      ) : (
        <></>
      )}

      {showWheelModal ? <>
          <WheelModal
            round={round}
            setLastSpinResult={setLastSpinResult}
            hasSpun={hasSpun}
            setHasSpun={setHasSpun}
            setShowWheelModal={setShowWheelModal}
          />
        </> : <></>}

      {showDebugModal ? <>
        <ModalComponent>
          {/* Round debug */}
          <div>
            <h3>DEBUGGING BUTTONS</h3>
            <p>Manually move to next available player</p>
            <button onClick={nextPlayer} style={{ marginRight: "0.5rem" }}>
              Next Player
            </button>

            <p>
              End Round (Add unbanked money to Total Bank, reset unbanked money to 0,
              and move to next round)
            </p>
            <button
              onClick={() => requestRoundMove("ROUND_ENDED")}
              style={{ marginRight: "0.5rem" }}
              disabled={round >= bonusRoundNumber ? true : false}
            >
              {round >= bonusRoundNumber ? "Cannot Skip (Final Round)" : "End Round"}
            </button>
            <p>
              Reset Round (Reset unbanked money to 0, does not move to next round)
            </p>
            <button
              onClick={() => requestRoundMove("ROUND_RESET")}
              style={{ marginRight: "0.5rem" }}
            >
              Reset Round
            </button>

            <p>
              Reset Game (Resets unbanked AND banked money to 0, reset to round 1)
            </p>
            <button
              onClick={() => gameResetter()}
              style={{ marginRight: "0.5rem" }}
            >
              Reset Game
            </button>
          </div>

          <br/>
          <button 
            className="modalcomponent-button"
            style={{ width: "10em", marginTop: "4px", marginBottom: "4px" }}
            onClick={() => {setShowDebugModal(false)}}
          >
            Close Debug Window
          </button>
        </ModalComponent>
      </> : <></>}

    {/* End of Container */}
    </div>
  );
};

export default App;