import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Removida a extensão .jsx explícita que às vezes causa conflito em alguns bundlers, mas o arquivo é o mesmo
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)