import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { api } from '../services/api';

type Arbitro = {
  _id: string;
  nombre_arbitro: string;
  telefono: string;
  email: string;
};

export default function Arbitros() {
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre_arbitro: '', telefono: '', email: '' });
  
  // Estado para los errores visuales en los campos obligatorios
  const [errores, setErrores] = useState({
    nombre_arbitro: false
  });

  const cargarArbitros = async () => {
    try {
      const data = await api.getArbitros();
      setArbitros(data);
    } catch (error) {
      toast.error('Error de red (500)', {
        description: 'No se logró conectar con el servidor para leer el cuerpo arbitral.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarArbitros(); }, []);

  const handleCancel = () => {
    setShowForm(false);
    setForm({ nombre_arbitro: '', telefono: '', email: '' });
    setErrores({ nombre_arbitro: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si el campo obligatorio de nombre está vacío
    const nuevosErrores = {
      nombre_arbitro: !form.nombre_arbitro.trim()
    };
    setErrores(nuevosErrores);

    if (nuevosErrores.nombre_arbitro) {
      toast.error('Campos obligatorios vacíos (Error 400)', {
        description: 'Por favor, revise los señalamientos en rojo en el formulario.'
      });
      return;
    }

    try {
      await api.createArbitro(form);
      toast.success('Árbitro registrado (201 Created)', {
        description: `El colegiado ${form.nombre_arbitro} se guardó con éxito.`
      });
      handleCancel();
      cargarArbitros();
    } catch (error) {
      toast.error('Error de persistencia (500)', {
        description: 'Hubo una anomalía al registrar el árbitro en la base de datos.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este árbitro?')) {
      try {
        await api.deleteArbitro(id);
        toast.info('Registro depurado', {
          description: 'El árbitro se eliminó físicamente del sistema.'
        });
        cargarArbitros();
      } catch (error) {
        toast.error('Error de eliminación', {
          description: 'No se pudo completar la baja en el servidor.'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" closeButton />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Árbitros</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nuevo Árbitro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4">Nuevo Árbitro</h2>
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campo: Nombre del Árbitro */}
            <div className="flex flex-col gap-1">
              <input placeholder="Nombre completo"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.nombre_arbitro ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.nombre_arbitro}
                onChange={e => {
                  setForm({ ...form, nombre_arbitro: e.target.value });
                  if (e.target.value.trim()) setErrores({ nombre_arbitro: false });
                }} />
              {errores.nombre_arbitro && <span className="text-red-500 text-xs font-medium pl-1">El nombre completo es obligatorio</span>}
            </div>

            {/* Campo: Teléfono */}
            <div className="flex flex-col gap-1">
              <input placeholder="Teléfono"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </div>

            {/* Campo: Email */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <input placeholder="Email"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit"
                className="bg-blue-950 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
                Guardar
              </button>
              <button type="button" onClick={handleCancel}
                className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Cargando...</p>
        ) : arbitros.length === 0 ? (
          <p className="p-6 text-gray-500">No hay árbitros registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Teléfono</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {arbitros.map((a, i) => (
                <tr key={a._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-medium">{a.nombre_arbitro}</td>
                  <td className="px-4 py-3">{a.telefono}</td>
                  <td className="px-4 py-3">{a.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(a._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}