import UserProfileForm from "../forms/user-profile-form/UserProfileForm";
import { useGetUser, useUpdateUser } from "../api/UserApi";
import { toast } from "sonner";
import type { UpdateUser } from "../api/types";

export default function UserProfilePage() {
  const { data: currentUser, isLoading, isError } = useGetUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-blue-950 font-medium">Cargando perfil...</p>
      </div>
    );
  }

  if (isError) {
    toast.error("Error al cargar el perfil");
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-medium">Error al cargar el perfil</p>
      </div>
    );
  }

  const onSave = async (data: UpdateUser) => {
    await updateUser(data);
  };

  return (
    <div className="space-y-6">
      <UserProfileForm 
        onSave={onSave}
        currentUser={currentUser} 
      />
    </div>
  );
}