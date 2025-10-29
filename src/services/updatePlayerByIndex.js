export const updatePlayerByIndex = (index, setPlayers, updater, isRoundEnded) => {
    // "updater(p)" uses part of an object literal to change values of chosen player
    // other players' round banks are adjusted based on whether round is ending
    setPlayers((prev) => prev.map((p, i) => 
        (i === index ? updater(p) : { ...p, roundBank: isRoundEnded ? 0 : p.roundBank})
    ));
}//const func