import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DisplayModal from "./components/modal";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Index from "./components/body";
import Recipent from "./components/body/recipient";
import DataImport from "./components/body/dataImport";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <DisplayModal/>
        <Routes>
            <Route path="/home" element={<Index />}> </Route>
            <Route path="/home/recipients" element={<Recipent />}> </Route>
            <Route path="/home/data/import" element={<DataImport />}> </Route>
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
 </BrowserRouter>

);

reportWebVitals();
