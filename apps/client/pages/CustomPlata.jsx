import React, { useState } from "react";
import styled from "styled-components";
import { DndProvider, useDrag, useDrop } from 'react-beautiful-dnd';

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

  const onDragEnd = (result, targetItemsSetter) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(targetItemsSetter);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    targetItemsSetter(newItems);
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <PopupContainer>
        <CloseButton onClick={onClose}>X</CloseButton>
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Column>
              <h2>Cash</h2>
              <DroppableColumn items={cashItems} setItems={setCashItems} />
            </Column>
            <Column>
              <h2>Card</h2>
              <DroppableColumn items={cardItems} setItems={setCardItems} />
            </Column>
          </div>
        </DndProvider>
      </PopupContainer>
    </>
  );
};

const DroppableColumn = ({ items, setItems }) => {
  const onDragEnd = (result) => {
    onDragEnd(result, setItems);
  };

  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {items.map((item, index) => (
            <DraggableItem key={item.id} item={item} index={index}>
              {item.name} - {item.price} RON
            </DraggableItem>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const DraggableItem = ({ item, index, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { ...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export default CustomPaymentPopup;
