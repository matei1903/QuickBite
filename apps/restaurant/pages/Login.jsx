import React, { useState, useEffect } from "react";
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import styled from 'styled-components';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './NavBar.css';
const Layout = React.lazy(() => import("../Layout.jsx"));



const Login = () => {

  return (
    <Layout>
      <div id="nav-bar">
        <input type="checkbox" id="nav-toggle" />
        <div id="nav-header">
          <a id="nav-title" href="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" target="_blank" rel="noopener noreferrer">
            Quick<i className="fa-solid fa-bolt-lightning"></i>Bite
          </a>
          <hr />
        </div>
        <div id="nav-content">
          <div className="nav-button">
            <i className="fas fa-solid fa-plus"></i><span>Adaugare comenzi</span>
          </div>
          <div className="nav-button">
            <i className="fas fa-solid fa-minus"></i><span>Eliminare comenzi</span>
          </div>
          <div className="nav-button">
            <i className="fas fa-solid fa-clock-rotate-left"></i><span>Istoric comenzi</span>
          </div>
          <div className="nav-button">
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
    </Layout>
  );
};


export default Login;