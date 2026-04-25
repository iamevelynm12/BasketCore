import { useEffect, useState } from 'react';
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

  const cargarTorneos = async () => {
    const data = await api.getTorneos();
    setTorneos(data);
    setLoading(false);
  };

  useEffect(() => { cargarTorneos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createTorneo(form);
    setForm({ nombre_torneo: '', fecha_inicio: '', fecha_final: '',
      categoria: '', sede: '' });
    setShowForm(false);
    cargarTorneos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este torneo?')) {
      await api.deleteTorneo(id);
      cargarTorneos();
    }
  };

  return (
    <div className="space-y-6">
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Nombre del torneo"
              className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
              value={form.nombre_torneo}
              onChange={e => setForm({ ...form, nombre_torneo: e.target.value })} />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Fecha inicio</label>
              <input required type="date"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.fecha_inicio}
                onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Fecha final</label>
              <input required type="date"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.fecha_final}
                onChange={e => setForm({ ...form, fecha_final: e.target.value })} />
            </div>
            <select required className="border rounded-lg px-3 py-2 text-sm"
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}>
              <option value="">Categoría</option>
              <option value="Varonil">Varonil</option>
              <option value="Femenil">Femenil</option>
              <option value="Mixto">Mixto</option>
            </select>
            <input required placeholder="Sede"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.sede}
              onChange={e => setForm({ ...form, sede: e.target.value })} />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit"
                className="bg-blue-950 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
                Guardar
              </button>
              <button type="button" onClick={() => setShowForm(false)}
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