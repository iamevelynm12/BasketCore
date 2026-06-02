import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../services/api';

interface Stats {
  equipos: number;
  jugadores: number;
  arbitros: number;
  torneos: number;
  partidosJugados: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    equipos: 0,
    jugadores: 0,
    arbitros: 0,
    torneos: 0,
    partidosJugados: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarStats() {
      try {
        const [equipos, jugadores, arbitros, torneos] = await Promise.all([
          api.getEquipos(),
          api.getJugadores(),
          api.getArbitros(),
          api.getTorneos(),
        ]);

        const listaEquipos = Array.isArray(equipos) ? equipos : equipos.equipos ?? [];
        const listaJugadores = Array.isArray(jugadores) ? jugadores : jugadores.jugadores ?? [];
        const listaArbitros = Array.isArray(arbitros) ? arbitros : arbitros.arbitros ?? [];
        const listaTorneos = Array.isArray(torneos) ? torneos : torneos.torneos ?? [];

        const partidosJugados = listaEquipos.reduce(
          (acc: number, eq: any) => acc + (eq.ganadas || 0) + (eq.derrotas || 0), 0
        ) / 2;

        setStats({
          equipos: listaEquipos.length,
          jugadores: listaJugadores.length,
          arbitros: listaArbitros.length,
          torneos: listaTorneos.length,
          partidosJugados: Math.round(partidosJugados),
        });
      } catch (e) {
        console.error('Error cargando stats del dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    cargarStats();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Título de la sección en armonía con tu navbar */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen operativo del torneo activo</p>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BANNER PRINCIPAL */}
        <button
          onClick={() => navigate('/anotaciones')}
          className="lg:col-span-2 bg-blue-950 rounded-2xl p-8 text-white flex flex-col justify-between items-start text-left relative overflow-hidden group hover:bg-blue-900 transition-colors shadow-sm"
        >
          
            <div className="absolute right-0 bottom-0 top-0 w-1/4 bg-white/5 border-l border-white/10 pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <span className="bg-amber-500 text-blue-950 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              En Vivo
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight pt-2">Mesa de Control Abierta</h2>
            <p className="text-blue-200 text-sm max-w-md">
              Gestiona el cronómetro del partido actual, registra las canastas individuales y las asistencias directamente en la pizarra.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 font-semibold text-sm bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            Abrir panel de anotación en directo
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* TARJETA VERTICAL ALTA (Ocupa 1 columna de ancho, pero crece hacia abajo) */}
        <button
          onClick={() => navigate('/posiciones')}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between text-left hover:border-blue-200 hover:shadow transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Competencia</span>
            <h3 className="text-lg font-bold text-blue-950">Partidos Jugados</h3>
            <p className="text-gray-400 text-xs">Total de encuentros completados en la liga.</p>
          </div>
          
          <div className="my-6">
            {loading ? (
              <div className="h-16 w-24 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <span className="text-6xl font-black text-blue-950 font-mono tracking-tight">
                {stats.partidosJugados}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider group-hover:text-blue-600">
            Ver tabla de posiciones
          </span>
        </button>

      </div>

      {/* SEGUNDA FILA: Módulos de datos intermedios con cortes limpios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Jugadores */}
        <button
          onClick={() => navigate('/jugadores')}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left flex flex-col justify-between h-40 hover:border-blue-200 hover:shadow transition-all"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jugadores</h3>
            <p className="text-sm font-bold text-blue-950 mt-1">Plantillas registradas</p>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-blue-950 font-mono">{stats.jugadores}</p>
          )}
        </button>

        {/* Equipos */}
        <button
          onClick={() => navigate('/equipos')}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left flex flex-col justify-between h-40 hover:border-blue-200 hover:shadow transition-all"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Equipos</h3>
            <p className="text-sm font-bold text-blue-950 mt-1">Clubes activos</p>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-blue-950 font-mono">{stats.equipos}</p>
          )}
        </button>

        {/* Torneos */}
        <button
          onClick={() => navigate('/torneos')}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left flex flex-col justify-between h-40 hover:border-blue-200 hover:shadow transition-all"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Torneos</h3>
            <p className="text-sm font-bold text-blue-950 mt-1">Fases y ligas</p>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-blue-950 font-mono">{stats.torneos}</p>
          )}
        </button>

        {/* Árbitros */}
        <button
          onClick={() => navigate('/arbitros')}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left flex flex-col justify-between h-40 hover:border-blue-200 hover:shadow transition-all"
        >
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Árbitros</h3>
            <p className="text-sm font-bold text-blue-950 mt-1">Cuerpo colegiado</p>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-4xl font-black text-blue-950 font-mono">{stats.arbitros}</p>
          )}
        </button>

      </div>
    </div>
  );
}