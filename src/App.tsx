import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DownloadPage from './pages/DownloadPage'
import MoleculeTablePage from './pages/MoleculeTablePage'
import MoleculeStructurePage from './pages/MoleculeStructurePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/download" element={<DownloadPage />} />
      <Route path="/table/:moleculeId" element={<MoleculeTablePage />} />
      <Route path="/structure/:moleculeId/:pocketId" element={<MoleculeStructurePage />} />
    </Routes>
  )
}

export default App
