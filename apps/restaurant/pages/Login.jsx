import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import Layout from "../Layout.jsx";
import './NavBar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useFirebase } from "@quick-bite/components/context/Firebase";

const Login = () => {
  const { db } = useFirebase();
  const navigate = useNavigate();

  const handleAdaugaComanda = () => {
    navigate('/menu');
  };

  const [eliminareComenziActive, setEliminareComenziActive] = useState(false);
  const [creareNotaPlataActive, setCreareNotaPlataActive] = useState(false);
  const [IstoricComenziActive, setIstoricComenziActive] = useState(false);

  const handleEliminareComenzi = () => {
    setEliminareComenziActive(true);
    setCreareNotaPlataActive(false);  // Ensure only one action is active at a time
    setIstoricComenziActive(false);
  };

  const handleCreareNotaPlata = () => {
    setCreareNotaPlataActive(true);
    setEliminareComenziActive(false);  // Ensure only one action is active at a time
    setIstoricComenziActive(false);
  };

  const handleIstoricComenzi = () => {
    setEliminareComenziActive(false);
    setCreareNotaPlataActive(false);  // Ensure only one action is active at a time
    setIstoricComenziActive(true);
  };

  const handleTableClick = (masa) => {
    if (eliminareComenziActive) {
      console.log(`Navigating to /comenzi/${masa}`);
      navigate(`/comenzi/${masa}`);
    } else if (creareNotaPlataActive) {
      console.log(`Navigating to /nota-plata/${masa}`);
      navigate(`/nota-plata/${masa}`);
    } else if (IstoricComenziActive) {
      console.log(`Navigating to /istoric-comenzi/${masa}`);
      navigate(`/istoric-comenzi/${masa}`);
    } else {
      console.log("No action is active");
    }
  };

  const storedPosition_masa1 = JSON.parse(localStorage.getItem('draggedPosition_masa1'));
  const storedPosition_masa2 = JSON.parse(localStorage.getItem('draggedPosition_masa2'));
  const storedPosition_masa3 = JSON.parse(localStorage.getItem('draggedPosition_masa3'));

  const [position_masa1, setPosition_masa1] = useState(storedPosition_masa1 || { x: 0, y: 0 });
  const [position_masa2, setPosition_masa2] = useState(storedPosition_masa2 || { x: 0, y: 0 });
  const [position_masa3, setPosition_masa3] = useState(storedPosition_masa3 || { x: 0, y: 0 });

  const handleStartmasa1 = (e, data) => {};
  const handleDragmasa1 = (e, data) => {
    const { x, y } = data;
    setPosition_masa1({ x, y });
  };
  const handleStopmasa1 = (e, data) => {
    const { x, y } = data;
    setPosition_masa1({ x, y });
    localStorage.setItem('draggedPosition_masa1', JSON.stringify({ x, y }));
  };

  const handleStartmasa2 = (e, data) => {};
  const handleDragmasa2 = (e, data) => {
    const { x, y } = data;
    setPosition_masa2({ x, y });
  };
  const handleStopmasa2 = (e, data) => {
    const { x, y } = data;
    setPosition_masa2({ x, y });
    localStorage.setItem('draggedPosition_masa2', JSON.stringify({ x, y }));
  };

  const handleStartmasa3 = (e, data) => {};
  const handleDragmasa3 = (e, data) => {
    const { x, y } = data;
    setPosition_masa3({ x, y });
  };
  const handleStopmasa3 = (e, data) => {
    const { x, y } = data;
    setPosition_masa3({ x, y });
    localStorage.setItem('draggedPosition_masa3', JSON.stringify({ x, y }));
  };

  return (
    <Layout>
      <div className={eliminareComenziActive || creareNotaPlataActive || IstoricComenziActive ? 'blur-background' : ''}>
        <div id="nav-bar">
          <input type="checkbox" id="nav-toggle" />
          <div id="nav-header">
            <a id="nav-title" href="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" target="_blank" rel="noopener noreferrer">
              Quick<i className="fa-solid fa-bolt-lightning"></i>Bite
            </a>
            <hr />
          </div>
          <div id="nav-content">
            <div className="nav-button" onClick={handleAdaugaComanda}>
              <i className="fas fa-solid fa-plus"></i><span>Adaugare comenzi</span>
            </div>
            <div className="nav-button" onClick={handleEliminareComenzi}>
              <i className="fas fa-solid fa-minus"></i><span>Eliminare comenzi</span>
            </div>
            <div className="nav-button" onClick={handleIstoricComenzi}>
              <i className="fas fa-solid fa-clock-rotate-left"></i><span>Istoric comenzi</span>
            </div>
            <div className="nav-button" onClick={handleCreareNotaPlata}>
              <i className="fas fa-solid fa-money-bill"></i><span>Creare nota de plata</span>
            </div>
          </div>
          <input type="checkbox" id="nav-footer-toggle" />
          <div id="nav-footer">
            <div id="nav-footer-heading">
              <div id="nav-footer-avatar">
                <img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" alt="avatar" />
              </div>
              <div id="nav-footer-titlebox">
                <span id="nav-footer-title">Setari</span>
              </div>
              <label htmlFor="nav-footer-toggle">
                <i className="fas fa-solid fa-gear"></i>
              </label>
            </div>
            <div className="nav-button">
              <i className="fas fa-solid fa-power-off"></i><span>Inchidere sistem</span>
            </div>
          </div>
        </div>
        <div className="container">
          <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={position_masa1}
            scale={1}
            onStart={handleStartmasa1}
            onDrag={handleDragmasa1}
            onStop={handleStopmasa1}
            bounds="parent"
          >
            <div id="masa1" className={`handle ${eliminareComenziActive || creareNotaPlataActive || IstoricComenziActive ? 'selectable' : ''}`} onClick={() => handleTableClick('masa1')}>
              <div className="nume">Masa1</div>
            </div>
          </Draggable>
          <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={position_masa2}
            scale={1}
            onStart={handleStartmasa2}
            onDrag={handleDragmasa2}
            onStop={handleStopmasa2}
            bounds="parent"
          >
            <div id="masa2" className={`handle ${eliminareComenziActive || creareNotaPlataActive || IstoricComenziActive ? 'selectable' : ''}`} onClick={() => handleTableClick('masa2')}>
              <div className="nume">Masa2</div>
            </div>
          </Draggable>
          <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={position_masa3}
            scale={1}
            onStart={handleStartmasa3}
            onDrag={handleDragmasa3}
            onStop={handleStopmasa3}
            bounds="parent"
          >
            <div id="masa3" className={`handle ${eliminareComenziActive || creareNotaPlataActive || IstoricComenziActive ? 'selectable' : ''}`} onClick={() => handleTableClick('masa3')}>
              <div className="nume">Masa3</div>
            </div>
          </Draggable>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
