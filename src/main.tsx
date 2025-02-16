
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from "react-ga4";

ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  ,
)

