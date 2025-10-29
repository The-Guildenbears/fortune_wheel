const PlayerCard = ({player, isTurn}) => {
    // change style based both on whether it is the player's turn and their bankruptcy
    const strClass = player.bankrupt ? "player-card-bankrupt" : (isTurn ? "player-card-isturn" : "player-card");

    return(<>
        <div className={strClass}>
            <div>{isTurn ? "👉 " : ""} {player.name}</div>
            <div>Round: ${player.roundBank}</div>
            <div>Total: ${player.totalBank}{" "}</div>
            <div>{player.bankrupt ? "(Bankrupt)" : ""}</div>
        </div>
    </>);
};//const


export default PlayerCard;