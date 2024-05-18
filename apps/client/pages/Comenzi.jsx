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


const comenzi = () => {
    const { db } = useFirebase();
    const [userComenzi, setUserComenzi] = useState(null);
    const userID = localStorage.getItem('userID');
    useEffect(() => {
        const fetchComenzi = async () => {
            try {
                const userDocRef = doc(db, "users", userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUserComenzi(userDocSnapshot.data().comenzi || []);
                }
            } catch (error) {
                console.error("Eroare la încărcarea comenzilor:", error);
            }
        };

        fetchComenzi();
    }, [userID]);
    const renderComenzi = (comenzi) => {
        return Object.keys(comenzi).map((categorie) => {
            if (comenzi[categorie].length > 0) {
                return (
                    <div key={categorie}>
                        <h3>{categorie}</h3>
                        <ul>
                            {comenzi[categorie].map((id) => (
                                <li key={id}>{id}</li>
                            ))}
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

export default comenzi;