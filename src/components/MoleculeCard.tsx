import { useNavigate } from 'react-router-dom';

interface MoleculeCardProps {
  id: string;
  imageSrc?: string;
  isSelected?: boolean;
  isSubItem?: boolean;
  onClick?: (id: string) => void;
}

const MoleculeCard = ({ id, imageSrc, isSelected = false, isSubItem = false, onClick }: MoleculeCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    } else if (!onClick && !isSubItem) {
      // 如果没有点击处理函数且不是子项，直接导航
      navigate(`/molecule/${id}`);
    }
  };

  // 根据是否选中和是否为子项使用不同的样式
  const cardClasses = `
    rounded-md overflow-hidden shadow-md 
    transition-all duration-300 hover:scale-105 cursor-pointer
    ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''}
    ${isSubItem ? 'bg-green-600' : 'bg-green-700'}
  `;

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className={`aspect-square flex items-center justify-center p-4 ${isSubItem ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-green-600 to-green-700'}`}>
        <div className="w-full h-full relative flex items-center justify-center">
          {imageSrc ? (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-md p-2">
              <img 
                src={imageSrc} 
                alt={`${id} molecule`} 
                className="max-w-full max-h-full object-contain" 
              />
            </div>
          ) : (
            <div className={`w-4/5 h-4/5 rounded-full flex items-center justify-center ${isSelected ? 'bg-gradient-to-br from-yellow-300/40 to-yellow-500/40' : 'bg-gradient-to-br from-green-500/40 to-green-600/40'}`}>
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
};

export default MoleculeCard; 