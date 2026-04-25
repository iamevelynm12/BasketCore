import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Posicion = {
  _id: string;
  id_torneo: any;
  id_equipo: any;
  puntos_tabla: number;
  ranking: number;
};

export default function Posiciones() {
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPosiciones().then(data => {
      setPosiciones(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-950">Posiciones</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Cargando...</p>
        ) : posiciones.length === 0 ? (
          <p className="p-6 text-gray-500">No hay posiciones registradas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Ranking</th>
                <th className="px-4 py-3 text-left">Equipo</th>
                <th className="px-4 py-3 text-left">Torneo</th>
                <th className="px-4 py-3 text-left">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map((p, i) => (
                <tr key={p._id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-bold text-blue-950">#{p.ranking}</td>
                  <td className="px-4 py-3 font-medium">{p.id_equipo?.nombre_equipo || '—'}</td>
                  <td className="px-4 py-3">{p.id_torneo?.nombre_torneo || '—'}</td>
                  <td className="px-4 py-3 font-bold">{p.puntos_tabla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}