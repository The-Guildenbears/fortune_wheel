export const buyVowel = (vowel, players, setPlayers, currentPlayerIndex, guessed) => {
    if (players[currentPlayerIndex].roundBank < 500) {
      alert(`${players[currentPlayerIndex].name} does not have enough money to buy a vowel!`);
      return;
    }//if

    const confirmed = window.confirm(
      `${players[currentPlayerIndex].name}, do you want to buy '${vowel}' for $500?`
    );
    if (!confirmed) return;

    if(guessed.includes(vowel)){
      //This shouldn't show up but just in case
      alert("This vowel has already been guessed!\nFortunately, your money will not be spent.");
      return false;
    }else{
      // Subtract $500 from the current player's round bank
      const updatedPlayers = players.map((p, i) =>
        i === currentPlayerIndex ? { ...p, roundBank: p.roundBank - 500 } : p
      );
      setPlayers(updatedPlayers);

      return true;
    }//if-else
  };