import React from 'react';
import './index.css';
import App from './components/App';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/:quizID" element={<App/>}></Route>
        <Route path="/" element={<App/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
