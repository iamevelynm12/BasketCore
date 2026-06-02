import { useEffect, useState } from 'react';
import { api } from '../services/api';

type EquipoPosicion = { 
  _id: string; 
  nombre_equipo: string; 
  abreviatura: string;
  ganadas: number; 
  derrotas: number;
  categoria: string;
  imageUrl?: string;
};

export default function Posiciones() {
  const [equipos, setEquipos] = useState<EquipoPosicion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarTabla = async () => {
    try {
      setLoading(true);
      const datos = await api.getTablaPosiciones();
      if (Array.isArray(datos)) {
        
        // ordenar los equipos por victorias 
        const equiposOrdenados = [...datos].sort((a, b) => {
          const ganadasA = a.ganadas || 0;
          const ganadasB = b.ganadas || 0;
          const derrotasA = a.derrotas || 0;
          const derrotasB = b.derrotas || 0;

          // mayor numero de victorias
          if (ganadasB !== ganadasA) {
            return ganadasB - ganadasA; // El que tenga más victorias sube
          }
          
          // menor numero de derrotass
          return derrotasA - derrotasB; // El que tenga menos derrotas sube
        });

        setEquipos(equiposOrdenados);
      }
    } catch (error) {
      console.error("Error al cargar la tabla de posiciones en vivo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarTabla(); 
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-blue-950 tracking-tight">Tabla de Posiciones</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
            Sincronizado en vivo con la pizarra de anotaciones
          </p>
        </div>
        <button 
          onClick={cargarTabla}
          className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          Actualizar Tabla
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium text-xs animate-pulse">
            Sincronizando estadísticas del torneo...
          </div>
        ) : equipos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 italic text-xs">
            No hay equipos registrados en el torneo actualmente.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 text-center w-16">Puesto</th>
                <th className="p-4">Equipo</th>
                <th className="p-4 text-center w-28 bg-emerald-50/50 text-emerald-700">Ganados (G)</th>
                <th className="p-4 text-center w-28 bg-red-50/50 text-red-700">Perdidos (P)</th>
                <th className="p-4 text-center w-28 text-blue-950">Jugados (JJ)</th>
                <th className="p-4 text-center w-28 text-gray-700">% Rendimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {equipos.map((equipo, index) => {
                const ganadas = equipo.ganadas || 0;
                const derrotas = equipo.derrotas || 0;
                const jugados = ganadas + derrotas;
                
                const rendimiento = jugados > 0 
                  ? `${Math.round((ganadas / jugados) * 100)}%` 
                  : '0%';

                const esTop3 = index < 3;
                const medallas = ['#1', '#2', '#3'];

                return (
                  <tr key={equipo._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Lugar numérico */}
                    <td className="p-4 text-center font-bold text-sm">
                      {esTop3 ? (
                        <span className="text-base text-blue-950 font-black" title={`Puesto ${index + 1}`}>{medallas[index]}</span>
                      ) : (
                        <span className="text-gray-400 font-mono">#{index + 1}</span>
                      )}
                    </td>
                    
                    {/* Nombre e información del equipo */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {equipo.imageUrl ? (
                          <img 
                            src={equipo.imageUrl} 
                            alt={equipo.nombre_equipo} 
                            className="w-7 h-7 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-black text-[10px] uppercase border border-blue-100">
                            {equipo.abreviatura || equipo.nombre_equipo.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{equipo.nombre_equipo}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">{equipo.categoria || 'General'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Estadísticas */}
                    <td className="p-4 text-center font-bold text-sm text-emerald-600 bg-emerald-50/20">
                      {ganadas}
                    </td>
                    <td className="p-4 text-center font-bold text-sm text-red-500 bg-red-50/20">
                      {derrotas}
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-600 bg-gray-50/30">
                      {jugados}
                    </td>

                    {/* Porcentaje final */}
                    <td className="p-4 text-center font-black text-blue-950 text-sm">
                      {rendimiento}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}