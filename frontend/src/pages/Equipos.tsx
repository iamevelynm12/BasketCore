import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

type Equipo = {
  _id: string;
  nombre_equipo: string;
  abreviatura: string;
  categoria: string;
  entrenador: string;
  carrera: string;
  ganadas: number;
  derrotas: number;
  imageUrl?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Equipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Estado para los valores del formulario
  const [form, setForm] = useState({
    nombre_equipo: '', abreviatura: '', categoria: '',
    entrenador: '', carrera: '', ganadas: 0, derrotas: 0
  });

  // NUEVO: Estado para rastrear qué campos tienen errores individuales
  const [errores, setErrores] = useState({
    nombre_equipo: false,
    abreviatura: false,
    categoria: false,
    entrenador: false
  });

  const cargarEquipos = async () => {
    try {
      const data = await fetch(`${API_BASE_URL}/equipos`).then(r => r.json());
      setEquipos(data);
    } catch (error) {
      toast.error('Error de conexión (500)', {
        description: 'No se pudieron recuperar las escuadras desde MongoDB Atlas.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarEquipos(); }, []);

  const handleEdit = (equipo: Equipo) => {
    setEditingEquipo(equipo);
    setForm({
      nombre_equipo: equipo.nombre_equipo,
      abreviatura: equipo.abreviatura,
      categoria: equipo.categoria,
      entrenador: equipo.entrenador,
      carrera: equipo.carrera,
      ganadas: equipo.ganadas,
      derrotas: equipo.derrotas
    });
    // Limpiamos errores al editar
    setErrores({ nombre_equipo: false, abreviatura: false, categoria: false, entrenador: false });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEquipo(null);
    setImageFile(null);
    setForm({ nombre_equipo: '', abreviatura: '', categoria: '',
      entrenador: '', carrera: '', ganadas: 0, derrotas: 0 });
    setErrores({ nombre_equipo: false, abreviatura: false, categoria: false, entrenador: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evaluar qué campos específicos están vacíos
    const nuevosErrores = {
      nombre_equipo: !form.nombre_equipo.trim(),
      abreviatura: !form.abreviatura.trim(),
      categoria: !form.categoria,
      entrenador: !form.entrenador.trim()
    };

    setErrores(nuevosErrores);

    // Si cualquiera de los campos obligatorios está vacío, se detiene el flujo y se avisa con Toast
    if (nuevosErrores.nombre_equipo || nuevosErrores.abreviatura || nuevosErrores.categoria || nuevosErrores.entrenador) {
      toast.error('Campos obligatorios vacíos (Error 400)', {
        description: 'Por favor, revisa las alertas en rojo debajo de cada campo del formulario.'
      });
      return;
    }

    const formData = new FormData();
    formData.append('nombre_equipo', form.nombre_equipo);
    formData.append('abreviatura', form.abreviatura);
    formData.append('categoria', form.categoria);
    formData.append('entrenador', form.entrenador);
    formData.append('carrera', form.carrera);
    formData.append('ganadas', String(form.ganadas));
    formData.append('derrotas', String(form.derrotas));
    if (imageFile) formData.append('imageFile', imageFile);

    try {
      if (editingEquipo) {
        const res = await fetch(`${API_BASE_URL}/equipos/${editingEquipo._id}`, {
          method: 'PUT',
          body: formData
        });
        
        if (res.ok) {
          toast.success('Equipo actualizado (200 OK)', {
            description: `Se guardaron los cambios del club ${form.nombre_equipo} con éxito.`
          });
        } else {
          throw new Error();
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/equipos`, {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          toast.success('Equipo registrado (201 Created)', {
            description: `El club ${form.nombre_equipo} ha sido indexado en MongoDB.`
          });
        } else {
          throw new Error();
        }
      }

      handleCancel();
      cargarEquipos();
    } catch (error) {
      toast.error('Error interno del servidor (500)', {
        description: 'La transacción falló. Inténtelo de nuevo más tarde.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este equipo?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/equipos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.info('Registro purgado', {
            description: 'El equipo se eliminó físicamente de la base de datos.'
          });
          cargarEquipos();
        } else {
          throw new Error();
        }
      } catch (error) {
        toast.error('Error al eliminar', {
          description: 'No se pudo procesar la baja de la base de datos.'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" closeButton />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Equipos</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingEquipo(null); }}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nuevo Equipo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4">
            {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h2>
          {/* Quitamos el 'required' nativo de HTML para permitir que nuestra lógica controle las alertas en rojo */}
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campo: Nombre del Equipo */}
            <div className="flex flex-col gap-1">
              <input placeholder="Nombre del equipo"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.nombre_equipo ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.nombre_equipo}
                onChange={e => {
                  setForm({ ...form, nombre_equipo: e.target.value });
                  if(e.target.value.trim()) setErrores({...errores, nombre_equipo: false});
                }} />
              {errores.nombre_equipo && <span className="text-red-500 text-xs font-medium pl-1">El nombre del equipo es obligatorio</span>}
            </div>

            {/* Campo: Abreviatura */}
            <div className="flex flex-col gap-1">
              <input placeholder="Abreviatura"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.abreviatura ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.abreviatura}
                onChange={e => {
                  setForm({ ...form, abreviatura: e.target.value });
                  if(e.target.value.trim()) setErrores({...errores, abreviatura: false});
                }} />
              {errores.abreviatura && <span className="text-red-500 text-xs font-medium pl-1">La abreviatura es obligatoria</span>}
            </div>

            {/* Campo: Categoría */}
            <div className="flex flex-col gap-1">
              <select className={`border rounded-lg px-3 py-2 text-sm ${errores.categoria ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.categoria}
                onChange={e => {
                  setForm({ ...form, categoria: e.target.value });
                  if(e.target.value) setErrores({...errores, categoria: false});
                }}>
                <option value="">Categoría</option>
                <option value="Varonil">Varonil</option>
                <option value="Femenil">Femenil</option>
              </select>
              {errores.categoria && <span className="text-red-500 text-xs font-medium pl-1">Debe seleccionar una categoría</span>}
            </div>

            {/* Campo: Entrenador */}
            <div className="flex flex-col gap-1">
              <input placeholder="Entrenador"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.entrenador ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.entrenador}
                onChange={e => {
                  setForm({ ...form, entrenador: e.target.value });
                  if(e.target.value.trim()) setErrores({...errores, entrenador: false});
                }} />
              {errores.entrenador && <span className="text-red-500 text-xs font-medium pl-1">El nombre del entrenador es obligatorio</span>}
            </div>

            {/* Campo: Carrera */}
            <div className="flex flex-col gap-1">
              <input placeholder="Carrera"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.carrera}
                onChange={e => setForm({ ...form, carrera: e.target.value })} />
            </div>

            {/* Logo del equipo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Logo del equipo</label>
              <input type="file" accept=".jpg,.jpeg,.png"
                className="border rounded-lg px-3 py-2 text-sm"
                onChange={e => setImageFile(e.target.files?.[0] || null)} />
            </div>

            {editingEquipo?.imageUrl && !imageFile && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Logo actual:</span>
                <img src={editingEquipo.imageUrl} alt="logo"
                  className="w-12 h-12 object-contain rounded" />
              </div>
            )}

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit"
                className="bg-blue-950 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
                {editingEquipo ? 'Actualizar' : 'Guardar'}
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
        ) : equipos.length === 0 ? (
          <p className="p-6 text-gray-500">No hay equipos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Logo</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Abrev.</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Entrenador</th>
                <th className="px-4 py-3 text-left">Carrera</th>
                <th className="px-4 py-3 text-left">G</th>
                <th className="px-4 py-3 text-left">D</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo, i) => (
                <tr key={equipo._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">
                    {equipo.imageUrl ? (
                      <img src={equipo.imageUrl} alt="logo"
                        className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <span className="text-2xl">🏀</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{equipo.nombre_equipo}</td>
                  <td className="px-4 py-3">{equipo.abreviatura}</td>
                  <td className="px-4 py-3">{equipo.categoria}</td>
                  <td className="px-4 py-3">{equipo.entrenador}</td>
                  <td className="px-4 py-3">{equipo.carrera}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">{equipo.ganadas}</td>
                  <td className="px-4 py-3 text-red-500 font-bold">{equipo.derrotas}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(equipo)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(equipo._id)}
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