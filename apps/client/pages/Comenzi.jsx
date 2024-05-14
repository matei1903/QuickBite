import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));

const Coloana = styled.div`
    float: left;
    width: 48%;
    padding: 10px;
    
    h2 {
        justify-content: center;
    }
    .vl {
        float: left;
        border-left: 6px solid black;
        height: 100%;
      }
    
`;  


const comenzi = () => {
    return (
        <Layout>
            <Coloana>
                <h2>Comenzile mele</h2>
            </Coloana>
            <div class="vl"></div>
            <Coloana>
                <h2>Comenzile mesei</h2>
            </Coloana>
        </Layout>
    );
};
export default comenzi;