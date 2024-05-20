import React, { useState } from "react";
import styled from "styled-components";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  background-color: ${({ isOver }) => (isOver ? '#f0f8ff' : 'white')};
`;

const Item = styled.div`
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  cursor: pointer;
`;

const FinalizeButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const calculateTotal = (items) => items.reduce((total, item) => total += item.price, 0);

const CustomPaymentPopup = ({ comenzi, preparateDetails, onClose, onFinalize }) => {
  const [cashItems, setCashItems] = useState([]);
  const [cardItems, setCardItems] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = active.data.current.item;
    const sourceList = active.data.current.source === 'cash' ? cashItems : cardItems;
    const destinationList = over.id === 'cash' ? cashItems : cardItems;

    if (active.data.current.source === over.id) return;

    if (over.id === 'cash') {
      setCashItems([...cashItems, activeItem]);
      setCardItems(cardItems.filter(item => item.uniqueId !== activeItem.uniqueId));
    } else {
      setCardItems([...cardItems, activeItem]);
      setCashItems(cashItems.filter(item => item.uniqueId !== activeItem.uniqueId));
    }
  };

  const handleFinalizeClick = () => {
    onFinalize({ cashItems, cardItems });
  };

  const renderComenzi = (comenzi) => {
    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
    return allCategories.flatMap((categorie) => {
      return comenzi.flatMap((comanda) => {
        const items = comanda[categorie];
        if (Array.isArray(items) && items.length > 0) {
          return items.map((id) => {
            const uniqueId = `${comanda.id_comanda}-${categorie}-${id}`;
            const preparat = preparateDetails[id];
            return preparat ? (
              <DraggableItem key={uniqueId} item={{ uniqueId, name: preparat.nume, price: preparat.pret }} source="preparate">
                {preparat.nume} - {preparat.pret} RON
              </DraggableItem>
            ) : (
              <div key={uniqueId}>Loading...</div>
            );
          });
        }
        return [];
      });
    });
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <PopupContainer>
        <CloseButton onClick={onClose}>X</CloseButton>
        <DndContext onDragEnd={handleDragEnd}>
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
          <div>
            {renderComenzi(comenzi)}
          </div>
          <FinalizeButton onClick={handleFinalizeClick}>Finalize Order</FinalizeButton>
        </DndContext>
      </PopupContainer>
    </>
  );
};

const DraggableItem = ({ item, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.uniqueId,
    data: { item, source: 'preparate' },
  });

  return (
    <Item ref={setNodeRef} style={{ opacity: isDragging ? 0.5 : 1, transform: CSS.Transform.toString(transform) }} {...listeners} {...attributes}>
      {children}
    </Item>
  );
};

const CashDropZone = ({ setCashItems, cashItems }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'cash',
  });

  return (
    <Column ref={setNodeRef} isOver={isOver}>
      {cashItems.map((item, index) => (
        <Item key={index}>{item.name} - {item.price} RON</Item>
      ))}
      <p>Total: {calculateTotal(cashItems)} RON</p>
    </Column>
  );
};

const CardDropZone = ({ setCardItems, cardItems }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'card',
  });

  return (
    <Column ref={setNodeRef} isOver={isOver}>
      {cardItems.map((item, index) => (
        <Item key={index}>{item.name} - {item.price} RON</Item>
      ))}
      <p>Total: {calculateTotal(cardItems)} RON</p>
    </Column>
  );
};

export default CustomPaymentPopup;
