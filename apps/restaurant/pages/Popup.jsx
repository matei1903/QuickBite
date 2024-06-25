import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import '@fortawesome/fontawesome-free/css/all.min.css';

const StyledPopup = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
    color: black;

.popup {
    background-color: #757b8c;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    }
.label {
    color: black;
}

.button-container {
    display: flex;
    justify-content: center; /* Centrare orizontală */
    margin-top: 20px; /* Spațiu între butoane și butonul de confirmare */
}

button {
    border-radius: 20px;
    padding: 5px;
    width: 30px;
    height: 30px;    
}
button:hover {
    background-color: #202b1b; 
}

`;

const Popup = ({ onClose, onSelect }) => {
    const [numberOfTables, setNumberOfTables] = useState(0);
    const [selectedTable, setSelectedTable] = useState(null);
    const { db } = useFirebase();
    useEffect(() => {
        // Obține numărul de mese din Firestore
        const fetchNumberOfTables = async () => {
            const tablesRef = doc(db, "tables", "0Cf7CChhQEN1HlRcVO3P");
            try {

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
        localStorage.setItem('selectedTable', tableNumber.toString());
        onSelect(tableNumber);
        
    };

    // Funcție pentru a trimite masa selectată către componenta principală și a închide popup-ul
    const handleConfirm = () => {
        console.log("s-a confirmat masa",selectedTable);
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
            <div className="popup">
                <h2>Selectează masa:</h2>
                {renderTableButtons()}
                <div className="button-container">
                    <button onClick={handleConfirm}><i className="fa fa-check"></i></button>
                </div>
            </div>
        </StyledPopup>
    );
};

export default Popup;
