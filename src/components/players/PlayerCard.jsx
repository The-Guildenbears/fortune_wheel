const PlayerCard = ({player, index, isTurn}) => {
    // change style based both on whether it is the player's turn and their bankruptcy
    const strId = `player${index}`;
    const strClass = player.bankrupt ? "player-card-bankrupt" : (isTurn ? "player-card" : "player-card-inactive");

    return(<>
        <div className={strClass} id={strId}>
            <div>{isTurn ? "👉 " : ""} {player.name}</div>
            <div>Round: ${player.roundBank}</div>
            <div>Total: ${player.totalBank}{" "}</div>
            <div>{player.bankrupt ? "(Bankrupt)" : ""}</div>
        </div>
    </>);
};//const


export default PlayerCard;