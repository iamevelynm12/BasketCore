import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";


export default function MainNav() {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-950 font-medium">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            className="font-bold hover:text-blue-950 hover:bg-white"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Cerrar Sesión
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="font-bold hover:text-blue-950 hover:bg-white"
          onClick={() => loginWithRedirect()}>
          Log In
        </Button>
      )}
    </div>
  );
}
