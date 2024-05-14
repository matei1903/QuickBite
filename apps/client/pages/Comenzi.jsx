import React, { useState, useEffect } from "react";
import styled from "styled-components";
const Layout = React.lazy(() => import("../Layout.jsx"));

const Coloana = styled.div`
    float: left;
    width: 50%;
    padding: 10px;
`;

const ColoanaStanga = styled(Coloana)`
    border-right: 2px solid black;
`;

const ColoanaDreapta = styled(Coloana)`
    border-left: 2px solid black;
`;

const comenzi = () => {
    return (
        <Layout>
            <ColoanaStanga>
                <h2>Comenzile mele</h2>
            </ColoanaStanga>
            <ColoanaDreapta>
                <h2>Comenzile mesei</h2>
            </ColoanaDreapta>
        </Layout>
    );
};
export default comenzi;