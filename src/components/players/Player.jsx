import PlayerCard from "./PlayerCard";

// display component for player cards
const Player = ({ players, currentPlayerIndex}) => {

  return(
    <>
      <h3>PLAYERS</h3>
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>{players[currentPlayerIndex].name}'s Turn</strong> 
        </div>

        <ul style={{ listStyleType: "none", paddingLeft: 0 }} className="player-list">
          {players.map((p, i) => (
            <li key={i}>
              <PlayerCard player={p} index={i+1} isTurn={i === currentPlayerIndex}/>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Player;