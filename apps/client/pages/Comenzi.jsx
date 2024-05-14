import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));

const Coloana = styled.div`
    float: left;
    width: 50%;
    padding: 10px;

    .column_left {
        border-right: 2px solid black;
    }
    .column_right {
        border-left: 2px solid black;
    }
  
`;

const comenzi = () => {
    return (
        <Layout>
            <Coloana className="column_left">
                <h2>Comenzile mele</h2>
            </Coloana>
            <Coloana className="column_right">
                <h2>Comenzile mesei</h2>
            </Coloana>
        </Layout>
    );
};
export default comenzi;