import { useEffect, useRef, useState } from 'react';

// 创建一个组件来安全地加载clustrmaps脚本
const ClusterMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStructureFullscreen, setIsStructureFullscreen] = useState(false);
  
  // 检查全屏状态
  useEffect(() => {
    const checkFullscreenStatus = () => {
      // 检查全局变量中的全屏状态
      setIsStructureFullscreen(!!window.isStructurePageFullscreen);
    };
    
    // 立即检查一次
    checkFullscreenStatus();
    
    // 设置定时器周期性检查全屏状态
    const intervalId = setInterval(checkFullscreenStatus, 500);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 加载地图脚本
  useEffect(() => {
    // 如果页面处于全屏模式，不执行任何操作
    if (isStructureFullscreen) return;
    
    // 移除之前的脚本（如果有）
    const existingScript = document.getElementById('clustrmaps');
    if (existingScript) {
      existingScript.remove();
    }
    
    // 创建新的脚本元素
    const script = document.createElement('script');
    script.id = 'clustrmaps';
    script.type = 'text/javascript';
    script.src = '//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=a&t=n&d=kh3SKgdQcoTu97bcmCGU0iL6eoy5_cBCqiHY0o2bL0c&co=15803d';
    script.async = true;

    // 将脚本添加到容器中
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      
      // 监听子元素变化，调整位置和大小
      const observer = new MutationObserver(() => {
        const container = containerRef.current;
        if (container) {
          // 遍历容器中的所有子元素，调整其样式
          Array.from(container.children).forEach(child => {
            if (child instanceof HTMLElement) {
              // 设置基本样式
              child.style.minWidth = '100%';
              child.style.width = '100%';
              child.style.position = 'relative';
              child.style.top = '36px'; // 向上移动以显示完整地图
              child.style.transform = 'scale(1)'; // 缩小以适应容器
              child.style.transformOrigin = 'center top'; // 从顶部居中缩放
              
              // 查找子元素中的 canvas 或 img 元素
              const innerElements = child.querySelectorAll('canvas, img');
              innerElements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.style.width = '100%';
                  el.style.maxWidth = '100%';
                }
              });
            }
          });
        }
      });
      
      // 开始观察DOM变化
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'width']
      });
      
      // 清理函数应该包括断开观察器
      return () => {
        observer.disconnect();
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
    
    // 如果没有成功添加脚本，只返回清理existingScript的函数
    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [isStructureFullscreen]);
  
  // 如果页面处于全屏模式，返回空元素
  if (isStructureFullscreen) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: '60px' }}
    />
  );
};

const Footer = () => {
  // 检查是否处于全屏模式，决定是否渲染ClusterMap
  const [isStructureFullscreen, setIsStructureFullscreen] = useState(false);
  
  useEffect(() => {
    const checkFullscreenStatus = () => {
      setIsStructureFullscreen(!!window.isStructurePageFullscreen);
    };
    
    // 立即检查一次
    checkFullscreenStatus();
    
    // 设置定时器周期性检查全屏状态
    const intervalId = setInterval(checkFullscreenStatus, 500);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <footer className="bg-green-700 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div className="w-60 h-12 bg-white rounded-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center">
            {/* Logo 1 */}
            <a 
              href="https://encoi.hzau.edu.cn/index.htm" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="/src/assets/images/logo_hzau.png" 
                alt="华中农业大学-信息学院"
                className="h-8 w-auto object-contain"
              />
            </a>
          </div>
          <div className="w-50 h-12 bg-white rounded-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center">
            {/* Logo 2 */}
            <a 
              href="https://sklcusa.gxu.edu.cn/English/Home.htm" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src="/src/assets/images/logo_gxu.png" 
                alt="亚热带农业生物资源保护与利用国家重点实验室"
                className="h-8 w-auto ml-3 mr-3 object-contain"
              />
            </a>
          </div>
          <div className="w-40 h-16 bg-white rounded-md hover:scale-105 transition-transform cursor-pointer flex items-center justify-center p-0 overflow-hidden">
            {/* Logo 3 - ClusterMaps */}
            {!isStructureFullscreen && <ClusterMap />}
          </div>
        </div>
        <div className="text-white text-center">
          <p>&copy; {new Date().getFullYear()} DockingDB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// 全局变量声明，用于访问MoleculeStructurePage定义的全屏状态
declare global {
  interface Window {
    isStructurePageFullscreen?: boolean;
  }
}

export default Footer; 