import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
// Busca a div 'root' no index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  // Inicializa o React
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}