const BoardFakeRow = () => {
  // width of rows is 12-14-14-12
  // for rows 1 and 4, all squares are blank
  // this is either row 1 or 4

  return (
    <>
      <div className="board-grid-row">
            <div className="board-box-hidden"></div>
            <div className="board-box" key="0"></div>
            <div className="board-box"></div>
            <div className="board-box"></div>

            <div className="board-box"></div>
            <div className="board-box"></div>
            <div className="board-box"></div>

            <div className="board-box"></div>
            <div className="board-box"></div>
            <div className="board-box"></div>

            <div className="board-box"></div>
            <div className="board-box"></div>
            <div className="board-box"></div>

            <div className="board-box-hidden"></div>
        </div>
    </>
  );
}

export default BoardFakeRow;