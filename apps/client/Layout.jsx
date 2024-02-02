import React from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const StyledLayout = styled.div`
  .header {
    background: red;
  }
`;
export default ({ children }) => {
    const _firebase = useFirebase();
    const db = _firebase?.db;

    if (!db)
        return <div>loading...</div>
    return (
        <StyledLayout>
            <div className="header">header</div>
            <div>{children}</div>
        </StyledLayout>
    );
};