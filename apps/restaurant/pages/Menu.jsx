import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import Popup from "./Popup";
import { useNavigate } from 'react-router-dom';
const Layout = React.lazy(() => import("../Layout.jsx"));

const StyledHome = styled.div`
  h1 {
    color: #dfc780;
    text-align: center;
    font-family: fantasy;
  }
  h2 {
    font-family: fantasy;
    font-align: left;
    color: #191919;
    padding: 10px;
  }
  .test {
    color: grey;
    float: right;
    
  }
  .alimente-container {
    background-color: #ddddd6;
    width: 90%;
    margin: 0 auto;
  }
  .alimente {
    text-align: left;
    background-color: #ddddd6;
    color: #191919;
    padding: 10px;
    font-size:18px;
    
  }
  .comanda {
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
  }
  .comanda:disabled {
    background-color: #625546;
    color: #323232;
  }
  .plateste {
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
  }
  .plateste:disabled {
    background-color: #869182;
    color: #323232;
  }
  .ingrediente {
    text-align: left;
    color: #7e7e7e;
    padding: 10px;
    font-size:12px;
  }
  .pret {
    text-align: right;
    color: #191919;
    padding: 10px;
    font-size:14px;
  }
  .gramaj {
    text-align: left;
    color: #191919;
    padding: 10px;
    font-size:14px;
  }
  input[type=text] {
    background-color: #ddddd6;
    background-image: url('https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/Search--Streamline-Guidance.svg?alt=media&token=7358a974-9292-48d9-8ff7-085957390929');
    background-size: 20px; 
    background-position: 10px center; 
    background-repeat: no-repeat;
    padding-left: 35px;
    width: 110px; 
    height: 40px;
    margin: 10px;
    border: 1px solid;
  }
  input:focus {
    outline: none;
    border: 3px solid;
    border-color: #202b1b;
  }
  .masa {
    width: 100px;
    margin: 10px;
    color: black;
    border: 1px solid;
    padding: 5px;
    border-radius: 10em;
  }
  .select_masa {
    background-color: #18283b;
    color: #dfc780;
    border-radius: 10em;
    font-size: 15px;
    font-weight: 600;
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    padding: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border: 1px solid black;
    box-shadow: 0 0 0 0 black;
  }
`;
const StyledCheckbox = styled.input`
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
`;

const StyledDiv = styled.div`
  .alimente {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
`;


const Menu = () => {
    const navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    useEffect(() => {
        // Verifică dacă există o masă selectată în localStorage la încărcarea componentei
        const tableFromStorage = localStorage.getItem('selectedTable');
        if (tableFromStorage) {
            setSelectedTable(parseInt(tableFromStorage));
        }
    }, []);

    const openPopup = () => {
        setIsPopupOpen(true);
    };
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleTableSelect = (tableNumber) => {
        setSelectedTable(tableNumber);
        localStorage.setItem('selectedTable', tableNumber.toString());
    };

    const { db } = useFirebase();
    const [docs_aper, setDocs_aper] = useState([]);
    const [docs_fp, setDocs_fp] = useState([]);
    const [docs_sp, setDocs_sp] = useState([]);
    const [docs_pas, setDocs_pas] = useState([]);
    const [docs_piz, setDocs_piz] = useState([]);
    const [docs_gar, setDocs_gar] = useState([]);
    const [docs_sal, setDocs_sal] = useState([]);
    const [docs_des, setDocs_des] = useState([]);
    const [docs_ba, setDocs_ba] = useState([]);

    const [filteredDocs_aper, setFilteredDocs_aper] = useState([]);
    const [filteredDocs_fp, setFilteredDocs_fp] = useState([]);
    const [filteredDocs_sp, setFilteredDocs_sp] = useState([]);
    const [filteredDocs_pas, setFilteredDocs_pas] = useState([]);
    const [filteredDocs_piz, setFilteredDocs_piz] = useState([]);
    const [filteredDocs_gar, setFilteredDocs_gar] = useState([]);
    const [filteredDocs_sal, setFilteredDocs_sal] = useState([]);
    const [filteredDocs_des, setFilteredDocs_des] = useState([]);
    const [filteredDocs_ba, setFilteredDocs_ba] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelect = (itemId) => {
        if (selectedItems.includes(itemId)) {
            // Deselect item
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            // Select item
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleComanda = async () => {
        const userID = localStorage.getItem('userID');


        if (!selectedTable) {
            alert("Nu a fost selectată nicio masă. Vă rugăm să selectați o masă.");
            return;
        }

        console.log("userID:", userID);

        try {
            const mesaRef = doc(db, "comenzi", `masa${selectedTable}`);

            console.log("selectedItems:", selectedItems);

            // Creează obiectul cu comenzile selectate
            const newComandaID = uuidv4();
            const newComenzi = {
                id_comanda: newComandaID,
                aperitive: selectedItems.filter((id) => docs_aper.map((doc) => doc.id).includes(id)),
                fel_principal: selectedItems.filter((id) => docs_fp.map((doc) => doc.id).includes(id)),
                supe_ciorbe: selectedItems.filter((id) => docs_sp.map((doc) => doc.id).includes(id)),
                paste: selectedItems.filter((id) => docs_pas.map((doc) => doc.id).includes(id)),
                pizza: selectedItems.filter((id) => docs_piz.map((doc) => doc.id).includes(id)),
                garnituri: selectedItems.filter((id) => docs_gar.map((doc) => doc.id).includes(id)),
                salate: selectedItems.filter((id) => docs_sal.map((doc) => doc.id).includes(id)),
                desert: selectedItems.filter((id) => docs_des.map((doc) => doc.id).includes(id)),
                bauturi: selectedItems.filter((id) => docs_ba.map((doc) => doc.id).includes(id)),
            };

            console.log("newComenzi:", newComenzi);

            const newComandaWithUser = {
                ...newComenzi,
                user: "Chelner" // Adaugă emailul utilizatorului sau alt identificator
            };

            // Verifică dacă comenzi există deja în document
            const mesaSnapshot = await getDoc(mesaRef);
            if (!mesaSnapshot.exists()) {
                await setDoc(mesaRef, { comenzi: [newComandaWithUser] });
            } else {
                await updateDoc(mesaRef, {
                    comenzi: arrayUnion(newComandaWithUser) // Adăugați noile comenzi într-un array existent de comenzi al mesei
                });
            }

            // Alertă pentru succes
            alert("Comanda a fost plasată cu succes!");
            navigate('/');
            // Resetează selecțiile după plasarea comenzii
            setSelectedItems([]);
        } catch (error) {
            console.error("Eroare la plasarea comenzii:", error);
            // Alertă pentru eroare
            alert("A apărut o eroare la plasarea comenzii. Vă rugăm să încercați din nou mai târziu.");
        }
    };


    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/aperitive"), orderBy("nume")),
            (qs) => {
                const _docs_aper = [];
                qs.forEach((doc) => {
                    _docs_aper.push({ ...doc.data(), id: doc.id });
                });
                setDocs_aper(_docs_aper);
                setFilteredDocs_aper(_docs_aper);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_aper(docs_aper);
        } else {
            const filtered = docs_aper.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_aper(filtered);
        }
    }, [searchTerm, docs_aper]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/fel_principal"), orderBy("nume")),
            (qs) => {
                const _docs_fp = [];
                qs.forEach((doc) => {
                    _docs_fp.push({ ...doc.data(), id: doc.id });
                });
                setDocs_fp(_docs_fp);
                setFilteredDocs_fp(_docs_fp);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_fp(docs_fp);
        } else {
            const filtered = docs_fp.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_fp(filtered);
        }
    }, [searchTerm, docs_fp]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/supe_ciorbe"), orderBy("nume")),
            (qs) => {
                const _docs_sp = [];
                qs.forEach((doc) => {
                    _docs_sp.push({ ...doc.data(), id: doc.id });
                });
                setDocs_sp(_docs_sp);
                setFilteredDocs_sp(_docs_sp);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_sp(docs_sp);
        } else {
            const filtered = docs_sp.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_sp(filtered);
        }
    }, [searchTerm, docs_sp]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/paste"), orderBy("nume")),
            (qs) => {
                const _docs_pas = [];
                qs.forEach((doc) => {
                    _docs_pas.push({ ...doc.data(), id: doc.id });
                });
                setDocs_pas(_docs_pas);
                setFilteredDocs_pas(_docs_pas);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_pas(docs_pas);
        } else {
            const filtered = docs_pas.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_pas(filtered);
        }
    }, [searchTerm, docs_pas]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/pizza"), orderBy("nume")),
            (qs) => {
                const _docs_piz = [];
                qs.forEach((doc) => {
                    _docs_piz.push({ ...doc.data(), id: doc.id });
                });
                setDocs_piz(_docs_piz);
                setFilteredDocs_piz(_docs_piz);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_piz(docs_piz);
        } else {
            const filtered = docs_piz.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_piz(filtered);
        }
    }, [searchTerm, docs_piz]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/garnituri"), orderBy("nume")),
            (qs) => {
                const _docs_gar = [];
                qs.forEach((doc) => {
                    _docs_gar.push({ ...doc.data(), id: doc.id });
                });
                setDocs_gar(_docs_gar);
                setFilteredDocs_gar(_docs_gar);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_gar(docs_gar);
        } else {
            const filtered = docs_gar.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_gar(filtered);
        }
    }, [searchTerm, docs_gar]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/salate"), orderBy("nume")),
            (qs) => {
                const _docs_sal = [];
                qs.forEach((doc) => {
                    _docs_sal.push({ ...doc.data(), id: doc.id });
                });
                setDocs_sal(_docs_sal);
                setFilteredDocs_sal(_docs_sal);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_sal(docs_sal);
        } else {
            const filtered = docs_sal.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_sal(filtered);
        }
    }, [searchTerm, docs_sal]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/desert"), orderBy("nume")),
            (qs) => {
                const _docs_des = [];
                qs.forEach((doc) => {
                    _docs_des.push({ ...doc.data(), id: doc.id });
                });
                setDocs_des(_docs_des);
                setFilteredDocs_des(_docs_des);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_des(docs_des);
        } else {
            const filtered = docs_des.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_des(filtered);
        }
    }, [searchTerm, docs_des]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "/bauturi"), orderBy("nume")),
            (qs) => {
                const _docs_ba = [];
                qs.forEach((doc) => {
                    _docs_ba.push({ ...doc.data(), id: doc.id });
                });
                setDocs_ba(_docs_ba);
                setFilteredDocs_ba(_docs_ba);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredDocs_ba(docs_ba);
        } else {
            const filtered = docs_ba.filter((doc) =>
                doc.nume.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocs_ba(filtered);
        }
    }, [searchTerm, docs_ba]);

    return (
        <Layout>
            <StyledHome>
                <h1>Meniu</h1>
                <div className="alimente-container">
                    <input
                        type="text"
                        placeholder="Caută după nume..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="select_masa" onClick={openPopup}>Selectează masă</button>
                    {isPopupOpen && <Popup onSelect={handleTableSelect} onClose={closePopup} />}
                    {selectedTable && <label className="masa">Numărul mesei: {selectedTable}</label>}
                    <h2>Aperitive</h2>
                    {filteredDocs_aper.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Fel principal</h2>
                    {filteredDocs_fp.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Supe/Ciorbe</h2>
                    {filteredDocs_sp.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Paste</h2>
                    {filteredDocs_pas.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Pizza</h2>
                    {filteredDocs_piz.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Garnituri</h2>
                    {filteredDocs_gar.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Salate</h2>
                    {filteredDocs_sal.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Desert</h2>
                    {filteredDocs_des.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                    <h2>Bauturi</h2>
                    {filteredDocs_ba.map((doc) => (
                        <StyledDiv className="alimente" key={doc.id}>
                            <StyledCheckbox
                                type="checkbox"
                                checked={selectedItems.includes(doc.id)}
                                onChange={() => handleSelect(doc.id)}
                            />
                            {doc.nume}
                            <div className="ingrediente">{doc.ingrediente}</div>
                            <div className="gramaj">{doc.gramaj} g</div>
                            <div className="pret">{doc.pret} ron</div>
                            <hr />
                        </StyledDiv>
                    ))}
                </div>
                <button className="comanda" onClick={handleComanda} disabled={selectedItems.length === 0}>Comanda</button>
            </StyledHome>
        </Layout>
    );
};
export default Menu;