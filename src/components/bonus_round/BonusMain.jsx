import { useEffect, useState } from "react";
import Board from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import Clock from "./Clock";

const PUNCT_OR_DIGIT = [
  ",",
  ".",
  "?",
  "!",
  "&",
  "-",
  "'",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
const VOWELS = ["A", "E", "I", "O", "U"];
const GIVEN = ["R", "S", "T", "L", "N", "E"]; // auto-revealed in bonus

export default function BonusMain({
  puzzleText = "HELLO WORLD",
  category = "BONUS",
}) {
  // Normalize puzzle to uppercase
  const [PUZZLE, setPUZZLE] = useState(
    (puzzleText || "Hello world").toUpperCase()
  );

  const [loading, setLoading] = useState(true);
  // Already-visible letters for Bonus: punctuation/digits + RSTLNE
  const [preguessed] = useState([...PUNCT_OR_DIGIT, ...GIVEN]);
  const [guessed, setGuessed] = useState(preguessed);

  // Pending picks (not revealed until "Reveal Picks")
  const [pickedConsonants, setPickedConsonants] = useState([]);
  const [pickedVowel, setPickedVowel] = useState("");

  const [letterToBuy, setLetterToBuy] = useState("");
  const hasSpun = true; // always allow consonants in bonus

  // Board fragment
  const [puzzleFragment, setPuzzleFragment] = useState("");

  useEffect(() => {
    let res = "";
    for (const ch of PUZZLE) {
      if (ch === " ") {
        res += " ";
      } else if (guessed.includes(ch)) {
        res += ch;
      } else {
        res += "*";
      }
    }
    setPuzzleFragment(res);
    setLoading(false);
  }, [PUZZLE, guessed]);

  // useEffect(() => {
  //   alert(`Puzzle frag: ${puzzleFragment}`);
  // }, [puzzleFragment]);

  // Handle selections coming from Keyboard
  useEffect(() => {
    if (!letterToBuy) return;
    const L = letterToBuy.toUpperCase();

    // ignore if already revealed or already picked
    const alreadyRevealed = guessed.includes(L) || preguessed.includes(L);
    const alreadyPicked = pickedConsonants.includes(L) || pickedVowel === L;

    if (!alreadyRevealed && !alreadyPicked && /^[A-Z]$/.test(L)) {
      if (VOWELS.includes(L)) {
        // allow exactly 1 vowel
        if (!pickedVowel) setPickedVowel(L);
      } else {
        // consonant: allow up to 3, ignore RSTLNE (already given)
        if (!GIVEN.includes(L) && pickedConsonants.length < 3) {
          setPickedConsonants((prev) => [...prev, L]);
        }
      }
    }

    // reset input trigger
    setLetterToBuy("");
  }, [letterToBuy, guessed, pickedConsonants, pickedVowel, preguessed]);

  const canReveal = pickedConsonants.length === 3 && pickedVowel !== "";

  const onReveal = () => {
    if (!canReveal) return;
    setGuessed((g) => [...g, ...pickedConsonants, pickedVowel]);
  };

  const onClear = () => {
    setPickedConsonants([]);
    setPickedVowel("");
  };

  const onStartOver = () => {
    setPickedConsonants([]);
    setPickedVowel("");
    setGuessed(preguessed);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Loading…
        </div>
      ) : (
        <>
          <h2 className="play-bold" style={{ marginBottom: "0.5rem" }}>
            Bonus Round
          </h2>
          <p className="play-regular" style={{ marginBottom: "1rem" }}>
            Given letters: <strong>R, S, T, L, N, E</strong>. Pick exactly{" "}
            <strong>3 consonants</strong> and <strong>1 vowel</strong>, then
            click “Reveal Picks”.
          </p>

          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <Board
              puzzleFragment={puzzleFragment}
              category={category}
              idPrefix="bonus"
            />
            <Clock />
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <strong>Chosen consonants (3):</strong>{" "}
              {pickedConsonants.length ? pickedConsonants.join(", ") : "—"}
            </div>
            <div>
              <strong>Chosen vowel (1):</strong> {pickedVowel || "—"}
            </div>
            <button
              onClick={onClear}
              disabled={!pickedConsonants.length && !pickedVowel}
            >
              Clear Picks
            </button>
            <button onClick={onStartOver}>Start Over</button>
          </div>

          <Keyboard
            guessedLetters={guessed}
            setLetterToBuy={setLetterToBuy}
            hasSpun={hasSpun}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button onClick={onReveal} disabled={!canReveal}>
              Reveal Picks
            </button>
            {!canReveal ? (
              <span style={{ fontSize: 14, color: "#666" }}>
                Need {3 - pickedConsonants.length} consonant(s) and{" "}
                {pickedVowel ? 0 : 1} vowel.
              </span>
            ) : (
              <span style={{ fontSize: 14, color: "#2e7d32" }}>
                Ready to reveal.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
