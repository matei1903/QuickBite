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
    color: green;
    float: right;
  }
  .alimente {
    text-align: center;
    background-color: #ddddd6;
    width: fit-content;
    color: #191919;
    margin: 0 auto;
  }
`;
export default () => {
    const { db } = useFirebase();

    const [docs, setDocs] = useState([]);
    useEffect(
        () =>
            onSnapshot(query(collection(db, "/menu_items")), (qs) => {
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
                    <div className="alimente" key={doc.id}>{doc.name}</div>
                ))}
                <Icon className="test" path="profile.svg" />
            </StyledHome>
        </Layout>
    );
};