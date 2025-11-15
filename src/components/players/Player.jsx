import PlayerCard from "./PlayerCard";

// display component for player cards
const Player = ({ players, currentPlayerIndex}) => {

  return(
    <div style={{padding: "0", paddingLeft: "0.5em"}}>
      <div>
        <ul style={{ listStyleType: "none", paddingLeft: 0 }} className="player-list">
          {players.map((p, i) => (
            <li key={i}>
              <PlayerCard player={p} index={i+1} isTurn={i === currentPlayerIndex}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Player;