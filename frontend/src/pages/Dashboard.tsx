export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Jugadores</h2>
        <p className="text-gray-500 text-sm">Gestiona el roster de jugadores</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Equipos</h2>
        <p className="text-gray-500 text-sm">Administra los equipos registrados</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Estadísticas</h2>
        <p className="text-gray-500 text-sm">Consulta el rendimiento general</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Próximos Juegos</h2>
        <p className="text-gray-500 text-sm">Calendario de partidos</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Fechas</h2>
        <p className="text-gray-500 text-sm">Torneos activos</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-blue-950 mb-2">Otros</h2>
        <p className="text-gray-500 text-sm">Más información</p>
      </div>
    </div>
  );
}