import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [withoutPDX, setWithoutPDX] = useState(false);
  
  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16">
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search ID or any text ..."
            className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg mb-2 sm:mb-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          className="bg-green-700 text-white text-lg font-semibold px-8 py-3 rounded-r-md hover:bg-green-800 transition-all duration-200 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
        <div className="text-green-700 mb-2 sm:mb-0 flex items-center">
          <span className="mr-1">Example:</span>
          <span 
            className="cursor-pointer hover:underline hover:text-green-800 focus:text-green-900 focus:outline-none focus:ring-1 focus:ring-green-600 px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => handleExampleClick("6H3X")}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExampleClick("6H3X")}
          >
            6H3X
          </span>
          <span className="mx-1">,</span>
          <span 
            className="cursor-pointer hover:underline hover:text-green-800 focus:text-green-900 focus:outline-none focus:ring-1 focus:ring-green-600 px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => handleExampleClick("cytokinin dehydrogenase")}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExampleClick("cytokinin dehydrogenase")}
          >
            cytokinin dehydrogenase
          </span>
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="without-pdx" 
            className="w-5 h-5 mr-2 cursor-pointer accent-green-700"
            checked={withoutPDX}
            onChange={(e) => setWithoutPDX(e.target.checked)} 
          />
          <label 
            htmlFor="without-pdx" 
            className="text-black text-lg cursor-pointer"
          >
            Without PDX
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 