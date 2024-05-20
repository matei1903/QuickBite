import React, { useState } from 'react';
import styled from 'styled-components';
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
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

const DroppableZone = ({ id, items, setItems }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <DropZone ref={setNodeRef}>
      {items.map((item, index) => (
        <DraggableItem key={item.id} id={item.id}>
          {item.name} - {item.price} RON
        </DraggableItem>
      ))}
    </DropZone>
  );
};

const CustomPaymentPopup = ({ orders, onClose, onSubmit }) => {
  const [items, setItems] = useState(orders);
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
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <DroppableZone id="items" items={items} setItems={setItems} />
        </SortableContext>
        <SortableContext items={cardItems} strategy={rectSortingStrategy}>
          <h4>Plată cu cardul</h4>
          <DroppableZone id="card" items={cardItems} setItems={setCardItems} />
        </SortableContext>
        <SortableContext items={cashItems} strategy={rectSortingStrategy}>
          <h4>Plată cu cash</h4>
          <DroppableZone id="cash" items={cashItems} setItems={setCashItems} />
        </SortableContext>
      </DndContext>
      <button onClick={handleSubmit}>Trimite</button>
      <button onClick={onClose}>Închide</button>
    </PopupContainer>
  );
};

export default CustomPaymentPopup;
