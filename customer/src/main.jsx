import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Bootstrap JS for interactive components (dropdowns, modals, etc.)
import 'bootstrap/dist/js/bootstrap.bundle'
// Bootstrap Icons globally so header icons render everywhere
import 'bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
