import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '@quick-bite/components/context/Firebase';
import Layout from "../Layout.jsx";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import styled from 'styled-components';
import { format } from 'date-fns';
import PaymentPopup from "./Plata";
import CustomPlataMasa from "./CustomPlataMasa";
import CustomPlataCustom from "./CustomPlataCustom";
import jsPDF from 'jspdf';

const NotaPlataContainer = styled.div`
  display: flex;
  margin-left: 20px;
  width: 40%;
  border: 1px solid black;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
  background-color: #6f6b62;
  margin-top: 50px;
  justify-content: center;
  height: 700px;
  overflow: auto;
  position: absolute;
`;
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
width: 30%;
margin-left: 60%;
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
h2 {
    text-align: center;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
li {
    text-align: left;
    margin-left:22%;
}
.preparat {
    display: flex;
    align-items: center;
}
.preparat-row p {
    margin: 0 10px;
  }
button {
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    padding: 5px;
    text-align: center;
    position: fixed;
    margin-left: -180px;
    transform: translateX(-50%);
    bottom: 50px;
    width: 150px;
    border-radius: 20px;
    background-color: #3b2b18;
    color: #ecebed;
    font-size:18px;
    border: none;
    outline: 2px solid black;
    width: 200px;
  }
  .comanda:disabled {
    background-color: #625546;
    color: #323232;
  }
}
input{
    appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #192440; /* Culoarea verde inchis pentru bordură */
  outline: none;
  cursor: pointer;
  margin-right: 8px;
  &:checked {
    background-color: #192440; /* Culoarea de fundal verde inchis când este selectat */
    border-color: #3b2b18; /* Culoarea bordurii când este selectat */
  }
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
const NotaPlata = () => {
  const { db } = useFirebase();
  const { masaId } = useParams();
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCustomMasaPopup, setCustomShowMasaPopup] = useState(false);
  const [mesaComenzi, setMesaComenzi] = useState([]);
  const [preparateDetails, setPreparateDetails] = useState({});
  const [selectedPreparates, setSelectedPreparates] = useState([]);
  const [showCustomPlataPopup, setCustomPlataPopup] = useState(false);
  const handlePlata = () => {
    setShowPopup(true);
};
const handleClosePopup = () => {
    setShowPopup(false);
};
const handleCloseCustomMasaPopup = () => {
    setCustomShowMasaPopup(false);
};
const handleCloseCustomPlataPopup = () => {
    setCustomPlataPopup(false);
};
localStorage.setItem('selectedTable', masaId.toString());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const masaRef = doc(db, "comenzi_inter", masaId);
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
  }, [db, masaId]);
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  const sendToHistory = async (order) => {
    console.log('sendToHistory function is called with order:', order);
    console.log('masaId:', masaId);
  
    if (!masaId) {
      console.error('masaId is undefined or null. Please provide a valid masaId.');
      return;
    }
  
    try {
      // First, add the order to istoric_comenzi
      const istoricRef = doc(db, `istoric_comenzi/${masaId}`);
      const istoricSnapshot = await getDoc(istoricRef);
  
      const { dataPlata, totalPretCash, totalPretCard, comenzi } = order;
  
      // Prepare updated comenzi with additional fields
      const updatedComenzi = comenzi.map(comanda => ({
        ...comanda,
        dataPlata: dataPlata,
        totalPretCash: totalPretCash,
        totalPretCard: totalPretCard
      }));
  
      if (istoricSnapshot.exists()) {
        const istoricData = istoricSnapshot.data();
        const existingComenzi = istoricData.comenzi || [];
        const updatedComenziIstoric = [...existingComenzi, ...updatedComenzi];
        await setDoc(istoricRef, { comenzi: updatedComenziIstoric }, { merge: true });
      } else {
        await setDoc(istoricRef, { comenzi: updatedComenzi });
      }
  
      // Then, remove the order from comenzi_inter
      const masaRef = doc(db, `comenzi_inter/${masaId}`);
      const masaSnapshot = await getDoc(masaRef);
  
      if (masaSnapshot.exists()) {
        const masaData = masaSnapshot.data();
        let comenzi = masaData.comenzi || [];
  
        console.log('Initial comenzi:', JSON.stringify(comenzi, null, 2));
  
        // Filter out the orders with matching id_comanda
        const updatedComenziInter = comenzi.map(comandaVector => {
          const filteredComenzi = comandaVector.comenzi.filter(comanda => comanda.id_comanda !== order.id_comanda);
          return { ...comandaVector, comenzi: filteredComenzi };
        }).filter(comandaVector => comandaVector.comenzi.length > 0); // Remove empty vectors
  
        console.log('Updated comenzi:', JSON.stringify(updatedComenziInter, null, 2));
  
        // Update the comenzi_inter document
        await setDoc(masaRef, { comenzi: updatedComenziInter }, { merge: true });
  
        console.log(`Order with id_comanda ${order.id_comanda} has been deleted from comenzi_inter for masaId ${masaId}.`);
      } else {
        console.error(`Document for masaId ${masaId} does not exist in comenzi_inter.`);
      }
  
    } catch (error) {
      console.error('Error sending order to history and deleting from comenzi_inter: ', error);
    }
  };
  
  useEffect(() => {
    const fetchComenzi = async () => {
        try {
            const mesaRef = doc(db, "comenzi", masaId);
            const mesaSnapshot = await getDoc(mesaRef);
            if (mesaSnapshot.exists()) {
                const mesaComenzi = mesaSnapshot.data().comenzi || [];
                setMesaComenzi(mesaComenzi);
                const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                const preparatePromises = mesaComenzi.flatMap(comanda =>
                    allCategories.flatMap(category =>
                        (Array.isArray(comanda[category]) ? comanda[category] : []).map(async id => {
                            const preparatDocRef = doc(db, category, id);
                            const preparatDocSnapshot = await getDoc(preparatDocRef);
                            return { id, ...preparatDocSnapshot.data() };
                        })
                    )
                );
                const preparate = await Promise.all(preparatePromises);
                const preparateMap = preparate.reduce((acc, preparat) => {
                    acc[preparat.id] = preparat;
                    return acc;
                }, {});
                setPreparateDetails(preparateMap);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Eroare la încărcarea comenzilor:", error);
        }
    };
    fetchComenzi();
}, [db, masaId]);
const handleSelectPreparat = (id_comanda, preparatId) => {
    const uniqueId = `${id_comanda}-${preparatId}`;
    setSelectedPreparates((prevSelected) =>
        prevSelected.includes(uniqueId)
            ? prevSelected.filter(id => id !== uniqueId)
            : [...prevSelected, uniqueId]
    );
};
const handlePaymentSubmit = async (selectedOption, paymentMethod, updatedComenzi) => {
    console.log(masaId);
    const tableDocRef = doc(db, "comenzi_inter", `${masaId}`);
    const timestamp = new Date();
    if (selectedOption === "comandaMesei" && paymentMethod === "cash") {
        try {
            const mesaRef = doc(db, "comenzi", `${masaId}`);
            const mesaSnapshot = await getDoc(mesaRef);
            if (mesaSnapshot.exists()) {
                const mesaComenzi = mesaSnapshot.data().comenzi || [];
                let totalPretCash = 0;
                let totalPretCard = 0;
                const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                const userCollectionRef = collection(db, "users");
                const userQuerySnapshot = await getDocs(userCollectionRef);
                
                for (const userDoc of userQuerySnapshot.docs) {
                    const userComenzi = userDoc.data().comenzi || [];
                    const updatedUserComenzi = userComenzi.filter(userComanda => {
                        return !mesaComenzi.some(mesaComanda => mesaComanda.id_comanda === userComanda.id_comanda);
                    });
    
                    if (updatedUserComenzi.length !== userComenzi.length) {
                        await updateDoc(userDoc.ref, {
                            comenzi: updatedUserComenzi,
                            plata: 0,
                        });
                    }
                }
                mesaComenzi.forEach(comanda => {
                    Object.keys(comanda).forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category].forEach(id => {
                                const preparat = preparateDetails[id];
                                if (preparat) {
                                    totalPretCash += preparat.pret;
                                    totalPretCard += preparat.pret;
                                }
                            });
                        }
                    });
                });
                const newComanda = {
                    comenzi: mesaComenzi,
                    totalPretCash,
                    totalPretCard: 0,
                    dataPlata: timestamp
                };
                await updateDoc(tableDocRef, {
                    comenzi: arrayUnion(newComanda)
                });
                const updatedMesaComenzi = mesaComenzi.map(comanda => {
                    allCategories.forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category] = comanda[category].filter(id => {
                                return !userQuerySnapshot.docs.some(userDoc => {
                                    const userComenzi = userDoc.data().comenzi || [];
                                    return userComenzi.some(userComanda => userComanda.id_comanda === comanda.id_comanda);
                                });
                            });
                        }
                    });
                    return comanda;
                }).filter(comanda => {
                    return allCategories.some(category => Array.isArray(comanda[category]) && comanda[category].length > 0);
                });
    
                await updateDoc(mesaRef, {
                    comenzi: updatedMesaComenzi,
                });
    
                //alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
                
            }
        } catch (error) {
            console.error("Eroare la actualizarea datelor:", error);
        }
    }
    if (selectedOption === "comandaMesei" && paymentMethod === "card") {
        try {
            const mesaRef = doc(db, "comenzi", `${masaId}`);
            const mesaSnapshot = await getDoc(mesaRef);
            if (mesaSnapshot.exists()) {
                const mesaComenzi = mesaSnapshot.data().comenzi || [];
                let totalPretCash = 0;
                let totalPretCard = 0;
                const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                const userCollectionRef = collection(db, "users");
                const userQuerySnapshot = await getDocs(userCollectionRef);
                
                for (const userDoc of userQuerySnapshot.docs) {
                    const userComenzi = userDoc.data().comenzi || [];
                    const updatedUserComenzi = userComenzi.filter(userComanda => {
                        return !mesaComenzi.some(mesaComanda => mesaComanda.id_comanda === userComanda.id_comanda);
                    });
    
                    if (updatedUserComenzi.length !== userComenzi.length) {
                        await updateDoc(userDoc.ref, {
                            comenzi: updatedUserComenzi,
                            plata: 0,
                        });
                    }
                }
                mesaComenzi.forEach(comanda => {
                    Object.keys(comanda).forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category].forEach(id => {
                                const preparat = preparateDetails[id];
                                if (preparat) {
                                    totalPretCash += preparat.pret;
                                    totalPretCard += preparat.pret;
                                }
                            });
                        }
                    });
                });
                const newComanda = {
                    comenzi: mesaComenzi,
                    totalPretCash: 0,
                    totalPretCard,
                    dataPlata: timestamp
                };
                await updateDoc(tableDocRef, {
                    comenzi: arrayUnion(newComanda)
                });
                const updatedMesaComenzi = mesaComenzi.map(comanda => {
                    allCategories.forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category] = comanda[category].filter(id => {
                                return !userQuerySnapshot.docs.some(userDoc => {
                                    const userComenzi = userDoc.data().comenzi || [];
                                    return userComenzi.some(userComanda => userComanda.id_comanda === comanda.id_comanda);
                                });
                            });
                        }
                    });
                    return comanda;
                }).filter(comanda => {
                    return allCategories.some(category => Array.isArray(comanda[category]) && comanda[category].length > 0);
                });
    
                await updateDoc(mesaRef, {
                    comenzi: updatedMesaComenzi,
                });
    
                //alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
                
            }
        } catch (error) {
            console.error("Eroare la actualizarea datelor:", error);
        }
    }
    if (selectedOption === "comandaMesei") {
        setSelectedPreparates(mesaComenzi.flatMap(comanda =>
            Object.keys(comanda).flatMap(category =>
                (Array.isArray(comanda[category]) ? comanda[category] : []).map(id => `${comanda.id_comanda}-${category}-${id}`)
            )
        ));
    }
    if (paymentMethod === "custom" && selectedOption === "comandaMesei") {
            setCustomShowMasaPopup(true);
    } else if (selectedOption === "custom") {
        setCustomPlataPopup(true);
    }
    if (updatedComenzi) {
        setUserComenzi(updatedComenzi);
    }
};

const generatePDF = () => {
  const docPDF = new jsPDF();
  const pageHeight = docPDF.internal.pageSize.height;
  const pageWidth = docPDF.internal.pageSize.width;
  const padding = 10;
  const contentWidth = pageWidth - 2 * padding;
  const fontSize = 12;
  const lineHeight = fontSize * 1.5;
  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  let currentY = padding + 20;
  docPDF.setFontSize(16);
  docPDF.text(`Nota de plata pentru masa ${masaId}`, padding, currentY);
  currentY += lineHeight;
  docPDF.setFontSize(fontSize);
  orders.forEach((order, index) => {
    docPDF.text(`Comanda ${index + 1}`, padding, currentY);
    currentY += lineHeight;
    docPDF.text(`Data plasare: ${formatDate(order.dataPlasare)}`, padding, currentY);
    currentY += lineHeight;
    order.comenzi.forEach((comanda) => {
      const formattedText = `${comanda.numePreparat} - ${comanda.cantitate} buc x ${comanda.pret} lei/buc = ${comanda.pret * comanda.cantitate} lei`;
      const splitText = docPDF.splitTextToSize(formattedText, contentWidth);
      splitText.forEach(line => {
        if (currentY + lineHeight > pageHeight - padding) {
          docPDF.addPage();
          currentY = padding;
        }
        docPDF.text(line, padding, currentY);
        currentY += lineHeight;
      });
    });
    currentY += lineHeight;
    docPDF.text(`Total: ${order.totalPret} lei`, padding, currentY);
    currentY += lineHeight;
    docPDF.text(`Metoda plata: ${order.metodaPlata}`, padding, currentY);
    currentY += lineHeight;
  });
  docPDF.text(`Data generarii: ${formattedDate}`, padding, currentY);
  currentY += lineHeight;
  docPDF.save(`NotaPlata_Masa${masaId}.pdf`);
};
  return (
    <Layout>
      <NotaPlataContainer>
        <div>
          <Title>Cereri nota de plata {masaId}</Title>
          <OrdersContainer>
            {orders.map((order, index) => (
              <Order key={index}>
                {order.comenzi.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.aperitive && item.aperitive.length > 0 && <p>Aperitive: {item.aperitive.join(', ')}</p>}
                    {item.bauturi && item.bauturi.length > 0 && <p>Bauturi: {item.bauturi.join(', ')}</p>}
                    {item.desert && item.desert.length > 0 && <p>Desert: {item.desert.join(', ')}</p>}
                    {item.fel_principal && item.fel_principal.length > 0 && <p>Fel Principal: {item.fel_principal.join(', ')}</p>}
                    {item.garnituri && item.garnituri.length > 0 && <p>Garnituri: {item.garnituri.join(', ')}</p>}
                    {item.paste && item.paste.length > 0 && <p>Paste: {item.paste.join(', ')}</p>}
                    {item.pizza && item.pizza.length > 0 && <p>Pizza: {item.pizza.join(', ')}</p>}
                    {item.salate && item.salate.length > 0 && <p>Salate: {item.salate.join(', ')}</p>}
                    {item.supe_ciorbe && item.supe_ciorbe.length > 0 && <p>Supe/Ciorbe: {item.supe_ciorbe.join(', ')}</p>}
                    {<p>ID comanda: {item.id_comanda}</p>}
                    {<p>client: {item.user}</p>}
                  </div>
                ))}
                <p>Data: {formatDate(order.dataPlata)}</p>
                <p>Total Pret Card: {order.totalPretCard}</p>
                <p>Total Pret Cash: {order.totalPretCash}</p>
                <Button onClick={() => sendToHistory(order)}>Trimite în istoric</Button>
                <Button onClick={() => generatePDF()}>
                  Descarcă PDF
                </Button>
              </Order>
            ))}
          </OrdersContainer>
        </div>
      </NotaPlataContainer>
      <Container className="comenzi-container">
                <h2>Comenzi pentru {masaId}</h2>
                <ul>
                    {mesaComenzi.map((comanda, comandaIndex) => {
                        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                        return (
                            <li key={comanda.id_comanda}>
                                {allCategories.map(category => (
                                    <div key={category}>
                                        {Array.isArray(comanda[category]) && comanda[category].map(preparatId => {
                                            const preparatDetails = preparateDetails[preparatId] || {};
                                            return (
                                                <div className="preparat" key={preparatId}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPreparates.includes(`${comanda.id_comanda}-${preparatId}`)}
                                                        onChange={() => handleSelectPreparat(comanda.id_comanda, preparatId)}
                                                    />
                                                    <p>{`${preparatDetails.nume} -` || "Nume preparat necunoscut"}</p>
                                                    <p>{preparatDetails.pret ? `${preparatDetails.pret} RON` : "Pret necunoscut"}</p>
                                                    <span>{comanda.cantitate}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </li>
                        );
                    })}
                </ul>
                <button onClick={handlePlata}>
                    Creare nota de plata
                </button>
                {showPopup && <PaymentPopup onClose={handleClosePopup} onSubmit={handlePaymentSubmit} />}
                {showCustomMasaPopup && <CustomPlataMasa onClose={handleCloseCustomMasaPopup} onSubmit={handlePaymentSubmit} />}
                {showCustomPlataPopup && <CustomPlataCustom onClose={handleCloseCustomPlataPopup} onSubmit={handlePaymentSubmit} />}
            </Container>
    </Layout>
  );
};
export default NotaPlata;