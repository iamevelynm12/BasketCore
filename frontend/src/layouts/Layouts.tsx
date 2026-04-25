import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import MainNav from '../components/MainNav';
import { useAuth0 } from "@auth0/auth0-react";
import UserNameMenu from "../components/UserNameMenu";

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/equipos', label: 'Equipos' },
  { path: '/jugadores', label: 'Jugadores' },
  { path: '/arbitros', label: 'Árbitros' },
  { path: '/torneos', label: 'Torneos' },
  { path: '/posiciones', label: 'Posiciones' },
  { path: '/anotaciones', label: 'Anotaciones' },
  { path: '/configuracion', label: 'Configuración' },
];

type Props = {
  children: React.ReactNode;
};

function Layouts({ children }: Props) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transform transition-transform duration-300 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <Link to="/" className="text-xl font-bold text-white">
            🏀 BasketCore
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === link.path
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login / Usuario */}
<div className="p-4 border-t border-blue-800">
  {isAuthenticated ? (
    <UserNameMenu />
  ) : (
    <button
      onClick={() => loginWithRedirect()}
      className="w-full bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
      Log In
    </button>
  )}
</div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-blue-950">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-950">BasketCore</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layouts;
