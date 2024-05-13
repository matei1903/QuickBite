import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";

const StyledPopup = styled.div`
  /* Stilizare pentru popup */
`;

const Popup = ({ onClose, onSelect }) => {
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    // Obține numărul de mese din Firestore
    const fetchNumberOfTables = async () => {
        try {
          const tablesRef = doc(firebase.firestore(), "tables/0Cf7CChhQEN1HlRcVO3P"); 
          const docSnapshot = await getDoc(tablesRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const numberOfTables = data.number;
            console.log("numarul de mese:", numberOfTables);
            setNumberOfTables(numberOfTables);
          } else {
            console.error("Documentul din Firestore nu există.");
          }
        } catch (error) {
          console.error("Eroare la obținerea datelor din Firestore:", error);
        }
      };

    fetchNumberOfTables();
  }, []);

  // Funcție pentru a seta masa selectată
  const handleSelectTable = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  // Funcție pentru a trimite masa selectată către componenta principală și a închide popup-ul
  const handleConfirm = () => {
    onSelect(selectedTable);
    onClose();
  };

  // Generează butoanele radio pentru fiecare masă
  const renderTableButtons = () => {
    const buttons = [];
    if (numberOfTables > 0) {
      for (let i = 1; i <= numberOfTables; i++) {
        buttons.push(
          <div key={i}>
            <input
              type="radio"
              id={`table-${i}`}
              name="table"
              value={i}
              checked={selectedTable === i}
              onChange={() => handleSelectTable(i)}
            />
            <label htmlFor={`table-${i}`}>Masă {i}</label>
          </div>
        );
      }
    } else {
      console.error("Numărul de mese din Firestore este zero sau inexistent.");
    }
    return buttons;
  };

  return (
    <StyledPopup>
      <h2>Selectează masa:</h2>
      {renderTableButtons()}
      <button onClick={handleConfirm}>Confirmă</button>
    </StyledPopup>
  );
};

export default Popup;
