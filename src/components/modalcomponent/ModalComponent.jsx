const ModalComponent = ({ children }) => {
    return(
        <div className="modalcomponent-background-div">
            <div className="modalcomponent-card-div">
                { children }
            </div>
        </div>
    );
}//const

export default ModalComponent;