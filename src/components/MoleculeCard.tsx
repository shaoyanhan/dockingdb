import { useNavigate } from 'react-router-dom';
import { useState, useCallback, memo } from 'react';

interface MoleculeCardProps {
  id: string;
  imageSrc?: string;
  isSelected?: boolean;
  isSubItem?: boolean;
  onClick?: (id: string) => void;
}

// 使用React.memo包裹组件以避免不必要的重渲染
const MoleculeCard = memo(({ id, imageSrc, isSelected = false, isSubItem = false, onClick }: MoleculeCardProps) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  // 使用useCallback优化点击处理函数
  const handleClick = useCallback((e: React.MouseEvent) => {
    // 阻止事件冒泡
    e.stopPropagation();
    
    console.log(`MoleculeCard clicked: ${id}`);
    
    if (onClick) {
      onClick(id);
    } else if (!onClick && !isSubItem) {
      // 如果没有点击处理函数且不是子项，直接导航
      navigate(`/molecule/${id}`);
    }
  }, [id, onClick, navigate, isSubItem]);

  // 使用useCallback优化鼠标事件处理函数
  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  // 根据是否选中和是否为子项使用不同的样式
  const cardClasses = `
    rounded-md overflow-hidden shadow-md 
    transition-all duration-300 cursor-pointer
    ${isHovering ? 'transform scale-105' : ''}
    ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''}
    ${isSubItem ? 'bg-green-600' : 'bg-green-700'}
  `;

  return (
    <div 
      className={cardClasses} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`aspect-square flex items-center justify-center p-4 ${isSubItem ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-green-600 to-green-700'}`}>
        <div className="w-full h-full relative flex items-center justify-center">
          {imageSrc ? (
            <div className={`
              w-4/5 h-4/5 rounded-full flex items-center justify-center 
              bg-gradient-radial from-white via-green-50 to-green-200
              ${isHovering ? 'from-white via-green-100 to-green-300' : ''}
              ${isSelected ? 'ring-2 ring-yellow-300' : ''}
              transition-all duration-300
            `}>
              <img 
                src={imageSrc} 
                alt={`${id} molecule`} 
                className="max-w-[80%] max-h-[80%] object-contain" 
              />
            </div>
          ) : (
            <div className={`
              w-4/5 h-4/5 rounded-full flex items-center justify-center 
              ${isSelected ? 'bg-gradient-to-br from-yellow-300/40 to-yellow-500/40' : 'bg-gradient-to-br from-green-500/40 to-green-600/40'}
              ${isHovering ? 'opacity-80' : ''}
            `}>
              <span className="text-white text-opacity-70">{isSubItem ? 'Sub' : 'Molecule'}</span>
            </div>
          )}
        </div>
      </div>
      <div className={`py-2 text-center ${isSubItem ? 'bg-green-600' : 'bg-green-700'}`}>
        <span className="text-white text-xl font-medium">{id}</span>
      </div>
    </div>
  );
});

// 添加显示名称，有助于开发调试
MoleculeCard.displayName = 'MoleculeCard';

export default MoleculeCard; 