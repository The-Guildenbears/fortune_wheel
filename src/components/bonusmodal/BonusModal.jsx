import ModalComponent from "../modalcomponent/ModalComponent";

const BonusModal = ({bonusCategories, loadPuzzles, setShowBonusModal}) => {
    return(<>
        <ModalComponent>
          <h2>Bonus Round</h2>
          <p>
            Please select a category to guess from.
          </p>

          <ul style={{
            columns: "2",
            listStyle: "none",
            textAlign: "center",
            alignItems: "center",
            padding: "0"
          }}>
            {bonusCategories.map((category, i) => {
              return <li key={i}>
                <button
                  className="modalcomponent-button"

                  style={{
                    width: "10em",
                    marginTop: "4px",
                    marginBottom: "4px"
                  }}

                  onClick={() => {
                    loadPuzzles(category);
                    setShowBonusModal(false);
                  }}
                >
                  {category.split("|")[0].replaceAll("-", " ").toLocaleUpperCase()}
                </button>
              </li>
            })}
          </ul>
        </ModalComponent>
    </>);
};

export default BonusModal;