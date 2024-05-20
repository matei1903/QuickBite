import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import PaymentPopup from "./Plata";
import { useNavigate } from 'react-router-dom';

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

    const handlePaymentSubmit = (selectedOption, paymentMethod) => {
        if (selectedOption === "comandaMea") {
            // Selectează toate preparatele din coloanaS
            setSelectedPrep(userComenzi.flatMap(comanda =>
                Object.keys(comanda).flatMap(category =>
                    (Array.isArray(comanda[category]) ? comanda[category] : []).map(id => `${comanda.id_comanda}-${category}-${id}`)
                )
            ));
        } else if (selectedOption === "comandaMesei") {
            // Selectează toate preparatele din coloanaD
            setSelectedPrep(mesaComenzi.flatMap(comanda =>
                Object.keys(comanda).flatMap(category =>
                    (Array.isArray(comanda[category]) ? comanda[category] : []).map(id => `${comanda.id_comanda}-${category}-${id}`)
                )
            ));
        }
        if (paymentMethod === "custom") {
            alert(`Opțiunea de plată selectată: ${selectedOption}, Metodă de plată: ${paymentMethod}`);
            navigate('/comenzi');
        } else {
            alert(`Opțiunea de plată selectată: ${selectedOption}, Metodă de plată: ${paymentMethod}`);
        }
        setShowPopup(false);
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
        </Layout>
    );
};
export default Comenzi;