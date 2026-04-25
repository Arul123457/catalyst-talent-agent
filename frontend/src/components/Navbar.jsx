import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAdmin, isCandidate } = useAuth()

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? 'text-green-400 bg-green-400/10'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-white">Catalyst</span>
          </Link>

          <div className="flex items-center space-x-2">
            {!user ? (
              <>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                  Register
                </Link>
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
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : isCandidate ? (
              <>
                <Link to="/candidate/dashboard" className={linkClass('/candidate/dashboard')}>
                  My Dashboard
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
