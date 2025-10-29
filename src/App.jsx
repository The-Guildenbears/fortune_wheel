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
  const [round, setRound] = useState(1);

  // letter data hooks
  const vowels = ["A", "E", "I", "O", "U"];
  const [letterToBuy, setLetterToBuy] = useState("");

  // for final winner modal
  const [showFinalWinnerModal, setShowFinalWinnerModal] = useState(false);
  const [sortedPlayers, setSortedPlayers] = useState([]);

  // ------------------ puzzle logic ------------------

  // get the puzzles only once
  useEffect(() => {
    // skip if data already fetched; otherwise flag fetching
    if (!fetching.current) return;
    fetching.current = false;

    const loadPuzzles = async () => {
      try {
        const data = await getPuzzles();
        console.log(data);
        setPuzzles(data);
      } catch (error) {
        console.error("Failed to load puzzles:", error);
      } finally {
        //Finish load anyways
        setLoading(false);
      } //try-catch-finally
    };

    loadPuzzles();
  }, []); //useEffect

  // pick a new puzzle whenever a new round starts
  useEffect(() => {
    if (puzzles.length > 0 && round > 0) {
      // pick a random puzzle
      setPuzzlePicked(Math.floor(Math.random() * puzzles.length));

      // reset guessed letters for the new puzzle
      setGuessed([]);
    }
  }, [round, puzzles]);

  // set up puzzle fragment to pass along to board
  useEffect(() => {
    if (puzzles.length > 0) {
      let str = puzzles[puzzlePicked].puzzle;
      let res = "";
      for (let ch of str) {
        if (ch === " ") {
          res += ch;
        } else {
          if (guessed.includes(ch)) {
            res += ch;
          } else {
            res += "*";
          } //if-else
        } //if-else
      } //for

      setPuzzleFragment(res);
    } //if
  }, [guessed, puzzles, puzzlePicked]); //useEffect

  // ------------------ letter buying logic ------------------

  useEffect(() => {
    if (letterToBuy.length === 1) {
      onLetterPicked(letterToBuy);
    } //if
  }, [letterToBuy]);

  const onLetterPicked = (letter) => {
    let toAddLetter = true;

    if (vowels.includes(letter)) {
      toAddLetter = buyVowel(
        letter,
        players,
        setPlayers,
        currentPlayerIndex,
        guessed
      );
    }

    if (toAddLetter) {
      const newGuessed = [...guessed, letter.toUpperCase()];
      setGuessed(newGuessed);

      const currentPuzzle = puzzles[puzzlePicked].puzzle.toUpperCase();
      if (!currentPuzzle.includes(letter.toUpperCase())) {
        alert(`${letter} is incorrect! Moving to next player.`);
        nextPlayer();
      } else {
        // Check if all letters are revealed
        const revealed = currentPuzzle
          .split("")
          .filter((ch) => /[A-Z]/.test(ch))
          .every((ch) => newGuessed.includes(ch));

        if (revealed) {
          alert(
            `All letters revealed! ${players[currentPlayerIndex].name} wins the round!`
          );

          const updatedPlayers = players.map((p, i) => {
            if (i === currentPlayerIndex) {
              return {
                ...p,
                totalBank: p.totalBank + p.roundBank,
                roundBank: 0,
              };
            } else {
              return { ...p, roundBank: 0 };
            }
          });

          setPlayers(updatedPlayers);
          requestRoundMove("ROUND_ENDED");
        }
      }
    }
  };

  // ---------------- full clue logic ---------------

  const onClueGuess = (guess) => {
    const currentPuzzle = puzzles[puzzlePicked].puzzle.toUpperCase().trim();
    if (guess.toUpperCase().trim() === currentPuzzle) {
      alert(`Correct! ${players[currentPlayerIndex].name} wins the round!`);

      const updatedPlayers = players.map((p, i) => {
        if (i === currentPlayerIndex) {
          return { ...p, totalBank: p.totalBank + p.roundBank, roundBank: 0 };
        } else {
          return { ...p, roundBank: 0 };
        }
      });

      setPlayers(updatedPlayers);
      requestRoundMove("ROUND_ENDED");
    } else {
      alert(`Incorrect! ${players[currentPlayerIndex].name}'s turn is over.`);
      nextPlayer();
    }
  };

  // ------------------ wheel logic ------------------

  const hasRun = useRef(false);
  useEffect(() => {
    const toSkip = handleSpinResult(
      players,
      setPlayers,
      currentPlayerIndex,
      lastSpinResult,
      setWheelMessage
    );

    if (!hasRun.current && toSkip) {
      nextPlayer();
      hasRun.current = true;
    } else {
      hasRun.current = false;
    }
  }, [lastSpinResult]);

  // ------------------ round and turn logic ------------------

  const nextPlayer = () => {
    let ind = currentPlayerIndex < 2 ? currentPlayerIndex + 1 : 0;

    while (players[ind].bankrupt) {
      ind = ind < 2 ? ind + 1 : 0;
    } //while

    setCurrentPlayerIndex(ind);
    setLastSpinResult("---");
    setWheelMessage("");
  }; //func

  const showFinalResults = () => {
    // sort players by totalBank descending
    const sorted = [...players].sort((a, b) => b.totalBank - a.totalBank);
    setSortedPlayers(sorted);
    setShowFinalWinnerModal(true);
  };

  // only difference between calling a round move in the component is the code
  const requestRoundMove = (code) => {
    roundMover(
      code,
      round,
      setRound,
      setLastSpinResult,
      setPlayers,
      setWheelMessage,
      setGuessed
    );
  }; //const

  // escape freezing when all players are bankrupt
  useEffect(() => {
    const allBankrupt =
      players[0].bankrupt && players[1].bankrupt && players[2].bankrupt;
    if (allBankrupt) requestRoundMove("ROUND_ENDED");
  }, [players]);

  // show final results after round 3 ends
  useEffect(() => {
    if (round === 3) {
      showFinalResults();
    }
  }, [round]);

  // ------------------ the render ------------------

  return puzzles.length === 0 ? (
    <>
      {loading ? (
        <>
          <h1>Please Wait</h1>
          <p>Loading puzzles...</p>
        </>
      ) : (
        <>
          <h1>Oh no!</h1>
          <p>
            It looks like the puzzles couldn't load in. Please refresh the page
            and try again.
          </p>
        </>
      )}
    </>
  ) : (
    <div className="main_container">
      <div className="main_title play-bold">
        The Guildenbear's Wheel of Fortune
      </div>
      <div className="play-regular">Round {round}</div>
      <div className="play-board">
        <div>
          <div id="row_board" className="box">
            <Board
              puzzleFragment={puzzleFragment}
              category={puzzles[puzzlePicked].category}
            />
          </div>

          <div id="row_guessed" className="box">
            <GuessedLetters guessed={guessed} />
          </div>
        </div>
        <div id="row_wheel" className="box">
          <Wheel round={round} setWinner={setLastSpinResult} />
        </div>
      </div>

      <Keyboard guessedLetters={guessed} setLetterToBuy={setLetterToBuy} />

      {/* Player Management */}
      <Player players={players} currentPlayerIndex={currentPlayerIndex} />

      {/* Solve Full Puzzle */}
      <div style={{ marginBottom: "0.5rem", marginTop: "1rem" }}>
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
      </div>

      <button onClick={nextPlayer} style={{ marginRight: "0.5rem" }}>
        Next Player
      </button>

      {/* Round debug */}
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Last Spin Result:</strong> {lastSpinResult}
      </div>
      <br />
      <br />

      <button
        onClick={() => requestRoundMove("ROUND_ENDED")}
        style={{ marginRight: "0.5rem" }}
      >
        End Round (Total Bank)
      </button>
      <br />
      <br />

      <button
        onClick={() => requestRoundMove("ROUND_RESET")}
        style={{ marginRight: "0.5rem" }}
      >
        Reset Round
      </button>
      <button
        onClick={() => requestRoundMove("TOTAL_RESET")}
        style={{ marginRight: "0.5rem" }}
      >
        Reset Totals
      </button>
      <br />
      <br />

      <div style={{ marginTop: "0.75rem" }}>{wheelMessage}</div>

      {showFinalWinnerModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <h2>🏆 Game Over! </h2>
            <p>
              1st Place: {sortedPlayers[2]?.name} ($
              {sortedPlayers[0]?.totalBank})
            </p>
            <p>
              2nd Place: {sortedPlayers[1]?.name} ($
              {sortedPlayers[1]?.totalBank})
            </p>
            <p>
              3rd Place: {sortedPlayers[0]?.name} ($
              {sortedPlayers[2]?.totalBank})
            </p>

            {/* Bonus Round Button */}
            <button
              disabled
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                cursor: "not-allowed",
              }}
            >
              1st Place Proceed to Bonus Round
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowFinalWinnerModal(false)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
