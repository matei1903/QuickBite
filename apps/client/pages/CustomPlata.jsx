import React, { useState, useEffect } from "react";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  color: black;
  
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 100%;
  height: 100px;
  overflow: auto;
`;

const DropArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  background: white;
  width: 40%;
  height: 200px;
  overflow: auto;
`;

const CustomPlata = ({ onClose, onSubmit }) => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState([]);
    const [preparateDetails, setPreparateDetails] = useState({});
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate();
    const [widgets, setWidgets] = useState([]);

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

    const handleOnDrag = (e, widgetType) => {
        e.dataTransfer.setData("widgetType", widgetType);
    };

    const handleOnDrop = (e) => {
        e.preventDefault();
        const widgetType = e.dataTransfer.getData("widgetType");
        console.log("WidgetType", widgetType);
        setWidgets((prevWidgets) => [...prevWidgets, widgetType]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const renderComenzi = (comenzi) => {
        const allCategories = ["aperitive", "fel_principal", "supe_ciorbe", "paste", "pizza", "garnituri", "salate", "desert", "bauturi"];
        return comenzi.map((comanda, index) => (
            <PopupContent key={index} className="order">
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
                                            <li key={itemIndex} draggable onDragStart={(e) => handleOnDrag(e, preparat.nume)}>
                                                <div className="widget" draggable onDragStart={(e) => handleOnDrag(e, preparat.nume)}>
                                                    {preparat.nume} - {preparat.pret} RON
                                                </div>
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
            </PopupContent>
        ));
    };

    return (
        <PopupContainer>
            <div>
                <h2>Comenzile mele</h2>
                {userComenzi.length > 0 ? (
                    renderComenzi(userComenzi)
                ) : (
                    <p>Nu există comenzi de afișat.</p>
                )}
                <DropArea onDrop={handleOnDrop} onDragOver={handleDragOver}>
                    {widgets.length === 0 ? (
                        <p>Trageți și plasați widgeturi aici</p>
                    ) : (
                        widgets.map((widget, index) => (
                            <div className="dropped-widget" key={index}>
                                {widget}
                            </div>
                        ))
                    )}
                </DropArea>
                <button onClick={onClose}>Înapoi</button>
            </div>
        </PopupContainer>
    );
};

export default CustomPlata;
