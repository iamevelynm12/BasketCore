import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Equipo = {
  _id: string;
  nombre_equipo: string;
  abreviatura: string;
  categoria: string;
  entrenador: string;
  carrera: string;
  ganadas: number;
  derrotas: number;
};

export default function Equipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre_equipo: '', abreviatura: '', categoria: '',
    entrenador: '', carrera: '', ganadas: 0, derrotas: 0
  });

  const cargarEquipos = async () => {
    const data = await api.getEquipos();
    setEquipos(data);
    setLoading(false);
  };

  useEffect(() => { cargarEquipos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createEquipo(form);
    setForm({ nombre_equipo: '', abreviatura: '', categoria: '',
      entrenador: '', carrera: '', ganadas: 0, derrotas: 0 });
    setShowForm(false);
    cargarEquipos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este equipo?')) {
      await api.deleteEquipo(id);
      cargarEquipos();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Equipos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nuevo Equipo
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4">Nuevo Equipo</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Nombre del equipo"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.nombre_equipo}
              onChange={e => setForm({ ...form, nombre_equipo: e.target.value })} />
            <input required placeholder="Abreviatura"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.abreviatura}
              onChange={e => setForm({ ...form, abreviatura: e.target.value })} />
            <select required className="border rounded-lg px-3 py-2 text-sm"
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value })}>
              <option value="">Categoría</option>
              <option value="Varonil">Varonil</option>
              <option value="Femenil">Femenil</option>
            </select>
            <input required placeholder="Entrenador"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.entrenador}
              onChange={e => setForm({ ...form, entrenador: e.target.value })} />
            <input placeholder="Carrera"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.carrera}
              onChange={e => setForm({ ...form, carrera: e.target.value })} />
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

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Cargando...</p>
        ) : equipos.length === 0 ? (
          <p className="p-6 text-gray-500">No hay equipos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Abreviatura</th>
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
                  <td className="px-4 py-3 font-medium">{equipo.nombre_equipo}</td>
                  <td className="px-4 py-3">{equipo.abreviatura}</td>
                  <td className="px-4 py-3">{equipo.categoria}</td>
                  <td className="px-4 py-3">{equipo.entrenador}</td>
                  <td className="px-4 py-3">{equipo.carrera}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">{equipo.ganadas}</td>
                  <td className="px-4 py-3 text-red-500 font-bold">{equipo.derrotas}</td>
                  <td className="px-4 py-3">
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