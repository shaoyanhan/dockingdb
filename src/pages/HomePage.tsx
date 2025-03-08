import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import MoleculeCard from '../components/MoleculeCard';

// 导入图片
import CytokininsImage from '../assets/images/Cytokinins.png';
import AuxinImage from '../assets/images/Auxin.png';
import BrassinolideImage from '../assets/images/Brassinolide.png';
import Abscisic_acidImage from '../assets/images/ABA.png';
import Gibberellic_acidImage from '../assets/images/Gibberellic_acid.png';
import Salicylic_acidImage from '../assets/images/Salicylic_acid.png';
import Jasmonic_acidImage from '../assets/images/Jasmonic_acid.png';
import StrigolactoneImage from '../assets/images/Strigolactone_GR24.png';

import iPImage from '../assets/images/iP.png';
import KinImage from '../assets/images/Kin.png';
import tZImage from '../assets/images/tZ.png';
import cZImage from '../assets/images/cZ.png';
import BAImage from '../assets/images/BA.png';
import DiphenylureaImage from '../assets/images/Diphenylurea.png';
import TDImage from '../assets/images/TD.png';

// 定义视图模式类型
type ViewMode = 'main' | 'cytokinin';

// 定义分子数据类型
interface MoleculeData {
  id: string;
  src: string;
}

// 主分子数据
const mainMoleculeData: MoleculeData[] = [
  { id: 'Cytokinins', src: CytokininsImage },
  { id: 'Auxin', src: AuxinImage },
  { id: 'Brassinolide', src: BrassinolideImage },
  { id: 'Abscisic acid', src: Abscisic_acidImage },
  { id: 'Gibberellic acid', src: Gibberellic_acidImage },
  { id: 'Salicylic acid', src: Salicylic_acidImage },
  { id: 'Jasmonic acid', src: Jasmonic_acidImage },
  { id: 'Strigolactone', src: StrigolactoneImage },
];

// Cytokinins二级数据
const cytokininData: MoleculeData[] = [
  { id: 'Cytokinins', src: CytokininsImage }, // 保留Cytokinins作为父类别
  { id: 'iP', src: iPImage },
  { id: 'Kin', src: KinImage },
  { id: 'tZ', src: tZImage },
  { id: 'cZ', src: cZImage },
  { id: 'BA', src: BAImage },
  { id: 'Diphenylurea', src: DiphenylureaImage },
  { id: 'TD', src: TDImage },
];

const HomePage = () => {
  const navigate = useNavigate();
  
  // 使用单一的viewMode状态来管理显示模式，不再需要多个状态变量
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  
  // 获取当前应该显示的分子数据
  const currentMoleculeData = viewMode === 'main' ? mainMoleculeData : cytokininData;
  
  // 处理搜索逻辑
  const handleSearch = useCallback((query: string, withoutPDX: boolean) => {
    console.log('Searching for:', query, 'Without PDX:', withoutPDX);
    
    if (query.trim()) {
      // 如果有查询内容，导航到全局搜索页面
      navigate(`/search?query=${encodeURIComponent(query)}&withoutPDX=${withoutPDX}`);
    } else {
      // 如果查询为空，重置为主视图
      setViewMode('main');
    }
  }, [navigate]);

  // 处理卡片点击 - 使用useCallback优化性能
  const handleCardClick = useCallback((id: string) => {
    console.log(`Card clicked: ${id}, Current view mode: ${viewMode}`);
    
    // 处理Cytokinins卡片的特殊逻辑
    if (id === 'Cytokinins') {
      // 切换视图模式
      setViewMode(prevMode => prevMode === 'main' ? 'cytokinin' : 'main');
    } else {
      // 其他卡片直接导航到表格页面
      navigate(`/table/${id}`);
    }
  }, [navigate, viewMode]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <SearchBar onSearch={handleSearch} />

        {/* 添加可视化指示器，显示当前在哪个视图 */}
        <div className="mb-4 flex justify-center">
          {viewMode === 'cytokinin' && (
            <button 
              onClick={() => setViewMode('main')}
              className="flex items-center text-green-700 font-medium hover:text-green-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to main
            </button>
          )}
        </div>

        {/* Molecule Cards Grid - 使用memo组件和高效状态管理提高性能 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto">
          {currentMoleculeData.map((molecule) => (
            <MoleculeCard 
              key={`${viewMode}-${molecule.id}`}
              id={molecule.id} 
              imageSrc={molecule.src} 
              isSelected={molecule.id === 'Cytokinins' && viewMode === 'cytokinin'}
              isSubItem={viewMode === 'cytokinin' && molecule.id !== 'Cytokinins'}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 