import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Equipo {
  _id: string;
  nombre_equipo: string;
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
  const [partido, setPartido] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);
  const [idEquipo1, setIdEquipo1] = useState('');
  const [idEquipo2, setIdEquipo2] = useState('');
  const [minutos, setMinutos] = useState(10);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  // Carga inicial — solo una vez
  useEffect(() => {
    let vivo = true;
    async function cargar() {
      try {
        const [listaEquipos, partidoActivo] = await Promise.all([
          api.getEquipos(),
          api.getPartidoEnVivo(),
        ]);
        if (!vivo) return;
        setEquipos(Array.isArray(listaEquipos) ? listaEquipos : listaEquipos.equipos ?? []);
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

  // Cronómetro local
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

  const sumarPuntos = async (equipo: 1 | 2, cantidad: number) => {
    if (!partido) return;
    const p1 = partido.puntos_equipo1 + (equipo === 1 ? cantidad : 0);
    const p2 = partido.puntos_equipo2 + (equipo === 2 ? cantidad : 0);
    // Optimista: actualizamos pantalla al instante
    setPartido({ ...partido, puntos_equipo1: p1, puntos_equipo2: p2 });
    try {
      await api.updatePartido(partido._id, { puntos_equipo1: p1, puntos_equipo2: p2 });
    } catch (e) {
      console.error('Error al guardar puntos:', e);
    }
  };

  const crearPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEquipo1 || !idEquipo2) return alert('Selecciona ambos equipos');
    if (idEquipo1 === idEquipo2) return alert('No puede ser el mismo equipo');
    try {
      await api.createPartido({
        id_equipo1: idEquipo1,
        id_equipo2: idEquipo2,
        puntos_equipo1: 0,
        puntos_equipo2: 0,
        tiempo_minutos: 10,
        estado: 'En progreso',
      });
      // Recargamos para traer el partido con populate
      const p = await api.getPartidoEnVivo();
      setPartido(p ?? null);
      setMinutos(10);
      setSegundos(0);
    } catch (e) {
      console.error('Error al crear partido:', e);
    }
  };

  const finalizar = async () => {
  if (!partido) return;
  console.log('FINALIZANDO partido ID:', partido._id, 'Puntos:', partido.puntos_equipo1, '-', partido.puntos_equipo2);
  try {
    setCorriendo(false);
    const res = await api.updatePartido(partido._id, {
      estado: 'Terminado',
      puntos_equipo1: partido.puntos_equipo1,
      puntos_equipo2: partido.puntos_equipo2,
    });
    console.log('Respuesta del backend:', res);
    alert('¡Partido finalizado!');
    setPartido(null);
    setIdEquipo1('');
    setIdEquipo2('');
    setMinutos(10);
    setSegundos(0);
  } catch (e) {
    console.error('Error al finalizar:', e);
  }
};

  if (loading) return <p className="p-6 text-gray-500">Cargando...</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Anotaciones</h1>
        <p className="text-sm text-gray-500 uppercase tracking-wide">Partidos en vivo</p>
      </div>

      {!partido ? (
        /* ── Sin partido ── */
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
        /* ── Partido activo ── */
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
            {/* Local */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-blue-300">LOCAL</span>
              <h3 className="text-lg font-bold">{partido.id_equipo1?.nombre_equipo}</h3>
              <div className="bg-white text-blue-950 text-6xl font-black font-mono w-36 h-36 rounded-3xl flex items-center justify-center shadow-lg">
                {partido.puntos_equipo1}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} type="button" onClick={() => sumarPuntos(1, n)}
                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    +{n}
                  </button>
                ))}
              </div>
            </div>

            {/* Visitante */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-xs font-bold text-blue-300">VISITANTE</span>
              <h3 className="text-lg font-bold">{partido.id_equipo2?.nombre_equipo}</h3>
              <div className="bg-white text-blue-950 text-6xl font-black font-mono w-36 h-36 rounded-3xl flex items-center justify-center shadow-lg">
                {partido.puntos_equipo2}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} type="button" onClick={() => sumarPuntos(2, n)}
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