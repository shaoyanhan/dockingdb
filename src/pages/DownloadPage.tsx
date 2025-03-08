import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// 定义通知类型
interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info';
}

// 表格文件数据
const tableFiles = [
  { id: 1, name: 'Abscisic acid', filename: 'abscisic_acid.csv', size: '4.6MB' },
  { id: 2, name: 'Auxin', filename: 'auxin.csv', size: '4.6MB' },
  { id: 3, name: 'Ba', filename: 'ba.csv', size: '4.6MB' },
  { id: 4, name: 'Brassinolide', filename: 'brassinolide.csv', size: '4.4MB' },
  { id: 5, name: 'Cz', filename: 'cz.csv', size: '4.6MB' },
  { id: 6, name: 'Diphenylurea', filename: 'diphenylurea.csv', size: '4.5MB' },
  { id: 7, name: 'Gibberellic acid', filename: 'gibberellic_acid.csv', size: '4.6MB' },
  { id: 8, name: 'IP', filename: 'ip.csv', size: '4.6MB' },
  { id: 9, name: 'Jasmonic acid', filename: 'jasmonic_acid.csv', size: '4.6MB' },
  { id: 10, name: 'Kin', filename: 'kin.csv', size: '4.6MB' },
  { id: 11, name: 'Salicylic acid', filename: 'salicylic_acid.csv', size: '4.6MB' },
  { id: 12, name: 'Strigolactone', filename: 'strigolactone.csv', size: '4.6MB' },
  { id: 13, name: 'Td', filename: 'td.csv', size: '4.6MB' },
  { id: 14, name: 'Tz', filename: 'tz.csv', size: '4.6MB' },
];

// 结构文件数据
const structureFiles = [
  { id: 1, name: 'Molecule structures (MOL2)', filename: 'mol2.tar.gz', size: '143MB' },
  { id: 2, name: 'Protein structures (PDB)', filename: 'pdb.tar.gz', size: '561MB' },
];

const DownloadPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(1);

  // 下载表格文件处理函数
  const handleTableDownload = (filename: string) => {
    const baseUrl = 'https://cbi.gxu.edu.cn/download/yhshao/DockingDB/table/csv/';
    const downloadUrl = `${baseUrl}${filename}`;
    
    // 使用a标签直接下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 添加通知
    addNotification(`正在下载 ${filename}`, 'info');
  };

  // 下载结构文件处理函数
  const handleStructureDownload = (filename: string) => {
    const baseUrl = 'https://cbi.gxu.edu.cn/download/yhshao/DockingDB/structure/';
    const downloadUrl = `${baseUrl}${filename}`;
    
    // 使用a标签直接下载
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 添加通知
    addNotification(`正在下载 ${filename}`, 'info');
  };

  // 复制表格链接处理函数
  const handleTableCopyLink = (filename: string) => {
    const baseUrl = 'https://cbi.gxu.edu.cn/download/yhshao/DockingDB/table/csv/';
    const downloadUrl = `${baseUrl}${filename}`;
    
    // 复制链接到剪贴板
    navigator.clipboard.writeText(downloadUrl)
      .then(() => {
        addNotification('下载链接已复制到剪贴板', 'success');
      })
      .catch(() => {
        addNotification('复制链接失败，请手动复制', 'info');
      });
  };

  // 复制结构链接处理函数
  const handleStructureCopyLink = (filename: string) => {
    const baseUrl = 'https://cbi.gxu.edu.cn/download/yhshao/DockingDB/structure/';
    const downloadUrl = `${baseUrl}${filename}`;
    
    // 复制链接到剪贴板
    navigator.clipboard.writeText(downloadUrl)
      .then(() => {
        addNotification('下载链接已复制到剪贴板', 'success');
      })
      .catch(() => {
        addNotification('复制链接失败，请手动复制', 'info');
      });
  };

  // 添加通知
  const addNotification = (message: string, type: 'success' | 'info') => {
    const newNotification = {
      id: nextId,
      message,
      type
    };
    
    setNotifications(prev => [...prev, newNotification]);
    setNextId(prev => prev + 1);
    
    // 3秒后自动移除通知
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Table Files 区块 */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-green-700 text-center mb-10">Table Files</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tableFiles.map(file => (
              <div 
                key={file.id} 
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{file.name}</h3>
                  <div className="flex justify-between mb-4">
                    <p className="text-gray-500 text-sm truncate">{file.filename}</p>
                    <p className="text-green-600 font-medium text-sm">{file.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => handleTableDownload(file.filename)}
                      title="Click to download the file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    
                    <button
                      className="text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={() => handleTableCopyLink(file.filename)}
                      title="Copy the download link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Structure Files 区块 */}
        <section>
          <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">Structure Files</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {structureFiles.map(file => (
              <div 
                key={file.id} 
                className="bg-blue-50 shadow-md rounded-lg overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{file.name}</h3>
                  <div className="flex justify-between mb-4">
                    <p className="text-gray-500 text-sm truncate">{file.filename}</p>
                    <p className="text-blue-600 font-medium text-sm">{file.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => handleStructureDownload(file.filename)}
                      title="Click to download the file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                    
                    <button
                      className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => handleStructureCopyLink(file.filename)}
                      title="Copy the download link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {/* 通知系统 */}
      <div className="fixed bottom-5 right-5 flex flex-col items-end space-y-2 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg max-w-md transform transition-all duration-500 ease-in-out
              ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}
              animate-fadeIn
            `}
            style={{
              animation: 'fadeIn 0.3s ease-in-out, fadeOut 0.3s ease-in-out 2.7s'
            }}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notification.message}
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default DownloadPage; 