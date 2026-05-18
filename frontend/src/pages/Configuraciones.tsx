import { useState } from 'react';
import { useNavigate } from 'react-router';

type Tab = 'general' | 'reglas' | 'perfil';

export default function Configuracion() {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<Tab>('general');

  const tabs = [
    { id: 'general' as Tab, label: 'General', icono: '⚙️' },
    { id: 'reglas' as Tab, label: 'Reglas', icono: '📋' },
    { id: 'perfil' as Tab, label: 'Mi Perfil', icono: '👤' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Configuración</h1>
        <p className="text-sm text-gray-500">Información del sistema BasketCore</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => {
              if (t.id === 'perfil') {
                navigate('/perfil');
              } else {
                setTabActiva(t.id);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tabActiva === t.id && t.id !== 'perfil'
                ? 'bg-white text-blue-950 shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{t.icono}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab General */}
      {tabActiva === 'general' && (
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-lg font-bold text-blue-950 border-b pb-3">
            Información del Sistema
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm font-semibold text-gray-600">Aplicación</span>
              <span className="text-sm text-gray-800 font-bold">BasketCore</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm font-semibold text-gray-600">Versión</span>
              <span className="text-sm text-gray-800">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm font-semibold text-gray-600">Temporada</span>
              <span className="text-sm text-gray-800">2026-1</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm font-semibold text-gray-600">Institución</span>
              <span className="text-sm text-gray-800">Instituto Tecnológico de Zacatecas</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-sm font-semibold text-gray-600">Desarrolladores</span>
              <div className="text-right">
                <p className="text-sm text-gray-800">Evelyn Itzel Méndez Saldaña</p>
                <p className="text-sm text-gray-800">Juan Pablo De Luna Gaytán</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-semibold text-gray-600">Derechos</span>
              <span className="text-sm text-gray-500">© 2026 BasketCore — ITZ</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Reglas */}
      {tabActiva === 'reglas' && (
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-lg font-bold text-blue-950 border-b pb-3">
            Reglamento del Torneo
          </h2>

          <div className="space-y-4">
            {[
              { titulo: 'Duración de periodo', valor: '10 minutos por cuarto' },
              { titulo: 'Modalidad', valor: '2 Mitades (formato universitario)' },
              { titulo: 'Puntos por victoria', valor: '2 puntos en tabla (sistema FIBA)' },
              { titulo: 'Puntos por derrota', valor: '1 punto en tabla' },
              { titulo: 'Anotaciones válidas', valor: '+1 tiro libre, +2 campo, +3 triple' },
              { titulo: 'Normativa aplicada', valor: 'Reglamento FIBA 2024' },
              { titulo: 'Sede principal', valor: 'Instituto Tecnológico de Zacatecas' },
              { titulo: 'Categorías', valor: 'Varonil y Femenil' },
            ].map(r => (
              <div key={r.titulo} className="flex justify-between items-center py-3 border-b last:border-0">
                <span className="text-sm font-semibold text-gray-600">{r.titulo}</span>
                <span className="text-sm text-gray-800 text-right max-w-xs">{r.valor}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-700 font-medium">
              📋 Estas reglas están definidas por la coordinación deportiva del ITZ 
              en conjunto con el reglamento oficial FIBA 2024. Para modificaciones 
              contacta al administrador del torneo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}