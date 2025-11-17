import { useEffect } from "react";

const Board = ({ puzzleFragment, category, idPrefix = "" }) => {
  // parameters:
  // "puzzleFragment" and "category" are both strings

  //make the interactable rows with a loop
  //the keys determine which squares are white or green

  //make rows for the cells of the board
  let autoRows = [];
  for (let i = 0; i < 4; i++) {
    let row = [];

    for (let j = 0; j < 12; j++) {
      const index = i * 12 + j;
      row.push(
        <div
          className="board-box"
          key={index}
          id={`${idPrefix}board_square_${index}`}
        ></div>
      );
    } //for

    autoRows.push(row);
  } //for

  useEffect(() => {
    //reset all squares
    for (let i = 0; i < 48; i++) {
      const square = document.getElementById(idPrefix + "board_square_" + i);
      if (square) {
        square.style.backgroundColor = "mediumseagreen";
        square.innerHTML = "";
      } //if
    } //for

    //get individual words from fragment
    const words = puzzleFragment.split(" ");
    let position = puzzleFragment.length < 24 ? 12 : 0;

    for (let word of words) {
      //in case a puzzle has a typo
      if (word.length === 0) continue;

      //determine the current row and the word's position in it
      const currentRow = Math.floor(position / 12);
      const positionInRow = position % 12;

      //if it doesn't fit in the current row, start at the next one
      if (positionInRow + word.length > 12 && positionInRow > 0) {
        position = (currentRow + 1) * 12;
      } //if

      // Place the word
      for (let i = 0; i < word.length; i++) {
        //in case of too much row skipping
        if (position >= 48) break;

        //otherwise fill in square by square
        const square = document.getElementById(
          idPrefix + "board_square_" + position
        );
        if (square) {
          square.style.backgroundColor = "#FFFFFF";
          square.innerHTML = word[i] === "*" ? " " : word[i];
        } //if
        position++;
      } //for

      //add a space
      position++;
    } //for
  }, [puzzleFragment]);

  return (
    <>
      <div>
        <div id="board_grid">
          <div className="board-grid-row">
            <div className="board-box-hidden"></div>

            {autoRows[0]}

            <div className="board-box-hidden"></div>
          </div>

          <div className="board-grid-row">
            <div className="board-box"></div>

            {autoRows[1]}

            <div className="board-box"></div>
          </div>

          <div className="board-grid-row">
            <div className="board-box"></div>

            {autoRows[2]}

            <div className="board-box"></div>
          </div>

          <div className="board-grid-row">
            <div className="board-box-hidden"></div>

            {autoRows[3]}

            <div className="board-box-hidden"></div>
          </div>
        </div>
        <div id="board_div_category">{category}</div>
      </div>
    </>
  );
};

export default Board;
