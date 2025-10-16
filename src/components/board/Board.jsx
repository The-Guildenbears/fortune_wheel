import { useEffect } from "react";
import BoardFakeRow from "./BoardFakeRow";

const Board = ({puzzle, category}) => {
  // width of rows is 12-14-14-12
  // for rows 1 and 4, all squares are blank
  // for rows 2 and 3, the first and last squares are always blank

  //make the interactable rows with a loop
  //the keys determine which squares are white or green
  let autoRows = [];
  for(let i = 0; i < 2; i++){
    let row = [];

    for(let j = 0; j < 12; j++){
      const index = i * 12 + j;
      row.push(<div className="board-box" key={index} id={"board_square_"+index}></div>);
    }//for

    autoRows.push(row);
  }//for

  useEffect(() => {
    //reset all squares
    for(let i = 0; i < 24; i++){
      const square = document.getElementById("board_square_"+i);
      if(square){
        square.style.backgroundColor = "green";
        square.innerHTML = "";
      }
    }

    //flag the squares without spaces
    for(let i = 0; i < puzzle.length; i++){
      if(puzzle[i] !== " "){
        const square = document.getElementById("board_square_"+i);

        if(square){
          square.style.backgroundColor = "#FFFFFF";
          square.innerHTML = (puzzle[i] === "*") ? " " : puzzle[i];
        }//if
      }//if
    }//for
  }, [puzzle]); // Re-run when puzzle changes
  
  return (
    <>
      <div>
        <h1>THE BOARD</h1>
        <div id="board-grid">
          <BoardFakeRow/>

          <div className="board-grid-row">
            <div className="board-box"></div>

            {autoRows[0]}

            <div className="board-box"></div>
          </div>

          <div className="board-grid-row">
            <div className="board-box"></div>

            {autoRows[1]}

            <div className="board-box"></div>
          </div>

          <BoardFakeRow/>
        </div>
        <div id="board_div_category">{category}</div>
      </div>
    </>
  );
}

export default Board;