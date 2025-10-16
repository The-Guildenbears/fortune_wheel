//import styles
import "./App.css";

//import components
import PlayerCard from "./components/players/PlayerCard";
import Board from "./components/board/Board";
import { Wheel } from "./components/wheel/Wheel";

//import React hooks
import { useEffect, useState, useRef } from "react";

//import functions
import { getPuzzles } from "./services/getPuzzles";

//The component
const App = () => {
  // Startup data hooks
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetching = useRef(true);

  // In-game data hooks
  const [round, setRound] = useState(1);
  const [turn, setTurn] = useState(1);
  const [puzzlePicked, setPuzzlePicked] = useState(0);
  const [puzzleFragment, setPuzzleFragment] = useState("");

  // other game data
  const guessed = new Set();
  let wedges = [];

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
  useEffect(() => {
    if(puzzles.length > 0){
      let str = puzzles[puzzlePicked].puzzle;
      let res = "";
      for(let ch of str){
        if(ch === " "){
          res += ch;
        }else{
           if(guessed.has(ch)){
              res += ch;
            }else {
              res += "*";
            }//if-else
        }//if-else
      }//for

      setPuzzleFragment(res);
    }//if
  }, [guessed]);//useEffect

  return ( (loading || puzzles.length === 0) ? <>
      <h1>Please Wait</h1>
      <p>Loading puzzles...</p>
    </>: 
    <>
      <div>Aidan, Tanna, Emma and Tarik's Wheel of Fortune</div>
      
      <div id="row_board" className="box">
        <Board puzzle={puzzleFragment} category={puzzles[puzzlePicked].category} />
      </div>

      <div id="row_wheel" className="box">
        <Wheel />
      </div>

      <div id="row_players" className="box">
        <PlayerCard/>
        <PlayerCard/>
        <PlayerCard/>
      </div>
    </>
  );
}

export default App;
