import ModalComponent from "../modalcomponent/ModalComponent";
import Wheel from "../wheel/Wheel";

const WheelModal = ({round, setLastSpinResult, hasSpun, setHasSpun, setShowWheelModal}) => {
    return(<>
        <ModalComponent>
            <Wheel
                round={round}
                setWinner={setLastSpinResult}
                hasSpun={hasSpun}
                setHasSpun={setHasSpun}
            />

            <button
                className="modalcomponent-button"
                style={{ width: "10em", marginTop: "4px", marginBottom: "4px" }}
                onClick={() => {setShowWheelModal(false);}}
            >
                Close Window
            </button>
        </ModalComponent>
    </>);
}

export default WheelModal;