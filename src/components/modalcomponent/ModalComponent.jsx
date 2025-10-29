const ModalComponent = ({ children }) => {
    // parameters:
    // "children" are HTML elements and React components passed into the component when calling it

    return(
        <div className="modalcomponent-background-div">
            <div className="modalcomponent-card-div">
                { children }
            </div>
        </div>
    );
}//const

export default ModalComponent;