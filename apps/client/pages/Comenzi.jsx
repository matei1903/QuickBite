import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import PaymentPopup from "./Plata";
import CustomPlata from "./CustomPlata";
import CustomPlataMasa from "./CustomPlataMasa";
import CustomPlataCustom from "./CustomPlataCustom";
import { useNavigate } from 'react-router-dom';

const Layout = React.lazy(() => import("../Layout.jsx"));
const ColoanaS = styled.div`
    float: left;
    width: 45%;
    padding: 9px;
    border: 1px solid black;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
    background-color: #9f9a8c;
    color: #191919;
    
    h2 {
        text-align: center;
        border-bottom: 2px solid black;
    }
    input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #202b1b;
        outline: none;
        cursor: pointer;
        margin-right: 8px;
        &:checked {
        background-color: #202b1b;
        border-color: #006400;
      }
    }
`;
const ColoanaD = styled.div`
    float: right;
    width: 45%;
    padding: 9px;
    background-color: #9f9a8c;
    border: 1px solid black;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
    color: #191919;
    
    h2 {
        text-align: center;
        border-bottom: 2px solid black;
    }
    input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #202b1b;
        outline: none;
        cursor: pointer;
        margin-right: 8px;
        &:checked {
        background-color: #202b1b;
        border-color: #006400;
      }
    }
`;
const Button = styled.button`
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    padding: 5px;
    text-align: center;
    position: fixed;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width:150px;
    border-radius: 20px;
    background-color: #53624d;
    color: #ecebed;
    font-size:18px;
    border: none;
    outline: 2px solid black;
    &:disabled {
        background-color: #869182;
        color: #323232;
}
`;
const Comenzi = () => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const [selectedPrep, setSelectedPrep] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [mesaComenzi, setMesaComenzi] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showCustomPopup, setCustomShowPopup] = useState(false);
    const [showCustomMasaPopup, setCustomShowMasaPopup] = useState(false);
    const [showCustomPlataPopup, setCustomPlataPopup] = useState(false);
    
    const navigate = useNavigate();
    useEffect(() => {
        const tableFromStorage = localStorage.getItem('selectedTable');
        if (tableFromStorage) {
            setSelectedTable(parseInt(tableFromStorage));
        }
    }, []);
    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const comenzi = userDocSnapshot.data().comenzi || [];
                    setUserComenzi(comenzi);
                    const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
                    const mesaSnapshot = await getDoc(mesaRef);
                    if (mesaSnapshot.exists()) {
                        const mesaComenzi = mesaSnapshot.data().comenzi || [];
                        setMesaComenzi(mesaComenzi);
                        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                        const preparatePromises = [...comenzi, ...mesaComenzi].flatMap(comanda =>
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
                    }
                }
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };
        if (selectedTable !== null) {
            fetchComenzi();
        }
    }, [db, userID, selectedTable]);
    const handleSelectPrep = (uniqueId, id, idComanda) => {
        setSelectedPrep((prevSelectedPrep) => {
            const isSelected = prevSelectedPrep.includes(uniqueId);
            let newSelectedPrep = isSelected
                ? prevSelectedPrep.filter((id) => id !== uniqueId)
                : [...prevSelectedPrep, uniqueId];
            if (!isSelected) {
                const correspondingComanda = mesaComenzi.find(comanda => comanda.id_comanda === idComanda) ||
                    userComenzi.find(comanda => comanda.id_comanda === idComanda);
                if (correspondingComanda) {
                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    allCategories.forEach(category => {
                        if (Array.isArray(correspondingComanda[category])) {
                            correspondingComanda[category].forEach(prepId => {
                                if (prepId === id) {
                                    const corrUniqueId = `${idComanda}-${category}-${prepId}`;
                                    if (!newSelectedPrep.includes(corrUniqueId)) {
                                        newSelectedPrep.push(corrUniqueId);
                                    }
                                }
                            });
                        }
                    });
                }
            }
            return newSelectedPrep;
        });
    };
    const handlePlata = () => {
        setShowPopup(true);
    };
    const handleClosePopup = () => {
        setShowPopup(false);
    };
    const handleCloseCustomPopup = () => {
        setCustomShowPopup(false);
    };
    const handleCloseCustomMasaPopup = () => {
        setCustomShowMasaPopup(false);
    };
    const handleCloseCustomPlataPopup = () => {
        setCustomPlataPopup(false);
    };

    const handlePaymentSubmit = async (selectedOption, paymentMethod, updatedComenzi) => {
        const tableDocRef = doc(db, "comenzi_inter", `masa${selectedTable}`);
        const timestamp = new Date();
    
        if (selectedOption === "comandaMea" && paymentMethod === "cash") {
            try {
                // Adaugă comenzile utilizatorului la câmpul "comenzi"
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userComenzi = userDocSnapshot.data().comenzi || [];
    
                    // Calculează prețul total pentru numerar și card
                    let totalPretCash = 0;
                    let totalPretCard = 0;
    
                    userComenzi.forEach(comanda => {
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
    
                    // Creează obiectul comenzii
                    const newComanda = {
                        comenzi: userComenzi,
                        totalPretCash,
                        totalPretCard: 0,
                        dataPlata: timestamp
                    };
    
                    // Actualizează documentul mesei
                    await updateDoc(tableDocRef, {
                        comenzi: arrayUnion(newComanda)
                    });
    
                    // Șterge comenzile din documentul mesei
                    const mesaDocRef = doc(db, "comenzi", `masa${selectedTable}`);
                    const mesaSnapshot = await getDoc(mesaDocRef);
                    if (mesaSnapshot.exists()) {
                        const mesaComenzi = mesaSnapshot.data().comenzi || [];
                        const filteredMesaComenzi = mesaComenzi.filter(mesaComanda => 
                            !userComenzi.some(userComanda => userComanda.id_comanda === mesaComanda.id_comanda)
                        );
                        await setDoc(mesaDocRef, { comenzi: filteredMesaComenzi });
                    }
    
                    // Șterge comenzile din documentul utilizatorului
                    await updateDoc(userDocRef, {
                        comenzi: [],
                        plata: 0
                    });
                }
            } catch (error) {
                console.error("Eroare la actualizarea comenzii mesei:", error);
            }
        }

        if (selectedOption === "comandaMea" && paymentMethod === "card") {
            try {
                // Adaugă comenzile utilizatorului la câmpul "comenzi"
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userComenzi = userDocSnapshot.data().comenzi || [];
    
                    // Calculează prețul total pentru numerar și card
                    let totalPretCash = 0;
                    let totalPretCard = 0;
    
                    userComenzi.forEach(comanda => {
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
    
                    // Creează obiectul comenzii
                    const newComanda = {
                        comenzi: userComenzi,
                        totalPretCash: 0,
                        totalPretCard,
                        dataPlata: timestamp
                    };
    
                    // Actualizează documentul mesei
                    await updateDoc(tableDocRef, {
                        comenzi: arrayUnion(newComanda)
                    });
    
                    // Șterge comenzile din documentul mesei
                    const mesaDocRef = doc(db, "comenzi", `masa${selectedTable}`);
                    const mesaSnapshot = await getDoc(mesaDocRef);
                    if (mesaSnapshot.exists()) {
                        const mesaComenzi = mesaSnapshot.data().comenzi || [];
                        const filteredMesaComenzi = mesaComenzi.filter(mesaComanda => 
                            !userComenzi.some(userComanda => userComanda.id_comanda === mesaComanda.id_comanda)
                        );
                        await setDoc(mesaDocRef, { comenzi: filteredMesaComenzi });
                    }
    
                    // Șterge comenzile din documentul utilizatorului
                    await updateDoc(userDocRef, {
                        comenzi: [],
                        plata: 0
                    });
                }
            } catch (error) {
                console.error("Eroare la actualizarea comenzii mesei:", error);
            }
        }

        if (selectedOption === "comandaMesei" && paymentMethod === "cash") {
            try {
                const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
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
        
                    alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
                    
                }
            } catch (error) {
                console.error("Eroare la actualizarea datelor:", error);
            }
        }
        
        if (selectedOption === "comandaMesei" && paymentMethod === "card") {
            try {
                const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);
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
        
                    alert(`Suma de plată pentru card: ${totalCard} RON\nSuma de plată pentru cash: ${totalCash} RON`);
                    
                }
            } catch (error) {
                console.error("Eroare la actualizarea datelor:", error);
            }
        }
    
        if (selectedOption === "comandaMea") {
            setSelectedPrep(userComenzi.flatMap(comanda =>
                Object.keys(comanda).flatMap(category =>
                    (Array.isArray(comanda[category]) ? comanda[category] : []).map(id => `${comanda.id_comanda}-${category}-${id}`)
                )
            ));
        } else if (selectedOption === "comandaMesei") {
            setSelectedPrep(mesaComenzi.flatMap(comanda =>
                Object.keys(comanda).flatMap(category =>
                    (Array.isArray(comanda[category]) ? comanda[category] : []).map(id => `${comanda.id_comanda}-${category}-${id}`)
                )
            ));
        }
    
        if (paymentMethod === "custom" && selectedOption === "comandaMea") {
            setCustomShowPopup(true);
        } else if (paymentMethod === "custom" && selectedOption === "comandaMesei") {
            setCustomShowMasaPopup(true);
        } else if (selectedOption === "custom") {
            setCustomPlataPopup(true);
        } else {
            alert(`Opțiunea de plată selectată: ${selectedOption}, Metodă de plată: ${paymentMethod}`);
        }
        setShowPopup(false);
    
        if (updatedComenzi) {
            setUserComenzi(updatedComenzi);
        }
    };
    
    
    const renderComenzi = (comenzi, orderIndex, isUserOrder) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return allCategories.map((categorie) => {
            const items = comenzi[categorie];
            if (Array.isArray(items) && items.length > 0) {
                return (
                    <div key={categorie}>
                        <h3>{categorie}</h3>
                        <ul>
                            {items.map((id, itemIndex) => {
                                const uniqueId = `${comenzi.id_comanda}-${categorie}-${id}`;
                                const preparat = preparateDetails[id];
                                return preparat ? (
                                    <li key={uniqueId}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPrep.includes(uniqueId)}
                                            onChange={() => handleSelectPrep(uniqueId, id, comenzi.id_comanda)}
                                        />
                                        {preparat.nume} - {preparat.pret} RON
                                    </li>
                                ) : (
                                    <li key={uniqueId}>Loading...</li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }
            return null;
        }).concat(
            <div key={`user-${orderIndex}`}>
                <p>Comandat de: {comenzi.user}</p>
            </div>
        );
    };
    return (
        <Layout>
            <ColoanaS>
                <h2>Comenzile mele</h2>
                {userComenzi && userComenzi.map((comanda, index) => (
                    <div key={index}>
                        {renderComenzi(comanda, index, true)}
                    </div>
                ))}
            </ColoanaS>
            <ColoanaD>
                <h2>Comenzile mesei</h2>
                {mesaComenzi && mesaComenzi.map((comanda, index) => (
                    <div key={index}>
                        {renderComenzi(comanda, userComenzi.length + index, false)}
                    </div>
                ))}
            </ColoanaD>
            <Button className="plateste" onClick={handlePlata} disabled={selectedPrep.length === 0}>Plateste</Button>
            {showPopup && <PaymentPopup onClose={handleClosePopup} onSubmit={handlePaymentSubmit} />}
            {showCustomPopup && <CustomPlata onClose={handleCloseCustomPopup} onSubmit={handlePaymentSubmit} />}
            {showCustomMasaPopup && <CustomPlataMasa onClose={handleCloseCustomMasaPopup} onSubmit={handlePaymentSubmit} />}
            {showCustomPlataPopup && <CustomPlataCustom onClose={handleCloseCustomPlataPopup} onSubmit={handlePaymentSubmit} />}
        </Layout>
    );
};
export default Comenzi;