//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./style.css"
import App from './App.tsx'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root-10-04-24-03-0505')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
