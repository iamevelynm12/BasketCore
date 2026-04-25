import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";

export default function MobileNavLinks() {
  const { logout } = useAuth0();

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/perfil"
        className="flex items-center font-bold hover:text-blue-950">
        Perfil
      </Link>
      <button
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="flex items-center font-bold hover:text-blue-950 text-left">
        Cerrar Sesión
      </button>
    </div>
  );
}