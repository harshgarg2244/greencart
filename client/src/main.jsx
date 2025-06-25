import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { App } from './App';
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <Routes>
        <Route path='*' element={<App />} />
      </Routes>
    </AppContextProvider>
  </BrowserRouter>
);
