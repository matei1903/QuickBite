import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import Layout from "../Layout.jsx";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import styled from 'styled-components';
import { format } from 'date-fns';



const OrdersContainer = styled.div`
  width: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  
  
`;

const Order = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  color: black;
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
`;

const Button = styled.button`
  margin-top: 10px;
`;

const Container = styled.div`

width: 50%;
margin-left: 25%;
text-align: justify;
border: 1px solid black;
margin-top: 50px;
height: 700px;
overflow: auto;
box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
background-color: #6f6b62;
font-family: "Google Sans",Roboto,Arial,sans-serif;
color: #191919;
position: absolute;
display: flex;
justify-content: center;


h2 {
    text-align: center;
}





/* Pentru Webkit Browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px; /* Lățimea scrollbar-ului */
}

::-webkit-scrollbar-thumb {
  background-color: #192440; /* Culoarea scrollbar-ului */
  border-radius: 10px; /* Colțuri rotunjite */
}

::-webkit-scrollbar-track {
  background: transparent; /* Fundalul track-ului scrollbar-ului */
}

/* Pentru Firefox */
* {
  scrollbar-width: thin; /* Subțire */
  scrollbar-color: #192440 transparent; /* Culoarea scrollbar-ului și fundalul track-ului */
}

`;

const OrderHistory = () => {
  const { masa } = useParams();
  const { db } = useFirebase();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("mmaassaa",masa);
    const fetchOrders = async () => {
      try {
        const masaRef = doc(db, "istoric_comenzi", masa);
        const masaSnapshot = await getDoc(masaRef);
        if (masaSnapshot.exists()) {
          const masaData = masaSnapshot.data();
          const ordersData = masaData.comenzi || [];
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, [db, masa]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  return (
    <Layout>
        <Container>
            
        <div>
          <Title>Istoric note de plata {masa}</Title>
          <OrdersContainer>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <Order key={index}>
                  {Object.keys(order).map((key) => (
                    Array.isArray(order[key]) && order[key].length > 0 ? (
                      <div key={key}>
                        <p>
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {order[key].join(', ')}
                        </p>
                      </div>
                    ) : (
                      !Array.isArray(order[key]) && key !== "dataPlata" && key !== "totalPretCard" && key !== "totalPretCash" && order[key] ? (
                        <div key={key}>
                          <p>{key.charAt(0).toUpperCase() + key.slice(1)}: {order[key]}</p>
                        </div>
                      ) : null
                    )
                  ))}
                  <p>Data: {formatDate(order.dataPlata)}</p>
                  <p>Total Pret Card: {order.totalPretCard}</p>
                  <p>Total Pret Cash: {order.totalPretCash}</p>
                </Order>
              ))
            ) : (
              <p>No orders found for this table.</p>
            )}
          </OrdersContainer>
        </div>
      
        </Container>
      
    </Layout>
    
  );
};

export default OrderHistory;
