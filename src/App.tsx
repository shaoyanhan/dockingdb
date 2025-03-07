import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import DownloadPage from './pages/DownloadPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/molecule/:moleculeId" element={<ResultPage />} />
      <Route path="/download" element={<DownloadPage />} />
    </Routes>
  )
}

export default App
