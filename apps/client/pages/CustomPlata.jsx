import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  z-index: 1000;
`;

const DropZone = styled.div`
  background: #f8f8f8;
  padding: 10px;
  width: 200px;
  min-height: 100px;
  margin: 10px;
  border: 2px dashed #ccc;
`;

const Item = styled.div`
  padding: 8px;
  margin: 4px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
`;

const DraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Item>
  );
};

const DroppableZone = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <DropZone ref={setNodeRef}>
      {items.map((item) => (
        <DraggableItem key={item.id} id={item.id}>
          {item.nume} - {item.pret} RON
        </DraggableItem>
      ))}
    </DropZone>
  );
};

const CustomPaymentPopup = ({ orders, onClose, onSubmit }) => {
  const [cardItems, setCardItems] = useState([]);
  const [cashItems, setCashItems] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const from = active.data.current.sortable.containerId;
      const to = over.data.current.sortable.containerId;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current.sortable.index;

      if (from !== to) {
        let activeItem;
        if (from === 'orders') {
          activeItem = orders[activeIndex];
        } else if (from === 'card') {
          activeItem = cardItems[activeIndex];
          setCardItems(items => items.filter((_, index) => index !== activeIndex));
        } else if (from === 'cash') {
          activeItem = cashItems[activeIndex];
          setCashItems(items => items.filter((_, index) => index !== activeIndex));
        }

        if (to === 'card') {
          setCardItems(items => [...items, activeItem]);
        } else if (to === 'cash') {
          setCashItems(items => [...items, activeItem]);
        }
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(cardItems, cashItems);
    onClose();
  };

  return (
    <PopupContainer>
      <h3>Distribuie plățile</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <h4>Comenzi</h4>
            <SortableContext id="orders" items={orders} strategy={rectSortingStrategy}>
              <DroppableZone id="orders" items={orders} />
            </SortableContext>
          </div>
          <div>
            <h4>Card</h4>
            <SortableContext id="card" items={cardItems} strategy={rectSortingStrategy}>
              <DroppableZone id="card" items={cardItems} />
            </SortableContext>
          </div>
          <div>
            <h4>Cash</h4>
            <SortableContext id="cash" items={cashItems} strategy={rectSortingStrategy}>
              <DroppableZone id="cash" items={cashItems} />
            </SortableContext>
          </div>
        </div>
        <button onClick={handleSubmit}>Trimite</button>
        <button onClick={onClose}>Închide</button>
      </DndContext>
    </PopupContainer>
  );
};

export default CustomPaymentPopup;
