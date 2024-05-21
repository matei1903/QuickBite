import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc } from "firebase/firestore";
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
  height: 200px;
  overflow: auto;
`;

const StrikethroughItem = styled.div`
  text-decoration: line-through;
`;

const CustomPlata = ({ onClose, onSubmit }) => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [cardWidgets, setCardWidgets] = useState([]);
    const [cashWidgets, setCashWidgets] = useState([]);
    const [movedItems, setMovedItems] = useState(new Set());

    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const comenzi = userDocSnapshot.data().comenzi || [];
                    setUserComenzi(comenzi);

                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    const preparatePromises = comenzi.flatMap((comanda, comandaIndex) =>
                        allCategories.flatMap(category =>
                            (Array.isArray(comanda[category]) ? comanda[category] : []).map(async (id, itemIndex) => {
                                const preparatDocRef = doc(db, category, id);
                                const preparatDocSnapshot = await getDoc(preparatDocRef);
                                return { id: `${comandaIndex}-${category}-${id}-${itemIndex}`, ...preparatDocSnapshot.data() }; // Unique ID per item
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

        fetchComenzi();
    }, [db, userID]);

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
            } else if (paymentType === "cash") {
                setCashWidgets((prevWidgets) => [...prevWidgets, item]);
            }

            setMovedItems((prevItems) => new Set(prevItems).add(itemId));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const renderComenzi = (comenzi) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return comenzi.map((comanda, comandaIndex) => (
            <PopupContent key={comandaIndex} className="order">
                <h3>Comanda {comandaIndex + 1}</h3>
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
                <p>Comandat de: {comanda.user}</p>
            </PopupContent>
        ));
    };

    return (
        <PopupContainer>
            <div>
                {userComenzi.length > 0 ? (
                    renderComenzi(userComenzi)
                ) : (
                    <p>Nu există comenzi de afișat.</p>
                )}
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
                    </DropArea>
                </DropAreaContainer>
                <button onClick={onClose}>Înapoi</button>
            </div>
        </PopupContainer>
    );
};

export default CustomPlata;
