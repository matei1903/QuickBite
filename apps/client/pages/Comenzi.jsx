import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));

const Coloana = styled.div`
    float: left;
    width: 48%;
    padding: 10px;
    border-left: 1px solid black;
    border-right: 1px solid black;
    
    h2 {
        text-align: center;
    }
    
`;  


const comenzi = () => {
    return (
        <Layout>
            <Coloana>
                <h2>Comenzile mele</h2>
            </Coloana>
            <Coloana>
                <h2>Comenzile mesei</h2>
            </Coloana>
        </Layout>
    );
};
export default comenzi;