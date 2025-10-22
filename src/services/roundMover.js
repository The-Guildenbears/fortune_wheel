export const roundMover = (code, round, setRound, setLastSpinResult, setPlayers, setMessage, setGuessed) => {
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
        toSetRound = 0;
        break;
      case "ROUND_RESET":
      default:
        message = "Round reset; unbanked money cleared.";
        break;
    }//switch

    // update players, message, spin result, and the round number
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        totalBank: isTotalReset ? 0 : (p.totalBank + (isRoundEnded ? p.roundBank : 0)),
        roundBank: 0,
        bankrupt: false,
      }))
    );
    setMessage(message);
    setLastSpinResult("---");
    setRound(toSetRound);
    setGuessed([]);
  }//func