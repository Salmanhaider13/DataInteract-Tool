import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalAuthProvider } from './components/GlobalAuthProvider.jsx'
import App from './App.jsx'
// import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalAuthProvider>
      <App />
    </GlobalAuthProvider>
  </StrictMode>,
)
