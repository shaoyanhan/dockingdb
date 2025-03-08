import { useState, useEffect, createContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MolstarViewer from '../components/MolstarViewer';

// 创建全屏状态上下文，用于在组件之间共享
export const FullscreenContext = createContext<boolean>(false);

// 从MoleculeTablePage传递的表格状态类型
interface TableState {
  pageIndex: number;
  rowsPerPage: number;
  globalFilter: string;
  withoutPDX: boolean;
  manualPageIndex: string; // 添加手动页码输入框状态
}

interface StructurePageState {
  pocketId: string;
  pdbId: string;
  structTitle: string;
  paperTitle: string;
  paperLink: string;
  tableState?: TableState; // 添加可选的表格状态
  sourcePage?: 'table' | 'search'; // 添加来源页面标识
}

interface MolecularData {
  gridScore: string;
  gridVdwEnergy: string;
  gridEsEnergy: string;
  internalEnergyRepulsive: string;
  dockRotatableBonds: string;
  molecularWeight: string;
  formalCharge: string;
}

const MoleculeStructurePage = () => {
  const { moleculeId, pocketId } = useParams<{ moleculeId: string, pocketId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StructurePageState | undefined;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [molecularData, setMolecularData] = useState<MolecularData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 将分子ID转换为API路径中需要的格式
  const formatMoleculeNameForApi = (name: string): string => {
    if (!name) return '';
    
    // 检查是否包含空格（多个单词）
    if (name.includes(' ')) {
      // 转换为小写并用下划线连接
      return name.toLowerCase().replace(/\s+/g, '_');
    } else {
      // 单个单词直接转换为小写
      return name.toLowerCase();
    }
  };

  // 获取PDB文件和MOL2文件的URL
  const getPdbUrl = (pdbId: string): string => {
    return `https://cbi.gxu.edu.cn/download/yhshao/DockingDB/structure/pdb/${pdbId}_rec_NoH.pdb`;
  };

  const getMol2Url = (molecule: string, pocket: string): string => {
    const formattedName = formatMoleculeNameForApi(molecule || '');
    return `https://cbi.gxu.edu.cn/download/yhshao/DockingDB/structure/mol2/${formattedName}/${pocket}_scored.mol2`;
  };

  // 解析MOL2文件获取分子数据
  const parseMol2Data = async () => {
    if (!moleculeId || !pocketId) return;
    
    try {
      const mol2Url = getMol2Url(moleculeId, pocketId);
      const response = await fetch(mol2Url);
      
      if (!response.ok) {
        throw new Error(`Error fetching MOL2 file: ${response.statusText}`);
      }
      
      const text = await response.text();
      
      // 解析MOL2文件中的数据
      const gridScoreMatch = text.match(/##########\s+Grid_Score:\s+([-\d.]+)/);
      const gridVdwMatch = text.match(/##########\s+Grid_vdw_energy:\s+([-\d.]+)/);
      const gridEsMatch = text.match(/##########\s+Grid_es_energy:\s+([-\d.]+)/);
      const internalEnergyMatch = text.match(/##########\s+Internal_energy_repulsive:\s+([-\d.]+)/);
      const rotatableBondsMatch = text.match(/##########\s+DOCK_Rotatable_Bonds:\s+(\d+)/);
      const molecularWeightMatch = text.match(/##########\s+Molecular_Weight:\s+([-\d.]+)/);
      const formalChargeMatch = text.match(/##########\s+Formal_Charge:\s+([-\d.]+)/);
      
      setMolecularData({
        gridScore: gridScoreMatch ? gridScoreMatch[1] : 'N/A',
        gridVdwEnergy: gridVdwMatch ? gridVdwMatch[1] : 'N/A',
        gridEsEnergy: gridEsMatch ? gridEsMatch[1] : 'N/A',
        internalEnergyRepulsive: internalEnergyMatch ? internalEnergyMatch[1] : 'N/A',
        dockRotatableBonds: rotatableBondsMatch ? rotatableBondsMatch[1] : 'N/A',
        molecularWeight: molecularWeightMatch ? molecularWeightMatch[1] : 'N/A',
        formalCharge: formalChargeMatch ? formalChargeMatch[1] : 'N/A'
      });
      
    } catch (err) {
      console.error('Failed to parse MOL2 data:', err);
      setError('Failed to load molecular data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    parseMol2Data();
  }, [moleculeId, pocketId]);

  // 获取PDB DOI链接
  const getPdbDoiUrl = (pdbId: string): string => {
    return `https://doi.org/10.2210/pdb${pdbId}/pdb`;
  };

  // 处理文件下载
  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理全屏状态变化
  const handleFullscreenChange = (fullscreenState: boolean) => {
    setIsFullscreen(fullscreenState);
    // 通过window对象共享全屏状态，使ClusterMap组件能够访问
    window.isStructurePageFullscreen = fullscreenState;
  };

  // 处理返回按钮点击，保持表格状态
  const handleBackClick = () => {
    if (state?.sourcePage === 'search' && state?.tableState) {
      // 如果来源是搜索页面，并且有保存的表格状态，则导航回搜索页面
      navigate('/search', {
        state: {
          previousSearch: true, // 标记这是从结构页面返回
          tableState: state.tableState
        }
      });
    } else if (state?.tableState) {
      // 如果来源是表格页面或未指定，但有表格状态，则导航回表格页面
      navigate(`/table/${moleculeId}`, { state: state.tableState });
    } else {
      // 如果没有保存的状态，尝试检查分子ID
      if (moleculeId?.includes('_')) {
        // 如果分子ID包含下划线，可能是从搜索页面来的
        navigate('/search');
      } else {
        // 默认导航回表格页面
        navigate(`/table/${moleculeId}`);
      }
    }
  };

  return (
    <FullscreenContext.Provider value={isFullscreen}>
      <div className={`min-h-screen flex flex-col bg-white ${isFullscreen ? 'overflow-hidden' : ''}`}>
        {!isFullscreen && <Header />}
        
        <main className={`flex-grow ${isFullscreen ? 'fixed inset-0 z-50' : 'container mx-auto px-4 py-8'}`}>
          {!isFullscreen && (
            <>
              <button 
                className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center mb-6"
                onClick={handleBackClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              
              <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Docking Structure: {pocketId}
              </h1>
            </>
          )}
          
          <div className={`${isFullscreen ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
            {/* 左侧Molstar查看器 */}
            <div className={`${isFullscreen ? 'w-full h-full' : 'lg:col-span-2 relative h-[650px]'}`}>
              {loading ? (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-green-700 border-r-2 border-green-700 border-b-2 border-green-700 border-l-2 border-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading structure...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button 
                      onClick={parseMol2Data}
                      className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <MolstarViewer 
                  pdbFilePath={getPdbUrl(state?.pdbId || '')} 
                  mol2FilePath={getMol2Url(moleculeId || '', pocketId || '')}
                  height={isFullscreen ? "100vh" : "100%"}
                  onFullscreenChange={handleFullscreenChange}
                />
              )}
            </div>
            
            {/* 右侧分子信息 */}
            {!isFullscreen && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-md h-[650px] overflow-y-auto">
                <h2 className="text-xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Molecular Information
                </h2>
                
                <div className="space-y-6">
                  {/* 基本信息段 */}
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-green-800 mb-3 border-l-4 border-green-500 pl-2">
                      Protein Information
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          PDB ID
                        </div>
                        <div className="font-medium text-lg">{state?.pdbId || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Structure Title
                        </div>
                        <div className="font-medium mt-1 bg-gray-50 p-2 rounded">{state?.structTitle || 'N/A'}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          PDB DOI
                        </div>
                        <a 
                          href={getPdbDoiUrl(state?.pdbId || '')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium mt-1 inline-block bg-blue-50 px-2 py-1 rounded"
                        >
                          {getPdbDoiUrl(state?.pdbId || '')}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* 分子参数段 */}
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-green-800 mb-3 border-l-4 border-green-500 pl-2">
                      Docking Parameters
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Grid Score</div>
                        <div className="font-semibold text-green-700">{molecularData?.gridScore || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Grid Vdw Energy</div>
                        <div className="font-semibold text-green-700">{molecularData?.gridVdwEnergy || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Grid Es Energy</div>
                        <div className="font-semibold text-green-700">{molecularData?.gridEsEnergy || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Internal Energy</div>
                        <div className="font-semibold text-green-700">{molecularData?.internalEnergyRepulsive || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Rotatable Bonds</div>
                        <div className="font-semibold text-green-700">{molecularData?.dockRotatableBonds || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-xs text-gray-500">Molecular Weight</div>
                        <div className="font-semibold text-green-700">{molecularData?.molecularWeight || 'Loading...'}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded col-span-2">
                        <div className="text-xs text-gray-500">Formal Charge</div>
                        <div className="font-semibold text-green-700">{molecularData?.formalCharge || 'Loading...'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 下载文件段 */}
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-green-800 mb-3 border-l-4 border-green-500 pl-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Files
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <div className="text-sm text-gray-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDB File (Protein Structure)
                        </div>
                        <button
                          onClick={() => handleDownload(getPdbUrl(state?.pdbId || ''), `${state?.pdbId || 'protein'}_rec_NoH.pdb`)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDB File
                        </button>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <div className="text-sm text-gray-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          MOL2 File (Ligand Structure)
                        </div>
                        <button
                          onClick={() => handleDownload(getMol2Url(moleculeId || '', pocketId || ''), `${pocketId || 'ligand'}_scored.mol2`)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download MOL2 File
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 论文信息段 */}
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium text-green-800 mb-3 border-l-4 border-green-500 pl-2">
                      Reference Paper
                    </h3>
                    
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Paper Title
                      </div>
                      <a 
                        href={state?.paperLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {state?.paperTitle || 'N/A'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {!isFullscreen && <Footer />}
      </div>
    </FullscreenContext.Provider>
  );
};

// 声明全局变量，用于在组件之间共享全屏状态
declare global {
  interface Window {
    isStructurePageFullscreen?: boolean;
  }
}

export default MoleculeStructurePage; 