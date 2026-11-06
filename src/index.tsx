// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import Dashboard from './dashboard';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Quotation from './quotation';
// import Item from './Items';
// import Search from './search';
// import Admin from './admin';
// import AddSearchItem from './addSearchItem ';


// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/add-search-item" element={<AddSearchItem />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/quotation" element={<Quotation />} />
//         <Route path="/Item/:id" element={<Item />} /> 
//         <Route path="/Item" element={<Item />} />
//         <Route path="/search" element={<Search />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

// reportWebVitals();
// 
// ();

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
