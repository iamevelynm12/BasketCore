import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
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

  // Estado para capturar qué campos obligatorios del Atleta están vacíos
  const [errores, setErrores] = useState({
    nombre_jugador: false,
    num_playera: false
  });

  const cargarDatos = async () => {
    try {
      const [j, e] = await Promise.all([api.getJugadores(), api.getEquipos()]);
      setJugadores(j);
      setEquipos(e);
    } catch (error) {
      toast.error('Falla de comunicación (500)', {
        description: 'No se logró consultar la sincronización de rosters desde la API.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleCancel = () => {
    setShowForm(false);
    setForm({
      nombre_jugador: '', num_playera: 0, posicion: '', num_control: '',
      carrera: '', puntos_totales: 0, asistencias: 0, id_equipo: ''
    });
    setErrores({ nombre_jugador: false, num_playera: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificación explícita de campos obligatorios
    const nuevosErrores = {
      nombre_jugador: !form.nombre_jugador.trim(),
      num_playera: form.num_playera < 0 || form.num_playera === null || form.num_playera === undefined
    };
    setErrores(nuevosErrores);

    if (nuevosErrores.nombre_jugador || nuevosErrores.num_playera) {
      toast.error('Campos obligatorios vacíos (Error 400)', {
        description: 'Asegúrese de corregir los campos marcados en color rojo.'
      });
      return;
    }

    try {
      await api.createJugador(form);
      toast.success('Jugador registrado (201 Created)', {
        description: `El atleta ${form.nombre_jugador} ha sido añadido exitosamente al roster.`
      });
      handleCancel();
      cargarDatos();
    } catch (error) {
      toast.error('Error de guardado (500)', {
        description: 'La base de datos documental rechazó el registro del jugador.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este jugador?')) {
      try {
        await api.deleteJugador(id);
        toast.info('Atleta desvinculado', {
          description: 'El documento fue removido permanentemente de Atlas.'
        });
        cargarDatos();
      } catch (error) {
        toast.error('Error al dar de baja', {
          description: 'La petición DELETE falló en el servidor remoto.'
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-right" closeButton />

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
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campo: Nombre del Jugador */}
            <div className="flex flex-col gap-1">
              <input placeholder="Nombre completo"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.nombre_jugador ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.nombre_jugador}
                onChange={e => {
                  setForm({ ...form, nombre_jugador: e.target.value });
                  if (e.target.value.trim()) setErrores({ ...errores, nombre_jugador: false });
                }} />
              {errores.nombre_jugador && <span className="text-red-500 text-xs font-medium pl-1">El nombre del jugador es obligatorio</span>}
            </div>

            {/* Campo: Número de Playera */}
            <div className="flex flex-col gap-1">
              <input type="number" placeholder="Número de playera"
                className={`border rounded-lg px-3 py-2 text-sm ${errores.num_playera ? 'border-red-500 focus:outline-red-500' : ''}`}
                value={form.num_playera || ''}
                onChange={e => {
                  setForm({ ...form, num_playera: Number(e.target.value) });
                  if (e.target.value) setErrores({ ...errores, num_playera: false });
                }} />
              {errores.num_playera && <span className="text-red-500 text-xs font-medium pl-1">El número de playera es requerido</span>}
            </div>

            {/* Campo: Posición */}
            <div className="flex flex-col gap-1">
              <select className="border rounded-lg px-3 py-2 text-sm"
                value={form.posicion}
                onChange={e => setForm({ ...form, posicion: e.target.value })} >
                <option value="">Posición</option>
                <option value="Base">Base</option>
                <option value="Escolta">Escolta</option>
                <option value="Alero">Alero</option>
                <option value="Ala-Pivot">Ala-Pivot</option>
                <option value="Pivot">Pivot</option>
              </select>
            </div>

            {/* Campo: Número de control */}
            <div className="flex flex-col gap-1">
              <input placeholder="Número de control"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.num_control}
                onChange={e => setForm({ ...form, num_control: e.target.value })} />
            </div>

            {/* Campo: Carrera */}
            <div className="flex flex-col gap-1">
              <input placeholder="Carrera"
                className="border rounded-lg px-3 py-2 text-sm"
                value={form.carrera}
                onChange={e => setForm({ ...form, carrera: e.target.value })} />
            </div>

            {/* Campo: Asignación de Equipo */}
            <div className="flex flex-col gap-1">
              <select className="border rounded-lg px-3 py-2 text-sm"
                value={form.id_equipo}
                onChange={e => setForm({ ...form, id_equipo: e.target.value })} >
                <option value="">Seleccionar equipo</option>
                {equipos.map(eq => (
                  <option key={eq._id} value={eq._id}>{eq.nombre_equipo}</option>
                ))}
              </select>
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
                    <button onClick={() => handleDelete(j._id)}
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