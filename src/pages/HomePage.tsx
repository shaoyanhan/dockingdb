import { useState } from 'react';
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

// 初始的分子数据
const initialMoleculeImages = [
  { id: 'Cytokinins', src: CytokininsImage },
  { id: 'Auxin', src: AuxinImage },
  { id: 'Brassinolide', src: BrassinolideImage },
  { id: 'Abscisic acid', src: Abscisic_acidImage },
  { id: 'Gibberellic acid', src: Gibberellic_acidImage },
  { id: 'Salicylic acid', src: Salicylic_acidImage },
  { id: 'Jasmonic acid', src: Jasmonic_acidImage },
  { id: 'Strigolactone', src: StrigolactoneImage },
];

// Cytokinins的二级目录数据
const cytokininSubItems = [
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
  const [searchResults, setSearchResults] = useState(initialMoleculeImages);
  const [selectedCytokinins, setSelectedCytokinins] = useState(false);
  
  // 处理搜索逻辑
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // 重置Cytokinins选中状态
    setSelectedCytokinins(false);
    // 这里应该做真正的搜索，但现在简单返回初始数据
    setSearchResults(initialMoleculeImages);
  };

  // 处理卡片点击
  const handleCardClick = (id: string) => {
    if (id === 'Cytokinins') {
      // 切换Cytokinins的选中状态
      if (selectedCytokinins) {
        // 如果已经选中了，再次点击取消选中并恢复初始卡片
        setSelectedCytokinins(false);
        setSearchResults(initialMoleculeImages);
      } else {
        // 如果没选中，选中并显示二级目录
        setSelectedCytokinins(true);
        // 保留Cytokinins卡片，添加它的二级目录卡片
        setSearchResults([
          { id: 'Cytokinins', src: CytokininsImage },
          ...cytokininSubItems
        ]);
      }
    } else if (selectedCytokinins) {
      // 如果在Cytokinins选中状态下点击了二级目录项，导航到表格页
      navigate(`/table/${id}`);
    } else {
      // 其他普通卡片的点击，导航到表格页
      navigate(`/table/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <SearchBar onSearch={handleSearch} />

        {/* Molecule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto">
          {searchResults.map((molecule) => (
            <MoleculeCard 
              key={molecule.id} 
              id={molecule.id} 
              imageSrc={molecule.src} 
              isSelected={molecule.id === 'Cytokinins' && selectedCytokinins}
              isSubItem={selectedCytokinins && molecule.id !== 'Cytokinins'}
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