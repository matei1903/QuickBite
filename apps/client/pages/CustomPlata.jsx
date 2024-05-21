import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const CustomPlata = ({ onClose, onSubmit }) => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');

    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const comenzi = userDocSnapshot.data().comenzi || [];
                    setUserComenzi(comenzi);

                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    const preparatePromises = comenzi.flatMap(comanda =>
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
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };

        fetchComenzi();
    }, [db, userID]);

    const renderComenzi = (comenzi) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return comenzi.map((comanda, index) => (
            <div key={index} className="order">
                <h3>Comanda {index + 1}</h3>
                {allCategories.map((categorie) => {
                    const items = comanda[categorie];
                    if (Array.isArray(items) && items.length > 0) {
                        return (
                            <div key={categorie}>
                                <h4>{categorie}</h4>
                                <ul>
                                    {items.map((id, itemIndex) => {
                                        const preparat = preparateDetails[id];
                                        return preparat ? (
                                            <li key={itemIndex}>
                                                {preparat.nume} - {preparat.pret} RON
                                            </li>
                                        ) : (
                                            <li key={itemIndex}>Loading...</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                })}
                <p>Comandat de: {comanda.user}</p>
            </div>
        ));
    };

    return (
        <div>
            <h2>Comenzile mele</h2>
            {userComenzi.length > 0 ? (
                renderComenzi(userComenzi)
            ) : (
                <p>Nu există comenzi de afișat.</p>
            )}
            <button onClick={onClose}>Înapoi</button>
        </div>
    );
};

export default CustomPlata;
