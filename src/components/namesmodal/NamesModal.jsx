import ModalComponent from "../modalcomponent/ModalComponent";

const NamesModal = ({onSubmitFunc, tempNames, handleNameChange}) => {
    return(<>
        <ModalComponent>
          <h2>Enter Player Names</h2>
          <form onSubmit={onSubmitFunc}>
              <div style={{marginBottom: "0.5rem"}}>
                <label>Player 1: </label>
                <input
                  type="text"
                  placeholder={tempNames[0]}
                  onChange={(e) => handleNameChange(0, e.target.value === "" ? "Player 1" : e.target.value)}
                />
              </div>
              <div style = {{marginBottom: "0.5rem"}}>
                <label>Player 2: </label>
                <input
                  type="text"
                  placeholder={tempNames[1]}
                  onChange={(e) => handleNameChange(1, e.target.value === "" ? "Player 2" : e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <label>Player 3: </label>
                <input
                  type="text"
                  placeholder={tempNames[2]}
                  onChange={(e) => handleNameChange(2, e.target.value === "" ? "Player 3" : e.target.value)}
                />
              </div>
              <button type = "submit" className = "modalcomponent-button">
                Start Game
              </button>
          </form>
        </ModalComponent>
    </>);
};

export default NamesModal;