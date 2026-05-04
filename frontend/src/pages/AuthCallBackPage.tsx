import { useCreateUser } from "@/api/UserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export default function AuthCallBackPage() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { mutate: createUser } = useCreateUser();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (user?.sub && user?.email && !hasCreatedUser.current) {
      createUser(
        { auth0Id: user.sub, email: user.email },
        {
          onSettled: () => {
            navigate("/");
          },
        }
      );
      hasCreatedUser.current = true;
    }
  }, [createUser, navigate, user]);

  return <div className="min-h-screen flex items-center justify-center
   bg-blue-950 text-white text-xl font-bold">
    Cargando...
    </div>;
}
