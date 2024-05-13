import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import firebase from "firebase/app";
import "firebase/firestore";

const StyledPopup = styled.div`
  /* Stilizare pentru popup */
`;

const Popup = ({ onClose, onSelect }) => {
  const [numberOfTables, setNumberOfTables] = useState(0);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    // Obține numărul de mese din Firestore
    const fetchNumberOfTables = async () => {
      const tablesRef = firebase.firestore().collection("tables");
      const snapshot = await tablesRef.get();
      snapshot.forEach((doc) => {
        const data = doc.data();
        setNumberOfTables(data.number);
      });
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
