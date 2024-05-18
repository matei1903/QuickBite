import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
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
`;

const Comenzi = () => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState(null);
    const [userComenzi_masa, setUserComenziMasa] = useState(null);
    const [preparateDetails, setPreparateDetails] = useState({});
    const [preparateDetails_masa, setPreparateDetailsMasa] = useState({});
    const userID = localStorage.getItem('userID');
    const [selectedPrep, setSelectedPrep] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    const handleSelectPrep = (itemId) => {
        if (selectedPrep.includes(itemId)) {
            // Deselect item
            setSelectedPrep(selectedPrep.filter((id) => id !== itemId));
        } else {
            // Select item
            setSelectedPrep([...selectedPrep, itemId]);
        }
    };

    useEffect(() => {
        // Verifică dacă există o masă selectată în localStorage la încărcarea componentei
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

                    // Fetch details for each preparat from the correct collection
                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    const preparatePromises = comenzi.flatMap(comanda =>
                        allCategories.flatMap(category =>
                            (comanda[category] || []).map(async id => {
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
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };

        fetchComenzi();
    }, [db, userID]);

    useEffect(() => {
        const fetchComenzi_masa = async () => {
            try {
                const userDocRef_masa = doc(db, "comenzi", `masa${selectedTable}`);
                const userDocSnapshot_masa = await getDoc(userDocRef_masa);
                if (userDocSnapshot_masa.exists()) {
                    const comenzi_masa = userDocSnapshot_masa.data().comenzi || [];
                    setUserComenziMasa(comenzi_masa);

                    // Fetch details for each preparat from the correct collection
                    const allCategories_masa = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    const preparatePromises_masa = comenzi_masa.flatMap(comanda =>
                        allCategories_masa.flatMap(category =>
                            (comanda[category] || []).map(async id => {
                                const preparatDocRef_masa = doc(db, category, id);
                                const preparatDocSnapshot_masa = await getDoc(preparatDocRef_masa);
                                return { id, ...preparatDocSnapshot_masa.data() };
                            })
                        )
                    );

                    const preparate_masa = await Promise.all(preparatePromises_masa);
                    const preparateMap_masa = preparate_masa.reduce((acc, preparat) => {
                        acc[preparat.id] = preparat;
                        return acc;
                    }, {});

                    setPreparateDetailsMasa(preparateMap_masa);
                }
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };

        fetchComenzi_masa();
    }, [db, userID]);

    const renderComenzi = (comenzi) => {
        return Object.keys(comenzi).map((categorie) => {
            if (comenzi[categorie].length > 0) {
                return (
                    <div key={categorie}>
                        <h3>{categorie}</h3>
                        <ul>
                            {comenzi[categorie].map((id) => {
                                const preparat = preparateDetails[id];
                                return preparat ? (
                                    <li key={id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPrep.includes(id)}
                                            onChange={() => handleSelectPrep(id)}
                                        />
                                        {preparat.nume} - {preparat.pret} RON
                                    </li>
                                ) : (
                                    <li key={id}>Loading...</li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }
            return null;
        });
    };
    const renderComenziMasa = (comenzi) => {
        return Object.keys(comenzi).map((categorie) => {
            if (comenzi[categorie].length > 0) {
                return (
                    <div key={categorie}>
                        <h3>{categorie}</h3>
                        <ul>
                            {comenzi[categorie].map((id) => {
                                const preparat_masa = preparateDetails_masa[id];
                                return preparat_masa ? (
                                    <li key={id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPrep.includes(id)}
                                            onChange={() => handleSelectPrep(id)}
                                        />
                                        {preparat_masa.nume} - {preparat_masa.pret} RON
                                        <br />
                                    comandat de: {preparat_masa.user}
                                    </li>
                                ) : (
                                    <li key={id}>Loading...</li>
                                );
                            
                           })}
                        </ul>
                            
                    </div>
                    
                );
            }
            return null;
        });
    };

    return (
        <Layout>
            <ColoanaS>
                <h2>Comenzile mele</h2>
                {userComenzi && userComenzi.map((comanda, index) => (
                    <div key={index}>
                        {renderComenzi(comanda)}
                    </div>
                ))}
            </ColoanaS>
            <ColoanaD>
                <h2>Comenzile mesei</h2>
                {userComenzi_masa && userComenzi_masa.map((comanda, index) => (
                    <div key={index}>
                        {renderComenziMasa(comanda)}
                    </div>
                    ))}
            </ColoanaD>
        </Layout>
    );
};

export default Comenzi;
