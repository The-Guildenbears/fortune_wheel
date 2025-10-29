export const handleSpinResult = (players, setPlayers, currentPlayerIndex, lastSpinResult, setMessage, setMoneyToWin) => {
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
      // in game, you don't actually win the money until you guess correctly
      setMoneyToWin(lastSpinResult);
      message = `${players[currentPlayerIndex].name} can win $${lastSpinResult} for each instance of the consonant they guess!`;
    }else{
      // landed on either "BANKRUPT" or "LOSE A TURN"
      if(lastSpinResult === "BANKRUPT"){
        roundMoney = 0;
        toBankrupt = true;
        message = `${players[currentPlayerIndex].name} landed on BANKRUPT and loses all their money from this round!`;
      }else{
        message = `${players[currentPlayerIndex].name} loses a turn!`;
      }//if-else
      
      // skipping player either way
      toSkip = true;
    }//if-else

    // update player info as needed
    updatePlayerByIndex(currentPlayerIndex, (p) => ({ ...p, roundBank: roundMoney, bankrupt: toBankrupt}));
    setMessage(message);

    // skip player as needed
    return (toSkip) ? true : false;
  }//func