import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import type { User, UpdateUser, BackEndUser } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const createUserRequest = async (user: User) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }
    return response.json();
  };

  return useMutation({
    mutationFn: createUserRequest,
    onError: () => {
      toast.error("Error al crear el usuario");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const updateUserRequest = async (user: UpdateUser) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }
    return response.json();
  };

  return useMutation({
    mutationFn: updateUserRequest,
    onError: () => {
      toast.error("Error al actualizar el perfil");
    },
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useGetUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getUserRequest = async (): Promise<BackEndUser> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }
    return response.json();
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: getUserRequest,
  });
}; 
