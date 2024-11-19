import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
//IMPORTS
import {NefrologicoApp} from './NefrologicoApp'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
                 <NefrologicoApp />
        </BrowserRouter>
    </React.StrictMode>
)