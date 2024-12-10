import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import DisplayModal from "./components/modal";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Index from "./components/body";
import Recipent from "./components/body/recipient";
import DataImport from "./components/body/dataImport";
import Transaction from "./components/body/transaction";
import Reservations from "./components/body/reservations";
import Activity from "./components/body/activity";
import SearchByFile from "./components/body/searchByFile";
import ProductDisplay from "./components/body/products";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <DisplayModal/>
        <Routes>
            <Route path="/home" element={<Index />}> </Route>
            <Route path="/home/folder/:id" element={<ProductDisplay />}> </Route>
            <Route path="/home/recipients" element={<Recipent />}> </Route>
            <Route path="/home/data/import" element={<DataImport />}> </Route>
            <Route path="/home/data/transactions" element={<Transaction />}> </Route>
            <Route path="/home/data/reservations" element={<Reservations />}> </Route>
            <Route path="/home/data/activity" element={<Activity />}> </Route>
            <Route path="/home/data/search-by-file" element={<SearchByFile />}> </Route>
            <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
 </BrowserRouter>

);

reportWebVitals();
