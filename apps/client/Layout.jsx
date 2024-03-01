import React from "react";
import styled from "styled-components";
import { useFirebase } from "@quick-bite/components/context/Firebase";
const StyledLayout = styled.div`
  .header {
    text-align: center;
  }
  .img {
    width: 150px;
    height: auto;
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
              <img src="https://firebasestorage.googleapis.com/v0/b/quickbite-844b3.appspot.com/o/logo_quickbite.png?alt=media&token=356b8ce3-e2e0-4584-a46a-656992a181f3" className="img"></img>
            </div>
            <div>{children}</div>
        </StyledLayout>
    );
};