import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isCandidate } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive(path)
        ? 'text-green-400 bg-green-500/10'
        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
            <div className="relative">
              <Zap className="w-6 h-6 text-green-400 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-green-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-white">Catalyst</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!user ? (
              <>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="ml-2"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/scout" className={linkClass('/scout')}>
                  Scout
                </Link>
                <Link to="/shortlist" className={linkClass('/shortlist')}>
                  Shortlist
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : isCandidate ? (
              <>
                <Link to="/candidate/dashboard" className={linkClass('/candidate/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700/50 bg-gray-900/95 backdrop-blur-lg animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {!user ? (
              <>
                <Link
                  to="/about"
                  className={`block ${linkClass('/about')}`}
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-center bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  to="/scout"
                  className={`block ${linkClass('/scout')}`}
                  onClick={closeMobileMenu}
                >
                  Scout
                </Link>
                <Link
                  to="/shortlist"
                  className={`block ${linkClass('/shortlist')}`}
                  onClick={closeMobileMenu}
                >
                  Shortlist
                </Link>
                <Link
                  to="/about"
                  className={`block ${linkClass('/about')}`}
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : isCandidate ? (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={`block ${linkClass('/candidate/dashboard')}`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/about"
                  className={`block ${linkClass('/about')}`}
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
