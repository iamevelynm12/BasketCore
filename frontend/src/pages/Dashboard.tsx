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

  const tarjetas = [
    {
      titulo: 'Jugadores',
      descripcion: 'Roster registrado',
      valor: stats.jugadores,
      icono: '🏃',
      ruta: '/jugadores',
      color: 'border-blue-400',
    },
    {
      titulo: 'Equipos',
      descripcion: 'Equipos activos',
      valor: stats.equipos,
      icono: '🏀',
      ruta: '/equipos',
      color: 'border-orange-400',
    },
    {
      titulo: 'Partidos Jugados',
      descripcion: 'Total de encuentros',
      valor: stats.partidosJugados,
      icono: '📊',
      ruta: '/posiciones',
      color: 'border-green-400',
    },
    {
      titulo: 'Próximos Juegos',
      descripcion: 'Ir a anotaciones',
      valor: null,
      icono: '📅',
      ruta: '/anotaciones',
      color: 'border-purple-400',
    },
    {
      titulo: 'Torneos',
      descripcion: 'Torneos registrados',
      valor: stats.torneos,
      icono: '🏆',
      ruta: '/torneos',
      color: 'border-yellow-400',
    },
    {
      titulo: 'Árbitros',
      descripcion: 'Cuerpo arbitral',
      valor: stats.arbitros,
      icono: '👨‍⚖️',
      ruta: '/arbitros',
      color: 'border-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tarjetas.map((t) => (
          <button
            key={t.titulo}
            onClick={() => navigate(t.ruta)}
            className={`bg-white rounded-xl shadow p-6 border-l-4 ${t.color} text-left hover:shadow-md transition-shadow w-full`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-blue-950 mb-1">{t.titulo}</h2>
                <p className="text-gray-500 text-sm">{t.descripcion}</p>
              </div>
              <span className="text-2xl">{t.icono}</span>
            </div>

            {loading ? (
              <div className="mt-4 h-8 w-16 bg-gray-100 rounded animate-pulse" />
            ) : t.valor !== null ? (
              <p className="mt-4 text-4xl font-black text-blue-950">{t.valor}</p>
            ) : (
              <p className="mt-4 text-xs text-blue-600 font-semibold uppercase tracking-wide">
                Ver anotaciones →
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}