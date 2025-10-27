export const handleSpinResult = (players, setPlayers, currentPlayerIndex, lastSpinResult, setMessage) => {
    // keep track of all values for updating a player
    let message = "Message goes here";
    let roundMoney = players[currentPlayerIndex].roundBank;
    let toBankrupt = false;
    let toSkip = false;

    const updatePlayerByIndex = (index, updater) => {
        setPlayers((prev) => prev.map((p, i) => (i === index ? updater(p) : p)));
    }//func

    if(typeof lastSpinResult === "number"){
      // landed on a cash value
      roundMoney += lastSpinResult;
      message = `${players[currentPlayerIndex].name} has earned $${lastSpinResult}! (Added to Round Bank)`;
    }else{
      // landed on either "BANKRUPT" or "LOSE A TURN"
      if(lastSpinResult === "BANKRUPT"){
        roundMoney = 0;
        toBankrupt = true;
        message = `${players[currentPlayerIndex].name} landed on BANKRUPT and loses all their money from this round!`;
      }else{
        message = `${players[currentPlayerIndex].name} loses a turn!`;
      }//if-else

      // we're skipping either way
      toSkip = true;
    }//if-else

    // update player info as needed
    updatePlayerByIndex(currentPlayerIndex, (p) => ({ ...p, roundBank: roundMoney, bankrupt: toBankrupt}));
    setMessage(message);

    // skip player as needed
    return toSkip ? true : false;
  }//func