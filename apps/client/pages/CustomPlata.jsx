import React, { useState } from "react";
import styled from "styled-components";
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 20px;
  z-index: 1000;
  width: 80%;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Column = styled.div`
  width: 45%;
  padding: 10px;
  border: 1px solid black;
  min-height: 300px;
  margin: 0 10px;
`;

const Item = styled.div`
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  cursor: pointer;
`;

const CustomPaymentPopup = ({ comenzi, preparateDetails, onClose }) => {
  const [cashItems, setCashItems] = useState([]);
  const [cardItems, setCardItems] = useState([]);

  const [{ isOverCash }, dropCash] = useDrop({
    accept: 'item',
    drop: (item) => setCashItems([...cashItems, item]),
    collect: (monitor) => ({
      isOverCash: monitor.isOver()
    })
  });

  const [{ isOverCard }, dropCard] = useDrop({
    accept: 'item',
    drop: (item) => setCardItems([...cardItems, item]),
    collect: (monitor) => ({
      isOverCard: monitor.isOver()
    })
  });

  const renderComenzi = (comenzi) => {
    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
    return allCategories.flatMap((categorie) => {
      const items = comenzi[categorie];
      if (Array.isArray(items) && items.length > 0) {
        return items.map((id) => {
          const uniqueId = `${comenzi.id_comanda}-${categorie}-${id}`;
          const preparat = preparateDetails[id];
          return preparat ? (
            <DraggableItem key={uniqueId} item={{ uniqueId, name: preparat.nume, price: preparat.pret }}>
              {preparat.nume} - {preparat.pret} RON
            </DraggableItem>
          ) : (
            <div key={uniqueId}>Loading...</div>
          );
        });
      }
      return [];
    });
  };

  const calculateTotal = (items) => items.reduce((total, item) => total += item.price, 0);

  return (
    <>
      <Overlay onClick={onClose} />
      <PopupContainer>
        <CloseButton onClick={onClose}>X</CloseButton>
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Column ref={dropCash} style={{ backgroundColor: isOverCash ? '#f0f8ff' : 'white' }}>
              <h2>Cash</h2>
              {cashItems.map((item, index) => (
                <Item key={index}>{item.name} - {item.price} RON</Item>
              ))}
              <p>Total: {calculateTotal(cashItems)} RON</p>
            </Column>
            <Column ref={dropCard} style={{ backgroundColor: isOverCard ? '#f0f8ff' : 'white' }}>
              <h2>Card</h2>
              {cardItems.map((item, index) => (
                <Item key={index}>{item.name} - {item.price} RON</Item>
              ))}
              <p>Total: {calculateTotal(cardItems)} RON</p>
            </Column>
          </div>
        </DndProvider>
      </PopupContainer>
    </>
  );
};

const DraggableItem = ({ item, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  return (
    <Item ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </Item>
  );
};

export default CustomPaymentPopup;
