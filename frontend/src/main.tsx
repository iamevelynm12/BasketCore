import React from "react"
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router"
import "./index.css"
import AppRoutes from "./AppRoutes"
import Auth0ProviderWithNavigate from './auth/auth0ProviderWithNavigate';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithNavigate>
        <AppRoutes/>
      </Auth0ProviderWithNavigate>
    </Router>
  </React.StrictMode>
)
