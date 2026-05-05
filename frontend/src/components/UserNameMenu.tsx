import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "./ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router";

export default function UserNameMenu() {
  const { user, logout } = useAuth0();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-white hover:text-blue-200 cursor-pointer outline-none w-full">
        <CircleUserRound size={20} />
          <span className="text-sm truncate">{user?.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-48">
        <DropdownMenuItem>
          <Link to="/perfil">
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="cursor-pointer text-red-500">
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}