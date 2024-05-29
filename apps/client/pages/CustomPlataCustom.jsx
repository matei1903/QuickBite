import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  color: black;
  flex-direction: column;

  button {
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    padding: 5px;
    text-align: center;
    position: fixed;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    border-radius: 20px;
    background-color: #53624d;
    color: #ecebed;
    font-size: 18px;
    border: none;
    outline: 2px solid black;
    &:disabled {
        background-color: #869182;
        color: #323232;
    }
  }

  .comenzi {
    height: 45%;
    overflow: auto;
  }

  .drop {
    height: 45%;
    overflow: auto;
  }
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  max-width: 100%;
  height: 100px;
  overflow: auto;
`;

const DropAreaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
  margin-top: 20px;
`;

const DropArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: black;
  color: white;
  width: 175px;
  max-width: 100%;
  height: 200px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const TotalAmount = styled.div`
  margin-top: auto;
  padding: 10px 0;
  color: white;
`;

const StrikethroughItem = styled.div`
  text-decoration: line-through;
`;

const CustomPlataCustom = ({ onClose, onSubmit }) => {
    const { db } = useFirebase();
    const [mesaComenzi, setMesaComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [cardWidgets, setCardWidgets] = useState([]);
    const [cashWidgets, setCashWidgets] = useState([]);
    const [movedItems, setMovedItems] = useState(new Set());
    const [totalCard, setTotalCard] = useState(0);
    const [totalCash, setTotalCash] = useState(0);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        const tableFromStorage = localStorage.getItem('selectedTable');
        if (tableFromStorage) {
            setSelectedTable(parseInt(tableFromStorage));
        }
    }, []);

    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
                const mesaSnapshot = await getDoc(mesaRef);
                if (mesaSnapshot.exists()) {
                    const mesaComenzi = mesaSnapshot.data().comenzi || [];
                    setMesaComenzi(mesaComenzi);
                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    const preparatePromises = mesaComenzi.flatMap((comanda, comandaIndex) =>
                        allCategories.flatMap(category =>
                            (Array.isArray(comanda[category]) ? comanda[category] : []).map(async (id, itemIndex) => {
                                const preparatDocRef = doc(db, category, id);
                                const preparatDocSnapshot = await getDoc(preparatDocRef);
                                return { id: `${comandaIndex}-${category}-${id}-${itemIndex}`, ...preparatDocSnapshot.data() };
                            })
                        )
                    );
                    const preparate = await Promise.all(preparatePromises);
                    const preparateMap = preparate.reduce((acc, preparat) => {
                        acc[preparat.id] = preparat;
                        return acc;
                    }, {});
                    setPreparateDetails(preparateMap);
                }
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };
        if (selectedTable !== null) {
            fetchComenzi();
        }
    }, [db, userID, selectedTable]);

    const handleOnDrag = (e, itemId) => {
        e.dataTransfer.setData("itemId", itemId);
    };

    const handleOnDrop = (e, paymentType) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("itemId");
        const item = preparateDetails[itemId];
        if (item) {
            if (paymentType === "card") {
                setCardWidgets((prevWidgets) => [...prevWidgets, item]);
                setTotalCard((prevTotal) => prevTotal + item.pret);
            } else if (paymentType === "cash") {
                setCashWidgets((prevWidgets) => [...prevWidgets, item]);
                setTotalCash((prevTotal) => prevTotal + item.pret);
            }
            setMovedItems((prevItems) => new Set(prevItems).add(itemId));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleButtonClick = async () => {
        try {
            const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
            const mesaSnapshot = await getDoc(mesaRef);
    
            if (mesaSnapshot.exists()) {
                const mesaComenzi = mesaSnapshot.data().comenzi || [];
                const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                const movedItemIds = Array.from(movedItems);
    
                // Remove selected items from the "comenzi" collection
                const updatedComenzi = mesaComenzi.map((comanda, comandaIndex) => {
                    allCategories.forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category] = comanda[category].filter((id, itemIndex) =>
                                !movedItemIds.includes(`${comandaIndex}-${category}-${id}-${itemIndex}`)
                            );
                        }
                    });
                    return comanda;
                }).filter(comanda =>
                    allCategories.some(category => Array.isArray(comanda[category]) && comanda[category].length > 0)
                );
    
                await updateDoc(mesaRef, { comenzi: updatedComenzi });
    
                // Update each user's "comenzi" field
                const usersSnapshot = await getDocs(collection(db, "users"));
                for (const userDoc of usersSnapshot.docs) {
                    const userComenzi = userDoc.data().comenzi || [];
                    let userComenziUpdated = false;
    
                    const updatedUserComenzi = userComenzi.map((userComanda) => {
                        const correspondingMasaComanda = updatedComenzi.find(comanda => comanda.id === userComanda.id);
                        if (correspondingMasaComanda && correspondingMasaComanda.id_comanda === userComanda.id_comanda) {
                            // Copy the corresponding order from "comenzi" to "users"
                            Object.assign(userComanda, correspondingMasaComanda);
                            userComenziUpdated = true;
                        }
                        return userComanda;
                    });
    
                    // If no corresponding order is found, remove the order from "users"
                    if (!userComenziUpdated) {
                        await updateDoc(userDoc.ref, { comenzi: [] });
                    }
    
                    if (userComenziUpdated) {
                        await updateDoc(userDoc.ref, { comenzi: updatedUserComenzi });
                    }
                }
    
                localStorage.removeItem("plata");
                onSubmit(updatedComenzi);
                alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
                onClose();
            }
        } catch (error) {
            console.error("Eroare la actualizarea datelor:", error);
        }
    };
    

    const renderComenzi = (comenzi) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return comenzi.map((comanda, comandaIndex) => (
            <PopupContent key={comandaIndex} className="comenzi">
                {allCategories.flatMap(category =>
                    (Array.isArray(comanda[category]) ? comanda[category] : []).map((id, itemIndex) => {
                        const preparatId = `${comandaIndex}-${category}-${id}-${itemIndex}`;
                        const preparat = preparateDetails[preparatId];
                        return (
                            preparat && (
                                <div
                                    key={preparatId}
                                    draggable
                                    onDragStart={(e) => handleOnDrag(e, preparatId)}
                                    style={{ marginBottom: "10px", cursor: "grab" }}
                                >
                                    {movedItems.has(preparatId) ? (
                                        <StrikethroughItem>{preparat.nume} - {preparat.pret} RON</StrikethroughItem>
                                    ) : (
                                        <div>{preparat.nume} - {preparat.pret} RON</div>
                                    )}
                                </div>
                            )
                        );
                    })
                )}
            </PopupContent>
        ));
    };

    return (
        <PopupContainer>
            <div className="comenzi">
                {renderComenzi(mesaComenzi)}
            </div>
            <DropAreaContainer>
                <DropArea className="drop" onDrop={(e) => handleOnDrop(e, "card")} onDragOver={handleDragOver}>
                    <h3>Plată cu Card</h3>
                    {cardWidgets.map((item, index) => (
                        <div key={index}>{item.nume} - {item.pret} RON</div>
                    ))}
                    <TotalAmount>Total: {totalCard} RON</TotalAmount>
                </DropArea>
                <DropArea className="drop" onDrop={(e) => handleOnDrop(e, "cash")} onDragOver={handleDragOver}>
                    <h3>Plată cu Cash</h3>
                    {cashWidgets.map((item, index) => (
                        <div key={index}>{item.nume} - {item.pret} RON</div>
                    ))}
                    <TotalAmount>Total: {totalCash} RON</TotalAmount>
                </DropArea>
            </DropAreaContainer>
            <button onClick={handleButtonClick}>Confirmă Plata</button>
        </PopupContainer>
    );
};

export default CustomPlataCustom;
