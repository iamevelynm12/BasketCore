import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Jugador = {
  _id: string;
  nombre_jugador: string;
  num_playera: number;
  posicion: string;
  num_control: string;
  carrera: string;
  puntos_totales: number;
  asistencias: number;
  id_equipo: any;
};

type Equipo = {
  _id: string;
  nombre_equipo: string;
};

export default function Jugadores() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre_jugador: '',
    num_playera: 0,
    posicion: '',
    num_control: '',
    carrera: '',
    puntos_totales: 0,
    asistencias: 0,
    id_equipo: ''
  });

  const cargarDatos = async () => {
    const [j, e] = await Promise.all([api.getJugadores(), api.getEquipos()]);
    setJugadores(j);
    setEquipos(e);
    setLoading(false);
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createJugador(form);
    setForm({
      nombre_jugador: '',
      num_playera: 0,
      posicion: '',
      num_control: '',
      carrera: '',
      puntos_totales: 0,
      asistencias: 0,
      id_equipo: ''
    });
    setShowForm(false);
    cargarDatos();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este jugador?')) {
      await api.deleteJugador(id);
      cargarDatos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Jugadores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
          + Nuevo Jugador
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-blue-950 mb-4">Nuevo Jugador</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Nombre completo"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.nombre_jugador}
              onChange={e => setForm({ ...form, nombre_jugador: e.target.value })}
            />
            <input
              required
              type="number"
              placeholder="Número de playera"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.num_playera}
              onChange={e => setForm({ ...form, num_playera: Number(e.target.value) })}
            />
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.posicion}
              onChange={e => setForm({ ...form, posicion: e.target.value })}>
              <option value="">Posición</option>
              <option value="Base">Base</option>
              <option value="Escolta">Escolta</option>
              <option value="Alero">Alero</option>
              <option value="Ala-Pivot">Ala-Pivot</option>
              <option value="Pivot">Pivot</option>
            </select>
            <input
              placeholder="Número de control"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.num_control}
              onChange={e => setForm({ ...form, num_control: e.target.value })}
            />
            <input
              placeholder="Carrera"
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.carrera}
              onChange={e => setForm({ ...form, carrera: e.target.value })}
            />
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={form.id_equipo}
              onChange={e => setForm({ ...form, id_equipo: e.target.value })}>
              <option value="">Seleccionar equipo</option>
              {equipos.map(eq => (
                <option key={eq._id} value={eq._id}>{eq.nombre_equipo}</option>
              ))}
            </select>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-950 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-800">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
        ) : jugadores.length === 0 ? (
          <p className="p-6 text-gray-500">No hay jugadores registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Posición</th>
                <th className="px-4 py-3 text-left">Control</th>
                <th className="px-4 py-3 text-left">Carrera</th>
                <th className="px-4 py-3 text-left">Equipo</th>
                <th className="px-4 py-3 text-left">Pts</th>
                <th className="px-4 py-3 text-left">Ast</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((j, i) => (
                <tr key={j._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-bold text-blue-950">{j.num_playera}</td>
                  <td className="px-4 py-3 font-medium">{j.nombre_jugador}</td>
                  <td className="px-4 py-3">{j.posicion}</td>
                  <td className="px-4 py-3">{j.num_control}</td>
                  <td className="px-4 py-3">{j.carrera}</td>
                  <td className="px-4 py-3">{j.id_equipo?.nombre_equipo || '—'}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">{j.puntos_totales}</td>
                  <td className="px-4 py-3">{j.asistencias}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(j._id)}
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