import { useEffect, useState } from 'react';
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

  const cargarArbitros = async () => {
    const data = await api.getArbitros();
    setArbitros(data);
    setLoading(false);
  };

  useEffect(() => { cargarArbitros(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createArbitro(form);
    setForm({ nombre_arbitro: '', telefono: '', email: '' });
    setShowForm(false);
    cargarArbitros();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este árbitro?')) {
      await api.deleteArbitro(id);
      cargarArbitros();
    }
  };

  return (
    <div className="space-y-6">
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Nombre completo"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.nombre_arbitro}
              onChange={e => setForm({ ...form, nombre_arbitro: e.target.value })} />
            <input placeholder="Teléfono"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })} />
            <input placeholder="Email"
              className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
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