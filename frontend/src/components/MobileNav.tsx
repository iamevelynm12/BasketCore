import { Sheet, SheetTrigger, SheetContent, SheetTitle,SheetDescription } from "./ui/sheet";
import { Menu, CircleUserRound} from "lucide-react";
import {Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";


export default function MobileNav() {
    const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  return (
    <Sheet>
        <SheetTrigger>
            <Menu className="text-blue-950"/>
        </SheetTrigger>
        <SheetContent className="space-y-3">
        <SheetTitle>
            {isAuthenticated ? (
            <span className="flex items-center gap-2">
                <CircleUserRound className="text-blue-950" />
            <span className="text-orange-500">{user?.email}</span>
         </span>
         ) : (
    <span>Bienvenido a BasketCore 🏀</span>
        )}
        </SheetTitle>
            <Separator/>
            <SheetDescription className="flex flex-col gap-4">
                {isAuthenticated ? (
                    <MobileNavLinks />
                ) : (
                 <Button
                    className="flex-1 font-bold bg-blue-950"
                    onClick={() => loginWithRedirect()}>
                    Log In
                </Button>
             )}
            </SheetDescription>
        </SheetContent>
    </Sheet>
  )
}
