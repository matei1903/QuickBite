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

  const [docs_aper, setDocs_aper] = useState([]);
  const [docs_fp, setDocs_fp] = useState([]);
  const [docs_sp, setDocs_sp] = useState([]);
  const [docs_pas, setDocs_pas] = useState([]);
  const [docs_piz, setDocs_piz] = useState([]);
  const [docs_gar, setDocs_gar] = useState([]);
  const [docs_sal, setDocs_sal] = useState([]);
  const [docs_des, setDocs_des] = useState([]);
  const [docs_ba, setDocs_ba] = useState([]);

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


  useEffect(
    () =>
      onSnapshot(query(collection(db, "/aperitive")), (qs) => {
        const _docs_aper = [];
        qs.forEach((doc) => {
          _docs_aper.push({ ...doc.data(), id: doc.id });
        });
        setDocs_aper(_docs_aper);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/fel_principal")), (qs) => {
        const _docs_fp = [];
        qs.forEach((doc) => {
          _docs_fp.push({ ...doc.data(), id: doc.id });
        });
        setDocs_fp(_docs_fp);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/supe_ciorbe")), (qs) => {
        const _docs_sp = [];
        qs.forEach((doc) => {
          _docs_sp.push({ ...doc.data(), id: doc.id });
        });
        setDocs_sp(_docs_sp);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/paste")), (qs) => {
        const _docs_pas = [];
        qs.forEach((doc) => {
          _docs_pas.push({ ...doc.data(), id: doc.id });
        });
        setDocs_pas(_docs_pas);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/pizza")), (qs) => {
        const _docs_piz = [];
        qs.forEach((doc) => {
          _docs_piz.push({ ...doc.data(), id: doc.id });
        });
        setDocs_piz(_docs_piz);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/garnituri")), (qs) => {
        const _docs_gar = [];
        qs.forEach((doc) => {
          _docs_gar.push({ ...doc.data(), id: doc.id });
        });
        setDocs_gar(_docs_gar);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/salate")), (qs) => {
        const _docs_sal = [];
        qs.forEach((doc) => {
          _docs_sal.push({ ...doc.data(), id: doc.id });
        });
        setDocs_sal(_docs_sal);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/desert")), (qs) => {
        const _docs_des = [];
        qs.forEach((doc) => {
          _docs_des.push({ ...doc.data(), id: doc.id });
        });
        setDocs_des(_docs_des);
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(query(collection(db, "/bauturi")), (qs) => {
        const _docs_ba = [];
        qs.forEach((doc) => {
          _docs_ba.push({ ...doc.data(), id: doc.id });
        });
        setDocs_ba(_docs_ba);
      }),
    []
  );
  return (
    <Layout>
      <StyledHome>
        <h1>Meniu</h1>
        <div className="alimente-container">
          {docs_aper.map((doc) => (
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
          {docs_fp.map((doc) => (
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
          {docs_sp.map((doc) => (
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
          {docs_pas.map((doc) => (
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
          {docs_piz.map((doc) => (
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
          {docs_gar.map((doc) => (
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
          {docs_sal.map((doc) => (
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
          {docs_des.map((doc) => (
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
          {docs_ba.map((doc) => (
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
