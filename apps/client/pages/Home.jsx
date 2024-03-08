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
    width: 70%;
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
    
    padding: 5px;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40px;
    width: 100px;
    border-radius: 10px;
    background-color: #3f2c49;
    color: #ecebed;
    font-size:15px;
  }
  .plateste {
    
    padding: 5px;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width:100px;
    border-radius: 10px;
    background-color: #53624d;
    color: #ecebed;
    font-size:15px;
  }
`;
export default () => {
  const { db } = useFirebase();

  const [docs, setDocs] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/aperitive")), (qs) => {
        const _docs = [];
        qs.forEach((doc) => {
          _docs.push({ ...doc.data(), id: doc.id });
        });
        setDocs(_docs);
      }),
    []
  );
  return (
    <Layout>
      <StyledHome>
        <h1>Meniu</h1>
        <div className="alimente-container">
          {docs.map((doc) => (
            <div className="alimente" key={doc.id}>
              <input
                type="checkbox"
                checked={selectedItems.includes(doc.id)}
                onChange={() => handleSelect(doc.id)}
              />
              {doc.nume}
              <hr />
            </div>
          ))}
        </div>
        <Icon className="test" path="profile.svg" />
        <button className="comanda">Comanda</button>
        <button className="plateste">Plateste</button>
      </StyledHome>
    </Layout>
  );
};
const handleSelect = (itemId) => {
  if (selectedItems.includes(itemId)) {
    // Deselect item
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
  } else {
    // Select item
    setSelectedItems([...selectedItems, itemId]);
  }
};
