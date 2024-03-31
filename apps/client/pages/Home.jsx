import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));
const Icon = React.lazy(() =>
  import("@quick-bite/components/common/Icon.jsx")
);
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useFirebase } from "@quick-bite/components/context/Firebase";
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
  .gramaj {
    text-align: left;
    color: #191919;
    padding: 10px;
    font-size:14px;
  }
  input[type=text] {
    background-color: #ddddd6;
    background-image: url('https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/Search--Streamline-Guidance.svg?alt=media&token=7358a974-9292-48d9-8ff7-085957390929');
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding-left: 40px;
  }
  input:focus {
    border-color: #202b1b;
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

  const [docs, setDocs] = useState([]);

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
        <Icon className="test" path="profile.svg" />
        <button className="comanda">Comanda</button>
        <button className="plateste">Plateste</button>
      </StyledHome>
    </Layout>
  );
};
