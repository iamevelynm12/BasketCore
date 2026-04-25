import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

type Props= {
    children: React.ReactNode
}

function Auth0ProviderWithNavigate({ children }: Props) {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const navigate = useNavigate();

    if(!domain || !clientId || !redirectUri){
        throw new Error('Error al inicializar Auth0');
        
    }
    const onRedirectCallback = (appState: any)=>{
        navigate(appState?.returnTo || window.location.pathname);
    }
  return (
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
            redirect_uri: redirectUri
        }}
        onRedirectCallback={onRedirectCallback}
        >
            {children}
            </Auth0Provider>
  )
}

export default Auth0ProviderWithNavigate
