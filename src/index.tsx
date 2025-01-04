import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Carga dinámica de la URL de la API desde window.env
const apiBaseUrl = (window as any).env?.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

console.log('API Base URL:', apiBaseUrl);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
