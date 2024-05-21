import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const PopupContainer = styled.div`
  /* Styling here */
`;

const PopupContent = styled.div`
  /* Styling here */
`;

const DropAreaContainer = styled.div`
  /* Styling here */
`;

const DropArea = styled.div`
  /* Styling here */
`;

const TotalAmount = styled.div`
  /* Styling here */
`;

const StrikethroughItem = styled.div`
  /* Styling here */
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
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [totalCard, setTotalCard] = useState(0);
  const [totalCash, setTotalCash] = useState(0);

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

    fetchComenzi();
  }, [db, userID]);

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

  const handleButtonClick = async () => {
    try {
      const userDocRef = doc(db, "users", userID);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedComenzi = userData.comenzi.filter(comanda => {
          return !Object.keys(comanda).some(category => 
            (Array.isArray(comanda[category]) ? comanda[category] : []).some(id => 
              movedItems.has(`${comanda.id_comanda}-${category}-${id}`)
            )
          );
        });

        const newTotalPlata = (userData.plata || 0) - (totalCard + totalCash);

        await updateDoc(userDocRef, {
          comenzi: updatedComenzi,
          plata: newTotalPlata
        });

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
        <button onClick={handleButtonClick} disabled={!isButtonEnabled}>Confirmă Plată</button>
        <button onClick={onClose}>Închide</button>
      </div>
    </PopupContainer>
  );
};

export default CustomPlata;
