import { Routes, Route } from "react-router-dom"
import Login from '@auth/Login.jsx'
import Register from '@auth/Register.jsx'

function Home() {
  return <h2>Home</h2>
}

function Dashboard() {
  return <h2>Dashboard</h2>
}

function NotFound() {
  return <h2>404 Not Found</h2>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
