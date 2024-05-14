import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));

const ColoanaS = styled.div`
    float: left;
    width: 45%;
    padding: 10px;
    border-right: 1px solid black;
    
    h2 {
        text-align: center;
        border-bottom: 2px solid black;
        
    }
    
`;  
const ColoanaD = styled.div`
    float: right;
    width: 45%;
    padding: 10px;
    border-left: 1px solid black;
    
    h2 {
        text-align: center;
        border-bottom: 2px solid black;
    }
    
`;  


const comenzi = () => {
    return (
        <Layout>
            <ColoanaS>
                <h2>Comenzile mele</h2>
            </ColoanaS>
            <ColoanaD>
                <h2>Comenzile mesei</h2>
            </ColoanaD>
        </Layout>
    );
};
export default comenzi;