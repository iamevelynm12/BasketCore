import React from "react"
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router"
import "./index.css"
import AppRoutes from "./AppRoutes"
import Auth0ProviderWithNavigate from './auth/auth0ProviderWithNavigate';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
      <Auth0ProviderWithNavigate>
        <AppRoutes/>
      </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
)
