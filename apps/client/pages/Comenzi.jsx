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

    
    useEffect(() => {
        const tableFromStorage = localStorage.getItem('selectedTable');
        if (tableFromStorage) {
            setSelectedTable(parseInt(tableFromStorage));
        }
    }, []);

    const handleSelectPrep = (orderIndex, itemIndex, id, isUserOrder) => {
        const uniqueId = `${orderIndex}-${itemIndex}-${id}`;
        const preparat = preparateDetails[id];
    
        // Verificăm dacă comanda este a utilizatorului sau a mesei
        const comanda = isUserOrder ? userComenzi[orderIndex] : mesaComenzi[orderIndex - userComenzi.length];
    
        // Găsim comanda echivalentă în funcție de id_comanda
        const otherComanda = isUserOrder ? mesaComenzi.find(com => com.id_comanda === comanda.id_comanda) : userComenzi.find(com => com.id_comanda === comanda.id_comanda);
    
        if (!preparat || !otherComanda) return;
    
        // Verificăm dacă preparatul selectat este în comanda curentă și obținem echivalentul
        const equivalentPrepId = comanda && comanda[preparat.category] && comanda[preparat.category].find(otherId => otherId !== id);
    
        // Dacă găsim un echivalent, actualizăm selecția
        if (equivalentPrepId) {
            const otherPreparat = preparateDetails[equivalentPrepId];
            setSelectedPrep(prevSelectedPrep => {
                // Dacă preparatul echivalent este deja selectat, eliminăm selecția
                if (prevSelectedPrep.includes(uniqueId) && prevSelectedPrep.includes(`${orderIndex}-${otherComanda[preparat.category].indexOf(equivalentPrepId)}-${equivalentPrepId}`)) {
                    return prevSelectedPrep.filter(item => item !== uniqueId && item !== `${orderIndex}-${otherComanda[preparat.category].indexOf(equivalentPrepId)}-${equivalentPrepId}`);
                }
                // Altfel, adăugăm ambele selecții
                return [...prevSelectedPrep, uniqueId, `${orderIndex}-${otherComanda[preparat.category].indexOf(equivalentPrepId)}-${equivalentPrepId}`];
            });
        } else {
            // Dacă nu există un preparat echivalent în comanda curentă, doar actualizăm selecția pentru preparatul curent
            setSelectedPrep(prevSelectedPrep => {
                if (prevSelectedPrep.includes(uniqueId)) {
                    return prevSelectedPrep.filter(item => item !== uniqueId);
                }
                return [...prevSelectedPrep, uniqueId];
            });
        }
    };
    

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
                                            onChange={() => handleSelectPrep(orderIndex, itemIndex, id, isUserOrder)}
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
