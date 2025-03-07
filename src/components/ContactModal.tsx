import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactPerson {
  name: string;
  email?: string;
}

interface ContactLocation {
  name: string;
  address: string;
  website?: string;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  // 定义联系人信息
  const webDevelopers: ContactPerson[] = [
    { name: 'Yanhan Shao', email: '1740569155@qq.com' },
    { name: 'Yixiong Guo', email: '1740569155@qq.com' },
    { name: 'Xingdong Xu' },
    
  ];
  
  const experimentTeam: ContactPerson[] = [
    { name: 'Yixiong Guo', email: '1740569155@qq.com' },
    { name: 'Xingdong Xu' },
    { name: 'Fenmei Liu' },
    { name: 'Guolv Xu' },
    { name: 'Si-Ying Ye' },
    { name: 'Yanqiong Kong' },
    { name: 'Zihui Su' },
    { name: 'Qiaoqiao Zhao' },
    { name: 'Qiong Fu' },
    { name: 'Jinxue Ma' },
  ];
  
  const professors: ContactPerson[] = [
    { name: 'Jia-Ming Song' },
    { name: 'Wenguo Cai' },
    { name: 'Zhenhua Ming' },
    { name: 'Ling-Ling Chen' },
  ];
  
  const locations: ContactLocation[] = [
    { 
      name: 'Location 1', 
      address: 'College of Informatics, Huazhong Agricultural University, Wuhan 430070, China',
      website: 'https://coi.hzau.edu.cn/'
    },
    { 
      name: 'Location 2', 
      address: 'State Key Laboratory for Conservation and Utilization of Subtropical Agro-bioresources, College of Life Science and Technology, Guangxi University, Nanning 530004, China',
      website: 'https://sklcusa.gxu.edu.cn/'
    },
    { 
      name: 'Location 3', 
      address: 'College of Agronomy and Biotechnology, Southwest University, Chongqing 400715, China'
    },
  ];
  
  const projectSource = 'https://github.com/shaoyanhan/DockingDB';
  
  // 处理复制邮箱到剪贴板
  const handleCopyEmail = (email: string, name: string) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedEmail(name);
        setTimeout(() => setCopiedEmail(null), 2000);
      });
  };
  
  // 处理点击外部关闭弹窗
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // 渲染联系人列表
  const renderContactList = (contacts: ContactPerson[], type: string) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
        {/* 代码中使用了条件渲染逻辑 {type === 'web' && (...)}，表示只有在 type 的值匹配时，才会渲染对应的 SVG 图标或文字。 */}
        {/* type 的值为 'web' 时，渲染 Web Development 的 SVG 图标 */}
        {type === 'web' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
        {type === 'experiment' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        )}
        {type === 'professor' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        )}
        {/* type 的值为 'web' 时，渲染 Web Development 的文字 */}
        {type === 'web' && 'Web Development'}
        {type === 'experiment' && 'Experiment'}
        {type === 'professor' && 'Professor'}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {contacts.map((contact, index) => (
          <div 
            key={index} 
            className={`
              rounded-full px-3 py-1.5 text-sm font-medium
              ${contact.email ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer border border-green-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}
              transition-colors duration-200 flex items-center
            `}
            onClick={() => contact.email && handleCopyEmail(contact.email, contact.name)}
            title={contact.email ? `Click to copy ${contact.name}'s email` : ''}
          >
            {contact.name}
            {contact.email && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {/* 复制邮箱成功后，显示的提示文字, 使用状态变量 copiedEmail 来判断是否显示提示文字，由于一个name可能出现多次，所以可能会同时显示多个提示文字*/}
            {copiedEmail === contact.name && (
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                Copied!
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  // 渲染地点信息
  const renderLocations = () => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Locations
      </h3>
      
      <div className="space-y-3">
        {locations.map((location, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h4 className="font-medium text-gray-800">{location.name}</h4>
            <p className="text-gray-600 text-sm mt-1">{location.address}</p>
            
            {location.website && (
              <a 
                href={location.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleOutsideClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-gray-600 mb-8 flex items-start border-l-4 border-green-600 pl-4 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Should there be any question, please let us know without hesitation!</p>
          </div>
          
          {renderContactList(webDevelopers, 'web')}
          {renderContactList(experimentTeam, 'experiment')}
          {renderContactList(professors, 'professor')}
          {renderLocations()}
          
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-green-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Project Source
            </h3>
            
            <a 
              href={projectSource} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-800 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 