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
  .alimente {
    text-align: center;
    background-color: #ddddd6;
    width: 70%;
    color: #191919;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #191919;
    border-radius: 5px;

    >div {
        border-radius: 0;
    }
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
                {docs.map((doc) => (   
                    <div className="alimente" key={doc.id}>{doc.nume}</div>
                ))}
                <Icon className="test" path="profile.svg" />
            </StyledHome>
        </Layout>
    );
};