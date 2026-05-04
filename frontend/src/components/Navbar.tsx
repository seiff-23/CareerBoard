import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
      }`
    }
  >
    {label}
  </NavLink>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-xs font-bold">CB</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
              Career<span className="text-indigo-600 dark:text-indigo-400">Board</span>
            </span>
          </NavLink>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <NavItem to="/" label="Dashboard" />
              <NavItem to="/applications" label="Applications" />
              <NavItem to="/kanban" label="Kanban" />
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 6a6 6 0 100 12A6 6 0 0012 6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user && (
              <>
                {/* Desktop user menu */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && user && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            <div className="flex flex-col gap-1 mt-2">
              <NavItem to="/" label="Dashboard" />
              <NavItem to="/applications" label="Applications" />
              <NavItem to="/kanban" label="Kanban" />
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
