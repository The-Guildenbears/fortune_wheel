import { useState } from "react";
import ModalComponent from "../modalcomponent/ModalComponent";

const FinalWinnerModal = ({players, round, bonusRoundValue, onToBonus, onToReset}) => {
    // sort players by totalBank descending
    const [sortedPlayers, setSortedPlayers] = useState([...players].sort((a, b) => b.totalBank - a.totalBank));

    return(<>
        <ModalComponent>
          <h2>🏆 Game Over! </h2>
          <p>
            1st Place: {sortedPlayers[0]?.name} (${sortedPlayers[0]?.totalBank})
          </p>
          <p>
            2nd Place: {sortedPlayers[1]?.name} (${sortedPlayers[1]?.totalBank})
          </p>
          <p>
            3rd Place: {sortedPlayers[2]?.name} (${sortedPlayers[2]?.totalBank})
          </p>

          {/* Bonus Round Button */}
          {round === bonusRoundValue-1 ? <button
            className="modalcomponent-button"
            onClick={onToBonus}
          >
            Go to the Bonus Round!
          </button> : <></>}

          {/* New Game Button */}
          <button
            className="modalcomponent-button"
            onClick={onToReset}
          >
            Start a New Game!
          </button>
        </ModalComponent>
    </>);
};

export default FinalWinnerModal;