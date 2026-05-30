import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { api } from '../services/api';

type Torneo = {
  _id: string;
  nombre_torneo: string;
  fecha_inicio: string;
  fecha_final: string;
  categoria: string;
  sede: string;
};

export default function Torneos() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre_torneo: '', fecha_inicio: '', fecha_final: '',
    categoria: '', sede: ''
  });

  // Estado para validar de manera estricta los campos vacíos del Torneo
  const [errores, setErrores] = useState({
    nombre_torneo: false,
    fecha_inicio: false,
    fecha_final: false,
    categoria: false,
    sede: false
  });

  const cargarTorneos = async () => {
    try {
      const data = await api.getTorneos();
      setTorneos(data);
    } catch (error) {
      toast.error('Falla en Cloud API (500)', {
        description: 'Imposible estructurar los datos del torneo desde MongoDB Atlas.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTorneos(); }, []);

  const handleCancel = () => {
    setShowForm(false);
    setForm({ nombre_torneo: '', fecha_inicio: '', fecha_final: '', categoria: '', sede: '' });
    setErrores({ nombre_torneo: false, fecha_inicio: false, fecha_final: false, categoria: false, sede: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapeo completo de inputs requeridos
    const nuevosErrores = {
      nombre_torneo: !form.nombre_torneo.trim(),
      fecha_inicio: !form.fecha_inicio,
      fecha_final: !form.fecha_final,
      categoria: !form.categoria,
      sede: !form.sede.trim()
    };
    setErrores(nuevosErrores);

    // Detener si existe algún elemento faltante
    if (Object.values(nuevosErrores).some(error => error)) {
      toast.error('Campos obligatorios vacíos (Error 400)', {
        description: 'Complete todos los recuadros marcados en rojo antes de proceder.'
      });
      return;
    }

    try {
      await api.createTorneo(form);
      toast.success('Torneo creado (201 Created)', {
        description: `La copa ${form.nombre_torneo} ha sido aperturada exitosamente.`
      });
      handleCancel();
      cargarTorneos();
    } catch (error) {
      toast.error('Falla interna (500)', {
        description: 'La base de datos denegó la inserción del nuevo torneo.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este torneo?')) {
      try {
        await api.deleteTorneo(id);
        toast.info('Torneo cancelado', {
          description: 'El torneo ha sido borrado del histórico de la liga.'
        });
        cargarTorneos();
      } catch (error) {
        toast.error('Error al remover torneo', {
          description: 'No se cuenta con la respuesta exitosa del servidor.'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" closeButton />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Torneos</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nuevo Torneo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4">Nuevo Torneo</h2>
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campo: Nombre del Torneo */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <input placeholder="Nombre del torneo"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.nombre_torneo ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.nombre_torneo}
                onChange={e => {
                  setForm({ ...form, nombre_torneo: e.target.value });
                  if (e.target.value.trim()) setErrores({ ...errores, nombre_torneo: false });
                }} />
              {errores.nombre_torneo && <span className="text-red-500 text-xs font-medium pl-1">El nombre del torneo es mandatorio</span>}
            </div>

            {/* Campo: Fecha de Inicio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 pl-1">Fecha inicio</label>
              <input type="date"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.fecha_inicio ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.fecha_inicio}
                onChange={e => {
                  setForm({ ...form, fecha_inicio: e.target.value });
                  if (e.target.value) setErrores({ ...errores, fecha_inicio: false });
                }} />
              {errores.fecha_inicio && <span className="text-red-500 text-xs font-medium pl-1">Especifique la fecha inicial</span>}
            </div>

            {/* Campo: Fecha Final */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 pl-1">Fecha final</label>
              <input type="date"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.fecha_final ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.fecha_final}
                onChange={e => {
                  setForm({ ...form, fecha_final: e.target.value });
                  if (e.target.value) setErrores({ ...errores, fecha_final: false });
                }} />
              {errores.fecha_final && <span className="text-red-500 text-xs font-medium pl-1">Especifique la fecha de clausura</span>}
            </div>

            {/* Campo: Categoría */}
            <div className="flex flex-col gap-1">
              <select className={`border rounded-lg px-3 py-2 text-sm ${errores.categoria ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.categoria}
                onChange={e => {
                  setForm({ ...form, categoria: e.target.value });
                  if (e.target.value) setErrores({ ...errores, categoria: false });
                }}>
                <option value="">Categoría</option>
                <option value="Varonil">Varonil</option>
                <option value="Femenil">Femenil</option>
                <option value="Mixto">Mixto</option>
              </select>
              {errores.categoria && <span className="text-red-500 text-xs font-medium pl-1">Seleccione una categoría reglamentaria</span>}
            </div>

            {/* Campo: Sede */}
            <div className="flex flex-col gap-1">
              <input placeholder="Sede"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.sede ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.sede}
                onChange={e => {
                  setForm({ ...form, sede: e.target.value });
                  if (e.target.value.trim()) setErrores({ ...errores, sede: false });
                }} />
              {errores.sede && <span className="text-red-500 text-xs font-medium pl-1">La cancha o sede es obligatoria</span>}
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
        ) : torneos.length === 0 ? (
          <p className="p-6 text-gray-500">No hay torneos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Sede</th>
                <th className="px-4 py-3 text-left">Inicio</th>
                <th className="px-4 py-3 text-left">Final</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {torneos.map((t, i) => (
                <tr key={t._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-medium">{t.nombre_torneo}</td>
                  <td className="px-4 py-3">{t.categoria}</td>
                  <td className="px-4 py-3">{t.sede}</td>
                  <td className="px-4 py-3">{new Date(t.fecha_inicio).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(t.fecha_final).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(t._id)}
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