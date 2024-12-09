import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DisplayModal from "./components/modal";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Index from "./components/body";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <DisplayModal/>
        <Routes>
            <Route path="/home" element={<Index />}> </Route>
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
 </BrowserRouter>

);

reportWebVitals();
