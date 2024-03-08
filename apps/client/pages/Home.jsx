import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));
const Icon = React.lazy(() =>
  import("@quick-bite/components/common/Icon.jsx")
);
import { collection, onSnapshot, query } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const StyledHome = styled.div`
  h1 {
    color: #dfc780;
    text-align: center;
    font-family: fantasy;
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
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    width: 150px;
    border-radius: 20px;
    background-color: #3f2c49;
    color: #ecebed;
    font-size:18px;
    border: none;
    outline: 2px solid black;
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
export default () => {
  const { db } = useFirebase();

  const [docs, setDocs] = useState([]);
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


  const unsubscribe = onSnapshot(db, (snapshot) => {
    const _docs = [];
  
    snapshot.forEach((doc) => {
      // Assuming each document has a "nume" field
      _docs.push({ id: doc.id, name: doc.data().nume });
    });
  
    setDocs(_docs);
  });
  
  // ...
  
  // Unsubscribe when component unmounts
  return () => {
    unsubscribe();
  };
  
  return (
    <Layout>
      <StyledHome>
        <h1>Meniu</h1>
        <div className="alimente-container">
          {docs.map((doc) => (
            <StyledDiv className="alimente" key={doc.id}>
              <StyledCheckbox
                type="checkbox"
                checked={selectedItems.includes(doc.id)}
                onChange={() => handleSelect(doc.id)}
              />
              {doc.nume}
              <div className="ingrediente">{doc.ingrediente}</div>
              <div className="pret">{doc.pret} ron</div>
              <hr />
            </StyledDiv>
          ))}
        </div>
        <Icon className="test" path="profile.svg" />
        <button className="comanda">Comanda</button>
        <button className="plateste">Plateste</button>
      </StyledHome>
    </Layout>
  );
};
