import "./App.css";
import { Player } from "./components/players/Player";
import { Wheel } from "./components/wheel/Wheel";
import { Board } from "./components/board/Board";
function App() {
  return (
    <>
      <div>Aidan, Tanna, Emma and Tarik's Wheel of Fortune</div>
      <Board />
      <Wheel />
      <Player />
    </>
  );
}

export default App;
