import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Scout from './pages/Scout'
import Shortlist from './pages/Shortlist'
import About from './pages/About'
import CandidateDashboard from './pages/CandidateDashboard'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/scout" 
            element={
              <ProtectedRoute role="admin">
                <Scout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/shortlist" 
            element={
              <ProtectedRoute role="admin">
                <Shortlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/candidate/dashboard" 
            element={
              <ProtectedRoute role="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
