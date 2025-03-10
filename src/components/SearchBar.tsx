import { useState, useEffect, useCallback } from 'react';
import Tooltip from './Tooltip';

interface SearchBarProps {
  onSearch?: (query: string, withoutPDX: boolean) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [withoutPDX, setWithoutPDX] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
  };

  // Debounced search implementation
  const debouncedSearch = useCallback(
    (() => {
      let timer: NodeJS.Timeout | null = null;
      return (value: string, withPDX: boolean) => {
        setIsLoading(true);
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          if (onSearch) {
            onSearch(value, withPDX);
          }
          setIsLoading(false);
        }, 1000); // 1 second debounce delay
      };
    })(),
    [onSearch]
  );

  // Trigger debounced search when search query or withoutPDX changes
  useEffect(() => {
    debouncedSearch(searchQuery, withoutPDX);
    return () => {
      setIsLoading(false);
    };
  }, [searchQuery, withoutPDX, debouncedSearch]);

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16">
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search ID or any text for docking results ..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-green-600 border-l-2 border-transparent"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
        <div className="text-green-600 mb-2 sm:mb-0 flex items-center">
          <span className="mr-1">Example:</span>
          <span 
            className="cursor-pointer hover:underline hover:text-green-700 focus:text-green-800 focus:outline-none focus:ring-1 focus:ring-green-500 px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => handleExampleClick("5JCN")}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExampleClick("5JCN")}
          >
            5JCN
          </span>
          <span className="mx-1">,</span>
          <span 
            className="cursor-pointer hover:underline hover:text-green-700 focus:text-green-800 focus:outline-none focus:ring-1 focus:ring-green-500 px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => handleExampleClick("abscisic_acid")}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExampleClick("abscisic_acid")}
          >
            abscisic_acid
          </span>
          <span className="mx-1">,</span>
          <span 
            className="cursor-pointer hover:underline hover:text-green-700 focus:text-green-800 focus:outline-none focus:ring-1 focus:ring-green-500 px-1 py-0.5 rounded-sm transition-colors"
            onClick={() => handleExampleClick("cytokinin dehydrogenase")}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleExampleClick("cytokinin dehydrogenase")}
          >
            cytokinin dehydrogenase
          </span>
        </div>
        <div className="flex items-center">
          <Tooltip 
            content="Filter out docking results containing PDX compounds"
            position="bottom"
            className="flex items-center"
          >
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="without-pdx" 
                className="w-5 h-5 mr-2 cursor-pointer accent-green-600"
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
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 