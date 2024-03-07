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
    text-align: center;
    background-color: #ddddd6;
    color: #191919;
    padding: 10px;
    font-size:18px;
    border-bottom: 1px solid transparent;;
    border-top: 1px solid transparent;;
    border-image: radial-gradient(ellipse at center, #191919 0%, transparent 70%);
    border-image-slice: 1;
  }
`;
export default () => {
    const { db } = useFirebase();

    const [docs, setDocs] = useState([]);
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
                    <div className="alimente" key={doc.id}>{doc.nume}</div>
                     ))}
                </div>
                <Icon className="test" path="profile.svg" />
            </StyledHome>
        </Layout>
    );
};