import PlayerCard from "./PlayerCard";

const Player = ({
  players,
  currentPlayerIndex
}) => {

  return(
    <>
      <h3>PLAYERS</h3>
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Turn {currentPlayerIndex}- {players[currentPlayerIndex].name}'s Turn</strong> 
        </div>

        <ul style={{ listStyleType: "none", paddingLeft: 0 }} className="player-list">
          {players.map((p, i) => (
            <li key={i}>
              <PlayerCard player={p} isTurn={i === currentPlayerIndex}/>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Player;