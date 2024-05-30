import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import Layout from "../Layout.jsx";
import styled from "styled-components";

const Container = styled.div`

width: 30%;
margin-left: auto;
margin-right: auto;
text-align: justify;
border: 1px solid black;
margin-top: 30px;
height: 600px;
overflow: auto;
box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
background-color: #6f6b62;
font-family: "Google Sans",Roboto,Arial,sans-serif;
color: #191919;

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
    left: 50%;
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

const Comenzi = () => {
    const { db } = useFirebase();
    const { masa } = useParams();
    const [mesaComenzi, setMesaComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const [selectedPreparates, setSelectedPreparates] = useState([]);

    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const mesaRef = doc(db, "comenzi", masa);
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
    }, [db, masa]);

    const handleSelectPreparat = (id_comanda, preparatId) => {
        const uniqueId = `${id_comanda}-${preparatId}`;
        setSelectedPreparates((prevSelected) =>
            prevSelected.includes(uniqueId)
                ? prevSelected.filter(id => id !== uniqueId)
                : [...prevSelected, uniqueId]
        );
    };

    const handleDeletePreparates = async () => {
        try {
            const mesaRef = doc(db, "comenzi", masa);
            const mesaSnapshot = await getDoc(mesaRef);
            if (mesaSnapshot.exists()) {
                const updatedComenzi = mesaSnapshot.data().comenzi.map(comanda => {
                    const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
                    allCategories.forEach(category => {
                        if (Array.isArray(comanda[category])) {
                            comanda[category] = comanda[category].filter(id => !selectedPreparates.includes(`${comanda.id_comanda}-${id}`));
                        }
                    });

                    const hasPreparates = allCategories.some(category => Array.isArray(comanda[category]) && comanda[category].length > 0);
                    return hasPreparates ? comanda : null;
                }).filter(comanda => comanda !== null);

                await updateDoc(mesaRef, { comenzi: updatedComenzi });
                setMesaComenzi(updatedComenzi);
                setSelectedPreparates([]);
            }
        } catch (error) {
            console.error("Eroare la ștergerea preparatelor:", error);
        }
    };

    return (
        <Layout>
            <Container className="comenzi-container">
                <h2>Comenzi pentru {masa}</h2>
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
                <button onClick={handleDeletePreparates} disabled={selectedPreparates.length === 0}>
                    Șterge preparatele selectate
                </button>
            </Container>
        </Layout>
    );
};

export default Comenzi;
