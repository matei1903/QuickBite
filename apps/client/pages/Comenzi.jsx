import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const Layout = React.lazy(() => import("../Layout.jsx"));

const ColoanaS = styled.div`
    float: left;
    width: 45%;
    padding: 9px;
    border-right: 1px solid black;
    
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
        border: 2px solid #202b1b; /* Culoarea verde inchis pentru bordură */
        outline: none;
        cursor: pointer;
        margin-right: 8px;

        &:checked {
        background-color: #202b1b; /* Culoarea de fundal verde inchis când este selectat */
        border-color: #006400; /* Culoarea bordurii când este selectat */
      }
    }
`;

const ColoanaD = styled.div`
    float: right;
    width: 45%;
    padding: 9px;
    border-left: 1px solid black;
    
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
        border: 2px solid #202b1b; /* Culoarea verde inchis pentru bordură */
        outline: none;
        cursor: pointer;
        margin-right: 8px;

        &:checked {
        background-color: #202b1b; /* Culoarea de fundal verde inchis când este selectat */
        border-color: #006400; /* Culoarea bordurii când este selectat */
      }
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

    const handleSelectPrep = (orderId, itemId) => {
        const isSelected = selectedPrep.includes(itemId);
    
        // Verificăm dacă elementul este deja selectat
        if (isSelected) {
            // Dacă este deja selectat, eliminăm ID-ul din starea selectedPrep
            const updatedSelectedPrep = selectedPrep.filter((id) => id !== itemId);
            setSelectedPrep(updatedSelectedPrep);
        } else {
            // Dacă nu este selectat, îl adăugăm în selectedPrep
            setSelectedPrep((prevSelectedPrep) => [...prevSelectedPrep, itemId]);
        }
    
        // Identificăm echivalentul în cealaltă coloană și actualizăm starea selecției
        const equivalentComenzi = orderId < userComenzi.length ? mesaComenzi : userComenzi;
        const equivalentOrderId = orderId < userComenzi.length ? orderId : orderId - userComenzi.length;
    
        if (equivalentComenzi[equivalentOrderId]) {
            const equivalentItems = equivalentComenzi[equivalentOrderId];
            const foundItem = Object.values(equivalentItems).flat().find(id => id === itemId);
            if (foundItem) {
                const equivalentItemId = foundItem; // IDs should be the same in both collections
                // Verificăm dacă echivalentul este deja selectat
                const isEquivalentSelected = selectedPrep.includes(equivalentItemId);
                // Dacă echivalentul este deja selectat, eliminăm ID-ul din starea selectedPrep
                if (isEquivalentSelected) {
                    const updatedSelectedPrep = selectedPrep.filter((id) => id !== equivalentItemId);
                    setSelectedPrep(updatedSelectedPrep);
                } else {
                    // Dacă nu este selectat, îl adăugăm în selectedPrep
                    setSelectedPrep((prevSelectedPrep) => [...prevSelectedPrep, equivalentItemId]);
                }
            }
        }
    };

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
                                const uniqueId = `${orderIndex}-${itemIndex}-${id}`;
                                const preparat = preparateDetails[id];
                                return preparat ? (
                                    <li key={uniqueId}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPrep.includes(uniqueId)}
                                            onChange={() => handleSelectPrep(orderIndex, itemIndex, id)}
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
        </Layout>
    );
};

export default Comenzi;
