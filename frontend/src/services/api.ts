const API_URL = 'http://localhost:3002/api';

export const api = {
  // Torneos
  getTorneos: () => fetch(`${API_URL}/torneos`).then(res => res.json()),
  createTorneo: (data: any) => fetch(`${API_URL}/torneos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteTorneo: (id: string) => fetch(`${API_URL}/torneos/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Equipos
  getEquipos: () => fetch(`${API_URL}/equipos`).then(res => res.json()),
  createEquipo: (data: any) => fetch(`${API_URL}/equipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteEquipo: (id: string) => fetch(`${API_URL}/equipos/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Jugadores
  getJugadores: () => fetch(`${API_URL}/jugadores`).then(res => res.json()),
  createJugador: (data: any) => fetch(`${API_URL}/jugadores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteJugador: (id: string) => fetch(`${API_URL}/jugadores/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Jugadores — agregar al objeto api existente
updateJugador: (id: string, data: any) => fetch(`${API_URL}/jugadores/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(res => res.json()),

  // Arbitros
  getArbitros: () => fetch(`${API_URL}/arbitros`).then(res => res.json()),
  createArbitro: (data: any) => fetch(`${API_URL}/arbitros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deleteArbitro: (id: string) => fetch(`${API_URL}/arbitros/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // Posiciones
  getPosiciones: () => fetch(`${API_URL}/posiciones`).then(res => res.json()),
  createPosicion: (data: any) => fetch(`${API_URL}/posiciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updatePosicion: (id: string, data: any) => fetch(`${API_URL}/posiciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  deletePosicion: (id: string) => fetch(`${API_URL}/posiciones/${id}`, { method: 'DELETE' }).then(res => res.json()),


getTablaPosiciones: () => fetch(`${API_URL}/equipos`).then(res => res.json()),

  // Partidos ANOTACIONES
  getPartidoEnVivo: () => fetch(`${API_URL}/partidos/en-vivo`).then(res => res.json()),
  createPartido: (data: any) => fetch(`${API_URL}/partidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updatePartido: (id: string, data: any) => fetch(`${API_URL}/partidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
};