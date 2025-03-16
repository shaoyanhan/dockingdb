import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import MoleculeCard from '../components/MoleculeCard';
import Tooltip from '../components/Tooltip';

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
import DZImage from '../assets/images/DZ.png';

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

// Cytokinins二级数据 - 重新排序并添加DZ
const cytokininData: MoleculeData[] = [
  { id: 'KIN', src: KinImage },
  { id: 'iP', src: iPImage },
  { id: 'BA', src: BAImage },
  { id: 'tZ', src: tZImage },
  { id: 'cZ', src: cZImage },
  { id: 'DZ', src: DZImage },
  { id: 'Diphenylurea', src: DiphenylureaImage },
  { id: 'TD', src: TDImage },
];

const HomePage = () => {
  const navigate = useNavigate();
  
  // Introduction section state
  const [showIntro, setShowIntro] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);

  // Toggle functions
  const toggleIntro = useCallback(() => {
    setShowIntro(prev => !prev);
    setShowReferences(false);
  }, []);

  const toggleReferences = useCallback(() => {
    setShowReferences(prev => !prev);
    setShowIntro(false);
  }, []);
  
  // 使用单一的viewMode状态来管理显示模式，不再需要多个状态变量
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  
  // 获取当前应该显示的分子数据
  const currentMoleculeData = viewMode === 'main' ? mainMoleculeData : cytokininData;
  
  // 处理搜索逻辑
  const handleSearch = useCallback((query: string, withoutPDX: boolean) => {
    console.log('Searching for:', query, 'Without PDX:', withoutPDX);
    
    if (query.trim()) {
      // 如果有查询内容，导航到全局搜索页面，并确保使用正确的参数名
      navigate(`/search?query=${encodeURIComponent(query)}&without_pdx=${withoutPDX}&page_index=0&page_size=10&manualPageIndex=1`);
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
      setViewMode('cytokinin');
    } else if (id === 'TD') {
      // TD卡片不导航 - 我们会在卡片组件中处理禁用状态
      return;
    } else {
      // 其他卡片直接导航到表格页面
      navigate(`/table/${id}`);
    }
  }, [navigate, viewMode]);

  const renderCytokininCard = useCallback((molecule: MoleculeData) => {
    // 为Cytokinins卡片添加特殊处理
    if (molecule.id === 'Cytokinins') {
      return (
        <Tooltip 
          key={`${viewMode}-${molecule.id}`}
          content="Click to view its subclasses"
          position="top"
          className="block"
        >
          <MoleculeCard 
            id={molecule.id} 
            imageSrc={molecule.src} 
            isSelected={false}
            isSubItem={false}
            onClick={handleCardClick}
          />
        </Tooltip>
      );
    }
    
    return (
      <MoleculeCard 
        key={`${viewMode}-${molecule.id}`}
        id={molecule.id} 
        imageSrc={molecule.src} 
        isSelected={false}
        isSubItem={false}
        onClick={handleCardClick}
      />
    );
  }, [viewMode, handleCardClick]);

  const renderCytokininSubCard = useCallback((molecule: MoleculeData) => {
    if (molecule.id === 'TD') {
      return (
        <Tooltip 
          key={`${viewMode}-${molecule.id}`}
          content="Waiting for data update"
          position="top"
          className="block"
        >
          {/* <div className="opacity-70 cursor-not-allowed"> */}
          <div className="cursor-not-allowed">
            <MoleculeCard 
              id={molecule.id} 
              imageSrc={molecule.src} 
              isSelected={false}
              isSubItem={true}
              onClick={() => {}}
            />
          </div>
        </Tooltip>
      );
    }
    
    return (
      <MoleculeCard 
        key={`${viewMode}-${molecule.id}`}
        id={molecule.id} 
        imageSrc={molecule.src} 
        isSelected={false}
        isSubItem={true}
        onClick={handleCardClick}
      />
    );
  }, [viewMode, handleCardClick]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Introduction Section */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="font-semibold text-lg text-gray-800">DockingDB</h2>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={toggleIntro}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${showIntro ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Introduction</span>
                  </div>
                </button>
                <button 
                  onClick={toggleReferences}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${showReferences ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>References</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div ref={introRef} className="overflow-hidden transition-all duration-500 ease-in-out">
              {!showIntro && !showReferences && (
                <div className="py-2 text-base text-gray-600 italic text-center font-bold"> 
                  Click on Introduction or References to learn more about DockingDB.
                </div>
              )}
              
              {showIntro && (
                <div className="mt-3 animate-fadeIn bg-white bg-opacity-60 p-4 rounded-md">
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    <span className="font-semibold text-green-700">DockingDB</span> is a specialized reverse docking database integrating <span className="font-medium">5,794</span> experimentally resolved plant protein structures retrieved from the RCSB Protein Data Bank (PDB) as of May 2021. DockingDB is developed as an automated extension of UCSF DOCK6 (Allen et al., 2015), which addresses the scalability limitations of traditional molecular docking by implementing parallelized workflows for plant proteome-scale reverse virtual screening.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    The pipeline automates preprocessing of input structures through a multi-step protocol: plant protein structures from PDB undergo removal of crystallographic waters and heteroatoms, followed by hydrogenation, residue standardization, and charge assignment using AMBER ff14SB parameters before conversion to MOL2 format; ligand-bound structures are stripped of small molecules prior to processing, while dehydrogenated PDB files are generated in parallel for pocket detection.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Pocket prediction employs context-specific strategies—sphgen-based clustering identifies the largest cavity for ligand-free structures, whereas ligand-proximal 8-Å spheres guide pocket definition in ligand-bound counterparts—executed via UCSF Chimera's Python API (Pettersen et al., 2004) to batch-process the above proteins into <span className="font-medium">18,795</span> dockable pockets. Ligand preprocessing standardizes PDB/MOL2/SMILES inputs into canonical MOL2 formats through hydrogen addition and AM1-BCC charge calculation, with a SMILES-hashed caching system eliminating redundant docking computations. This integrated approach enables full automation from raw structural data to dockable complexes, achieving a high throughput increase over manual DOCK6 operations while maintaining high pocket prediction accuracy against expert-curated benchmarks, thereby empowering large-scale discovery of phytohormone (including cytokine, auxin, brassinolide, abscisic acid, gibberellic acid, salicylic acid and strigolactone) interaction networks.
                  </p>
                </div>
              )}
              
              {showReferences && (
                <div className="mt-3 animate-fadeIn bg-white bg-opacity-60 p-4 rounded-md">
                  <h3 className="font-medium text-gray-800 mb-3">References</h3>
                  <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                    <li className="pl-3 border-l-4 border-green-400 bg-green-50 p-3 rounded-md shadow-sm">
                      <span className="text-green-700 font-medium">Guo YX, Liu F, Xu XD, Xu G, Ye SY, Shao YH, Kong Y, Su Z, Zhao, Q, Fu Q, Ma J, Song JM, Cai WG, Ming ZH & Chen LL.</span> Computational-experimental convergence in cytokinin signaling: reverse docking primes MD-guided discovery of novel binding proteins with genetic validation, Submitted.
                      <div className="mt-2 text-sm italic text-red-600 flex items-center bg-red-50 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>If you used the data from the database, please cite this paper kindly!</span>
                      </div>
                    </li>
                    <li className="pl-3 border-l-4 border-blue-300 p-3 rounded-md hover:bg-blue-50 transition-colors">
                      <span className="font-medium">Allen WJ, Balius TE, Mukherjee S, Brozell SR, Moustakas DT, Lang PT, Case DA, Kuntz ID & Rizzo RC.</span> (2015). DOCK 6: Impact of new features and current docking performance. <span className="italic">Comput. Chem.</span>, 36(15), 1132-1156.
                    </li>
                    <li className="pl-3 border-l-4 border-blue-300 p-3 rounded-md hover:bg-blue-50 transition-colors">
                      <span className="font-medium">Pettersen EF, Goddard TD, Huang CC, Couch GS, Greenblatt DM, Meng EC & Ferrin TE.</span> (2004). UCSF Chimera—a visualization system for exploratory research and analysis. <span className="italic">Comput. Chem</span>, 25(13), 1605-1612.
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {/* 添加可视化指示器，显示当前在哪个视图 */}
        <div className="mb-4 flex justify-center">
          {viewMode === 'cytokinin' && (
            <button 
              onClick={() => setViewMode('main')}
              className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse-slow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to main
            </button>
          )}
        </div>

        {/* Molecule Cards Grid - 使用memo组件和高效状态管理提高性能 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12 max-w-6xl mx-auto">
          {viewMode === 'main' 
            ? currentMoleculeData.map(renderCytokininCard)
            : currentMoleculeData.map(renderCytokininSubCard)
          }
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage; 