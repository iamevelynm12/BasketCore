import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import { useEffect } from "react";
import type { BackEndUser } from "@/api/types";

// Esquema de validación con Zod
const formSchema = z.object({
  email: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
});

type UserFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (data: UserFormData) => void;
  currentUser?: BackEndUser;
};

export default function UserProfileForm({ onSave, currentUser }: Props) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      address: "",
      city: "",
      country: "",
    },
  });
  useEffect(() => {
  if (currentUser) {
    form.reset({
      email: currentUser.email,
      name: currentUser.name,
      address: currentUser.address,
      city: currentUser.city,
      country: currentUser.country,
    });
  }
}, [currentUser, form]);

  const onSubmit = (data: UserFormData) => {
    console.log(JSON.stringify(data));
    onSave(data);
  };

  return (
    <Card className="max-w-2xl mx-auto border-blue-100 shadow-md">
      <CardHeader className="bg-blue-950 rounded-t-xl">
        <CardTitle className="text-2xl font-bold text-white">
          🏀 Perfil de Usuario
        </CardTitle>
        <CardDescription className="text-blue-200">
          Actualiza tu información personal en BasketCore
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">

          {/* Email - no editable */}
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-blue-950">Email</label>
                <Input
                  {...field}
                  disabled
                  className="bg-gray-100 text-gray-500 border-blue-100"
                />
                {form.formState.errors.email && (
                  <span className="text-red-500 text-xs">{form.formState.errors.email.message}</span>
                )}
              </div>
            )}
          />

          {/* Nombre */}
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-sm font-medium text-blue-950">Nombre</label>
                <Input
                  {...field}
                  placeholder="Tu nombre completo"
                  className="border-blue-100 focus:border-blue-950"
                />
                {form.formState.errors.name && (
                  <span className="text-red-500 text-xs">{form.formState.errors.name.message}</span>
                )}
              </div>
            )}
          />

          {/* Dirección, Ciudad, País en columnas */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Dirección */}
            <Controller
              name="address"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-blue-950">Dirección</label>
                  <Input
                    {...field}
                    placeholder="Tu dirección"
                    className="border-blue-100 focus:border-blue-950"
                  />
                  {form.formState.errors.address && (
                    <span className="text-red-500 text-xs">{form.formState.errors.address.message}</span>
                  )}
                </div>
              )}
            />

            {/* Ciudad */}
            <Controller
              name="city"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-blue-950">Ciudad</label>
                  <Input
                    {...field}
                    placeholder="Tu ciudad"
                    className="border-blue-100 focus:border-blue-950"
                  />
                  {form.formState.errors.city && (
                    <span className="text-red-500 text-xs">{form.formState.errors.city.message}</span>
                  )}
                </div>
              )}
            />

            {/* País */}
            <Controller
              name="country"
              control={form.control}
              render={({ field }) => (
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-sm font-medium text-blue-950">País</label>
                  <Input
                    {...field}
                    placeholder="Tu país"
                    className="border-blue-100 focus:border-blue-950"
                  />
                  {form.formState.errors.country && (
                    <span className="text-red-500 text-xs">{form.formState.errors.country.message}</span>
                  )}
                </div>
              )}
            />

          </div>

        </CardContent>

        <CardFooter className="flex justify-end border-t border-blue-100 pt-4">
          <Button
            type="submit"
            className="bg-blue-950 hover:bg-blue-800 text-white font-bold px-8">
            Actualizar Perfil
          </Button>
        </CardFooter>

      </form>
    </Card>
  );
}