import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc, updateDoc, deleteField, getDocs, collection, setDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import '@fortawesome/fontawesome-free/css/all.min.css';
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

  .btn-container {
    display: flex;
    justify-content: center; 
    margin-top: 20px; 
  }

  button {
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    padding: 5px;
    text-align: center;
    position: fixed;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px; 
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
  background: #897662;
  padding: 10px;
  border-radius: 10px;
  width: 350px;
  max-width: 100%;
  height: 150px;
  overflow: auto;
  margin: 10px;
`;
const DropAreaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px; /* Same width as PopupContent */
  margin-top: 20px;
`;
const DropArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: black;
  color: white;
  width: 175px; /* Adjusted width for flex layout */
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
  color: #4c0000;
`;
const CustomPlataMasa = ({ onClose, onSubmit }) => {
    const { db } = useFirebase();
    const [mesaComenzi, setMesaComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [cardWidgets, setCardWidgets] = useState([]);
    const [cashWidgets, setCashWidgets] = useState([]);
    const [movedItems, setMovedItems] = useState(new Set());
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
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
    useEffect(() => {
        const totalItems = Object.keys(preparateDetails).length;
        if (movedItems.size === totalItems && totalItems > 0) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [movedItems, preparateDetails]);
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

useEffect(() => {
    const tableFromStorage = localStorage.getItem('selectedTable');
    if (tableFromStorage) {
        setSelectedTable(parseInt(tableFromStorage));
    }
}, []);


const handleButtonClick = async () => {
    const tableDocRef = doc(db, "comenzi_inter", `masa${selectedTable}`);
    const timestamp = new Date();
    try {
        const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
        const mesaSnapshot = await getDoc(mesaRef);

        if (mesaSnapshot.exists()) {
            const mesaComenzi = mesaSnapshot.data().comenzi || [];
            console.log("Initial mesaComenzi:", mesaComenzi);

            // Stocare initiala a comenzilor mesei în `comenzi_inter`
            const initialComanda = {
                comenzi: mesaComenzi,
                totalPretCard: totalCard, // Actualizează cu valoarea corectă dacă este disponibilă
                totalPretCash: totalCash, // Actualizează cu valoarea corectă dacă este disponibilă
                dataPlata: timestamp
            };

            const tableDocSnapshot = await getDoc(tableDocRef);
            if (tableDocSnapshot.exists()) {
                await updateDoc(tableDocRef, {
                    comenzi: arrayUnion(initialComanda)
                });
            } else {
                await setDoc(tableDocRef, {
                    comenzi: [initialComanda]
                });
            }

            // Continuă cu logica de filtrare și actualizare a comenzilor
            const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];

            const userCollectionRef = collection(db, "users");
            const userQuerySnapshot = await getDocs(userCollectionRef);

            for (const userDoc of userQuerySnapshot.docs) {
                const userComenzi = userDoc.data().comenzi || [];
                const updatedUserComenzi = userComenzi.filter(userComanda => {
                    return !mesaComenzi.some(mesaComanda => mesaComanda.id_comanda === userComanda.id_comanda);
                });

                if (updatedUserComenzi.length !== userComenzi.length) {
                    await updateDoc(userDoc.ref, {
                        comenzi: updatedUserComenzi,
                        plata: 0,
                    });
                }
            }

            const updatedComenzi = mesaComenzi.map(comanda => {
                allCategories.forEach(category => {
                    if (Array.isArray(comanda[category])) {
                        comanda[category] = comanda[category].filter(id => {
                            return !userQuerySnapshot.docs.some(userDoc => {
                                const userComenzi = userDoc.data().comenzi || [];
                                return userComenzi.some(userComanda => userComanda.id_comanda === comanda.id_comanda);
                            });
                        });
                    }
                });
                return comanda;
            }).filter(comanda => {
                return allCategories.some(category => Array.isArray(comanda[category]) && comanda[category].length > 0);
            });

            console.log("Updated comenzi:", updatedComenzi);

            await updateDoc(mesaRef, {
                comenzi: updatedComenzi,
            });

            localStorage.removeItem("plata");
            onSubmit(updatedComenzi);
            console.log("Comenzile sunt:", updatedComenzi);

            

            alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
            onClose();
        } else {
            console.log("No mesaSnapshot exists for masa:", selectedTable);
        }
    } catch (error) {
        console.error("Eroare la actualizarea datelor:", error);
    }
};




    const renderComenzi = (comenzi, orderIndex) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return comenzi.map((comanda, comandaIndex) => (
            <PopupContent key={comandaIndex} className="order">
                {allCategories.map((categorie) => {
                    const items = comanda[categorie];
                    if (Array.isArray(items) && items.length > 0) {
                        return (
                            <div key={categorie}>
                                <h4>{categorie}</h4>
                                <ul>
                                    {items.map((id, itemIndex) => {
                                        const uniqueId = `${comandaIndex}-${categorie}-${id}-${itemIndex}`;
                                        const preparat = preparateDetails[uniqueId];
                                        const isMoved = movedItems.has(uniqueId);
                                        return preparat ? (
                                            <li key={uniqueId} draggable={!isMoved} onDragStart={(e) => handleOnDrag(e, uniqueId)}>
                                                <div className={isMoved ? 'widget strikethrough' : 'widget'}>
                                                    {isMoved ? <StrikethroughItem>{preparat.nume} - {preparat.pret} RON</StrikethroughItem> : `${preparat.nume} - ${preparat.pret} RON`}
                                                </div>
                                            </li>
                                        ) : (
                                            <li key={uniqueId}>Loading...</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                })}
                <div key={`user-${orderIndex}`}>
                    <p>Comandat de: {comanda.user}</p>
                </div>
            </PopupContent>
        ));
    };
    return (
        <PopupContainer>
            <div className="comenzi">
                {mesaComenzi.length > 0 ? (
                    renderComenzi(mesaComenzi)
                ) : (
                    <p>Nu există comenzi de afișat.</p>
                )}
            </div>
            <div className="drop">
                <DropAreaContainer>
                    <DropArea onDrop={(e) => handleOnDrop(e, "card")} onDragOver={handleDragOver}>
                        {cardWidgets.length === 0 ? (
                            <p>Plata cu cardul: Trageți și plasați widgeturi aici</p>
                        ) : (
                            cardWidgets.map((widget, index) => (
                                <div className="dropped-widget" key={index}>
                                    {widget.nume} - {widget.pret} RON
                                </div>
                            ))
                        )}
                        <TotalAmount>Card: {totalCard} RON</TotalAmount>
                    </DropArea>
                    <DropArea onDrop={(e) => handleOnDrop(e, "cash")} onDragOver={handleDragOver}>
                        {cashWidgets.length === 0 ? (
                            <p>Plata cash: Trageți și plasați widgeturi aici</p>
                        ) : (
                            cashWidgets.map((widget, index) => (
                                <div className="dropped-widget" key={index}>
                                    {widget.nume} - {widget.pret} RON
                                </div>
                            ))
                        )}
                        <TotalAmount>Cash: {totalCash} RON</TotalAmount>
                    </DropArea>
                </DropAreaContainer>
                <div className="btn-container">
                    <button onClick={handleButtonClick} disabled={!isButtonEnabled}><i className="fa fa-check"></i></button>
                </div>
                
            </div>
        </PopupContainer>
    );
};
export default CustomPlataMasa;