export const roundMover = (code, round, setRound, setPlayers, setMessage) => {
    // keep track of all values used to update the round
    let message = "Message goes here";
    let isRoundEnded = false;
    let isTotalReset = false;
    let toSetRound = round;

    // by default, just reset the round because it's the simplest
    switch(code){
      case "ROUND_ENDED":
        isRoundEnded = true;
        message = "Round ended; unbanked money added to player banks.";
        toSetRound = round + 1;
        break;
      case "TOTAL_RESET":
        isTotalReset = true;
        message = "New Game: All totals reset."
        toSetRound = 1;
        break;
      case "ROUND_RESET":
      default:
        message = "Round reset; unbanked money cleared.";
        break;
    }//switch

    // update players, message, and the round number
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        totalBank: isTotalReset ? 0 : (p.totalBank + (isRoundEnded ? p.roundBank : 0)),
        roundBank: 500,
        bankrupt: false,
      }))
    );
    setMessage(message);
    setRound(toSetRound);
  }//func