import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Equipo {
  _id: string;
  nombre_equipo: string;
}

interface Jugador {
  _id: string;
  nombre_jugador: string;
  num_playera: number;
  puntos_totales: number;
  asistencias: number;
  id_equipo: any;
}

interface Partido {
  _id: string;
  id_equipo1: Equipo;
  id_equipo2: Equipo;
  puntos_equipo1: number;
  puntos_equipo2: number;
  tiempo_minutos: number;
  estado: string;
}

export default function Anotaciones() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partido, setPartido] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);
  const [idEquipo1, setIdEquipo1] = useState('');
  const [idEquipo2, setIdEquipo2] = useState('');
  const [minutos, setMinutos] = useState(10);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [equipoAnotador, setEquipoAnotador] = useState<1 | 2>(1);
  const [puntosAnotar, setPuntosAnotar] = useState(1);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [hayAsistencia, setHayAsistencia] = useState(false);
  const [asistidorSeleccionado, setAsistidorSeleccionado] = useState('');

  useEffect(() => {
    let vivo = true;
    async function cargar() {
      try {
        const [listaEquipos, partidoActivo, listaJugadores] = await Promise.all([
          api.getEquipos(),
          api.getPartidoEnVivo(),
          api.getJugadores(),
        ]);
        if (!vivo) return;
        setEquipos(Array.isArray(listaEquipos) ? listaEquipos : listaEquipos.equipos ?? []);
        setJugadores(Array.isArray(listaJugadores) ? listaJugadores : []);
        setPartido(partidoActivo ?? null);
        if (partidoActivo) {
          setMinutos(partidoActivo.tiempo_minutos ?? 10);
          setSegundos(0);
        }
      } catch (e) {
        console.error('Error carga inicial:', e);
      } finally {
        if (vivo) setLoading(false);
      }
    }
    cargar();
    return () => { vivo = false; };
  }, []);

  // Cronómetro
  useEffect(() => {
    if (!corriendo) return;
    const intervalo = setInterval(() => {
      setSegundos(prev => {
        if (prev > 0) return prev - 1;
        setMinutos(m => {
          if (m === 0) { setCorriendo(false); return 0; }
          return m - 1;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [corriendo]);

  const ajustarTiempo = (mins: number) => {
    setCorriendo(false);
    setMinutos(mins);
    setSegundos(0);
  };

  const jugadoresEquipo = (equipo: 1 | 2) => {
    if (!partido) return [];
    const idEquipo = equipo === 1
      ? partido.id_equipo1._id
      : partido.id_equipo2._id;
    return jugadores.filter(j =>
      j.id_equipo?._id === idEquipo || j.id_equipo === idEquipo
    );
  };

  const abrirModal = (equipo: 1 | 2, puntos: number) => {
    setEquipoAnotador(equipo);
    setPuntosAnotar(puntos);
    setJugadorSeleccionado('');
    setHayAsistencia(false);
    setAsistidorSeleccionado('');
    setModalVisible(true);
  };

  const confirmarAnotacion = async () => {
    if (!partido) return;
    setModalVisible(false); // Cerrar PRIMERO para evitar doble click

    const p1 = partido.puntos_equipo1 + (equipoAnotador === 1 ? puntosAnotar : 0);
    const p2 = partido.puntos_equipo2 + (equipoAnotador === 2 ? puntosAnotar : 0);

    setPartido({ ...partido, puntos_equipo1: p1, puntos_equipo2: p2 });

    try {
      await api.updatePartido(partido._id, { puntos_equipo1: p1, puntos_equipo2: p2 });

      if (jugadorSeleccionado) {
        const jugador = jugadores.find(j => j._id === jugadorSeleccionado);
        if (jugador) {
          await api.updateJugador(jugadorSeleccionado, {
            puntos_totales: (jugador.puntos_totales || 0) + puntosAnotar,
          });
        }
      }

      if (hayAsistencia && asistidorSeleccionado) {
        const asistidor = jugadores.find(j => j._id === asistidorSeleccionado);
        if (asistidor) {
          await api.updateJugador(asistidorSeleccionado, {
            asistencias: (asistidor.asistencias || 0) + 1,
          });
        }
      }

      const listaActualizada = await api.getJugadores();
      setJugadores(Array.isArray(listaActualizada) ? listaActualizada : []);
      toast.success(`+${puntosAnotar} registrado`);
    } catch (e) {
      toast.error('Error al guardar la anotación');
    }
  };

  const crearPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEquipo1 || !idEquipo2) return toast.error('Selecciona ambos equipos');
    if (idEquipo1 === idEquipo2) return toast.error('No puede ser el mismo equipo');
    try {
      await api.createPartido({
        id_equipo1: idEquipo1,
        id_equipo2: idEquipo2,
        puntos_equipo1: 0,
        puntos_equipo2: 0,
        tiempo_minutos: 10,
        estado: 'En progreso',
      });
      const p = await api.getPartidoEnVivo();
      setPartido(p ?? null);
      setMinutos(10);
      setSegundos(0);
    } catch (e) {
      toast.error('Error al crear partido');
    }
  };

  const finalizar = async () => {
    if (!partido) return;
    if (!window.confirm('¿Finalizar partido y guardar estadísticas?')) return;
    try {
      setCorriendo(false);
      await api.updatePartido(partido._id, {
        estado: 'Terminado',
        puntos_equipo1: partido.puntos_equipo1,
        puntos_equipo2: partido.puntos_equipo2,
      });
      toast.success('¡Partido finalizado! Estadísticas actualizadas.');
      setPartido(null);
      setIdEquipo1('');
      setIdEquipo2('');
      setMinutos(10);
      setSegundos(0);
    } catch (e) {
      toast.error('Error al finalizar el partido');
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Anotaciones</h1>
        <p className="text-sm text-gray-500 uppercase tracking-wide">Partidos en vivo</p>
      </div>

      {/* Modal */}
      {modalVisible && partido && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-blue-950">
              +{puntosAnotar} — ¿Quién anotó?
            </h2>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Jugador que anotó (opcional)
              </label>
              <select
                value={jugadorSeleccionado}
                onChange={e => setJugadorSeleccionado(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">— Seleccionar —</option>
                {jugadoresEquipo(equipoAnotador).map(j => (
                  <option key={j._id} value={j._id}>
                    #{j.num_playera} {j.nombre_jugador}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                ¿Hubo asistencia?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setHayAsistencia(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                    hayAsistencia
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  ✓ Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setHayAsistencia(false); setAsistidorSeleccionado(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                    !hayAsistencia
                      ? 'bg-blue-950 text-white border-blue-950'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  ✗ No
                </button>
              </div>
            </div>

            {hayAsistencia && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  ¿Quién asistió?
                </label>
                <select
                  value={asistidorSeleccionado}
                  onChange={e => setAsistidorSeleccionado(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">— Seleccionar —</option>
                  {jugadoresEquipo(equipoAnotador)
                    .filter(j => j._id !== jugadorSeleccionado)
                    .map(j => (
                      <option key={j._id} value={j._id}>
                        #{j.num_playera} {j.nombre_jugador}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={confirmarAnotacion}
                className="flex-1 bg-blue-950 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-900"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {!partido ? (
        <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto text-center space-y-4">
          <span className="text-4xl">🏀</span>
          <h2 className="text-lg font-bold text-blue-950">No hay partido en vivo</h2>
          <p className="text-sm text-gray-500">Selecciona dos equipos para comenzar.</p>
          <form onSubmit={crearPartido} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Equipo Local</label>
              <select required value={idEquipo1} onChange={e => setIdEquipo1(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Seleccionar equipo</option>
                {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre_equipo}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Equipo Visitante</label>
              <select required value={idEquipo2} onChange={e => setIdEquipo2(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Seleccionar equipo</option>
                {equipos.map(eq => <option key={eq._id} value={eq._id}>{eq.nombre_equipo}</option>)}
              </select>
            </div>
            <button type="submit"
              className="w-full bg-blue-950 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-900">
              Abrir Marcador
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-blue-950 rounded-xl p-8 text-white space-y-8">

          {/* Cronómetro */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-blue-300 tracking-widest">CRONÓMETRO</span>
            <div className="bg-white text-blue-950 font-mono text-4xl font-bold px-8 py-3 rounded-xl shadow-inner">
              {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCorriendo(c => !c)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold text-white ${corriendo ? 'bg-amber-500' : 'bg-green-600'}`}>
                {corriendo ? '⏸ Pausar' : '▶ Iniciar'}
              </button>
              <button type="button" onClick={() => ajustarTiempo(10)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-800 text-blue-200">
                10 min
              </button>
              <button type="button" onClick={() => ajustarTiempo(15)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-800 text-blue-200">
                15 min
              </button>
            </div>
          </div>

          {/* Marcador */}
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-blue-300">LOCAL</span>
              <h3 className="text-lg font-bold">{partido.id_equipo1?.nombre_equipo}</h3>
              <div className="bg-white text-blue-950 text-6xl font-black font-mono w-36 h-36 rounded-3xl flex items-center justify-center shadow-lg">
                {partido.puntos_equipo1}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} type="button" onClick={() => abrirModal(1, n)}
                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    +{n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-blue-300">VISITANTE</span>
              <h3 className="text-lg font-bold">{partido.id_equipo2?.nombre_equipo}</h3>
              <div className="bg-white text-blue-950 text-6xl font-black font-mono w-36 h-36 rounded-3xl flex items-center justify-center shadow-lg">
                {partido.puntos_equipo2}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} type="button" onClick={() => abrirModal(2, n)}
                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    +{n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Finalizar */}
          <div className="flex justify-center pt-4 border-t border-blue-800">
            <button type="button" onClick={finalizar}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
              ✪ Finalizar y Guardar Partido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}