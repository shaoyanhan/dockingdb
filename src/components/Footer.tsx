import { useEffect, useRef } from 'react';

// 创建一个组件来安全地加载clustrmaps脚本
const ClusterMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
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
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center overflow-hidden" 
      style={{ 
        minWidth: '100%', 
        minHeight: '100%',
        position: 'relative'
      }}
    />
  );
};

const Footer = () => {
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
            <ClusterMap />
          </div>
        </div>
        <div className="text-white text-center">
          Copyright © 2025-2035 All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer; 