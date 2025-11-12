import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardBuilder from './pages/DashboardBuilder'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/:id" element={<DashboardBuilder />} />
      <Route path="/dashboard" element={<DashboardBuilder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

