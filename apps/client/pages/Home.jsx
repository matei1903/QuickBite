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
  }
  .test {
    color: green;
  }
`;
export default () => {
    const { db } = useFirebase();

    const [docs, setDocs] = useState([]);
    useEffect(
        () =>
            onSnapshot(query(collection(db, "/test")), (qs) => {
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
                <h1>Meniup</h1>
                {docs.map((doc) => (
                    <div key={doc.id}>{doc.test}</div>
                ))}
                <Icon className="test" path="profile.svg" />
            </StyledHome>
        </Layout>
    );
};