import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Entries/public/sw.js', {scope: '/Entries/'}, {type: 'module'}).then(registration => {
      console.log('ServiceWorker registered: ', registration);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
