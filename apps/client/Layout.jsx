import React from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const StyledLayout = styled.div`
  .header {
    text-align: center;
  }
`;
export default ({ children }) => {
    const _firebase = useFirebase();
    const db = _firebase?.db;

    if (!db)
        return <div>loading...</div>
    return (
        <StyledLayout>
            <div className="header">
              <img src="gs://quickbite-844b3.appspot.com/logo_quickbite.png" alt="logo_quickbite"></img>
            </div>
            <div>{children}</div>
        </StyledLayout>
    );
};