import React, { useState } from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

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
        <DndContext>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Column>
              <h2>Cash</h2>
              <CashDropZone setCashItems={setCashItems} cashItems={cashItems} />
            </Column>
            <Column>
              <h2>Card</h2>
              <CardDropZone setCardItems={setCardItems} cardItems={cardItems} />
            </Column>
          </div>
        </DndContext>
      </PopupContainer>
    </>
  );
};

const DraggableItem = ({ item, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.uniqueId,
  });

  return (
    <Item ref={setNodeRef} style={{ opacity: isDragging ? 0.5 : 1, transform }} {...listeners} {...attributes}>
      {children}
    </Item>
  );
};

const CashDropZone = ({ setCashItems, cashItems }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'cash',
    data: { type: 'cash' },
    // Update cash items when an item is dropped onto this drop zone
    onDrop: (result) => {
      setCashItems((items) => [...items, result.data]);
    },
  });

  return (
    <div ref={setNodeRef} style={{ backgroundColor: isOver ? '#f0f8ff' : 'white' }}>
      {cashItems.map((item, index) => (
        <Item key={index}>{item.name} - {item.price} RON</Item>
      ))}
      <p>Total: {calculateTotal(cashItems)} RON</p>
    </div>
  );
};

const CardDropZone = ({ setCardItems, cardItems }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'card',
    data: { type: 'card' },
    // Update card items when an item is dropped onto this drop zone
    onDrop: (result) => {
      setCardItems((items) => [...items, result.data]);
    },
  });

  return (
    <div ref={setNodeRef} style={{ backgroundColor: isOver ? '#f0f8ff' : 'white' }}>
      {cardItems.map((item, index) => (
        <Item key={index}>{item.name} - {item.price} RON</Item>
      ))}
      <p>Total: {calculateTotal(cardItems)} RON</p>
    </div>
  );
};

export default CustomPaymentPopup;
