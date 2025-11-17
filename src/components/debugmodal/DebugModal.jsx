import ModalComponent from "../modalcomponent/ModalComponent";

const DebugModal = ({isGameOver, isBonusRound, onNextPlayer, onEndRound, onResetRound, onResetGame, onCloseWindow}) => {
    
    return(<>
        <ModalComponent>
          {/* Round debug */}
          <div>
            <h3>DEBUGGING BUTTONS</h3>
            <p>Manually move to next available player</p>
            <button 
              onClick={onNextPlayer} 
              style={{ marginRight: "0.5rem" }}
              disabled={isGameOver || isBonusRound}
            >
              {isGameOver || isBonusRound ? "Cannot Skip (Final Round)" : "Next Player"}
            </button>

            <p>
              End Round (Add unbanked money to Total Bank, reset unbanked money to 0,
              and move to next round)
            </p>
            <button
              onClick={onEndRound}
              style={{ marginRight: "0.5rem" }}
              disabled={isGameOver || isBonusRound}
            >
              {isGameOver || isBonusRound ? "Cannot Skip (Final Round)" : "End Round"}
            </button>
            <p>
              Reset Round (Reset unbanked money to 0, does not move to next round)
            </p>
            <button
              onClick={onResetRound}
              style={{ marginRight: "0.5rem" }}
            >
              Reset Round
            </button>

            <p>
              Reset Game (Resets unbanked AND banked money to 0, reset to round 1)
            </p>
            <button
              onClick={onResetGame}
              style={{ marginRight: "0.5rem" }}
            >
              Reset Game
            </button>
          </div>

          <br/>
          <button 
            className="modalcomponent-button"
            style={{ width: "10em", marginTop: "4px", marginBottom: "4px" }}
            onClick={onCloseWindow}
          >
            Close Debug Window
          </button>
        </ModalComponent>
    </>)
}

export default DebugModal;