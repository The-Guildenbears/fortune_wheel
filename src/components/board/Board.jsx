import { useEffect } from "react";
import BoardFakeRow from "./BoardFakeRow";

const Board = ({puzzleFragment, category}) => {
  //parameters:
  // "puzzleFragment" and "category" are both strings

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
        square.style.backgroundColor = "mediumseagreen";
        square.innerHTML = "";
      }
    }

    //flag the squares without spaces
    for(let i = 0; i < puzzleFragment.length; i++){
      if(puzzleFragment[i] !== " "){
        const square = document.getElementById("board_square_"+i);

        if(square){
          square.style.backgroundColor = "#FFFFFF";
          square.innerHTML = (puzzleFragment[i] === "*") ? " " : puzzleFragment[i];
        }//if
      }//if
    }//for
  }, [puzzleFragment]); // Re-run when puzzleFragment changes
  
  return (
    <>
      <div>
        <div id="board_grid">
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