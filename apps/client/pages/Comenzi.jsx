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
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const [selectedPrep, setSelectedPrep] = useState([]);

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
                                    <li 
                                    key={id} 
                                    type="checkbox"
                                    checked={selectedPrep.includes(id.id)}
                                    onChange={() => handleSelectPrep(id.id)}>
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
                {/* Similar, afișează comenzile mesei aici */}
            </ColoanaD>
        </Layout>
    );
};

export default Comenzi;
