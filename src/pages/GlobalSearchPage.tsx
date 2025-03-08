import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';

// Define the table data type
interface TableRow {
  hormone_type: string;
  rank: number;
  pocket_id: string;
  grid_score: string;
  struct_title: string;
  pdb_id: string;
  paper_title: string;
  paper_link: string;
}

// Define the table data type
interface TableData {
  total: number;
  rows: TableRow[];
}

// Interface for the previous search state
interface PreviousSearchState {
  previousSearch: boolean;
  tableState: {
    pageIndex: number;
    rowsPerPage: number;
    globalFilter: string;
    withoutPDX: boolean;
    manualPageIndex: string;
  };
}

const GlobalSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Prevent initial loading when returning from structure page
  const isReturnFromStructure = useRef(false);
  const initialLoadComplete = useRef(false);
  
  // Check if we're returning from structure page with previous state
  const previousState = location.state as PreviousSearchState | undefined;
  
  // Get query parameters, prioritizing state from structure page
  const queryParam = previousState?.tableState?.globalFilter || searchParams.get('query') || '';
  const withoutPDXParam = previousState?.tableState?.withoutPDX || searchParams.get('withoutPDX') === 'true';
  const pageIndexParam = previousState?.tableState?.pageIndex || parseInt(searchParams.get('pageIndex') || '0', 10);
  const rowsPerPageParam = previousState?.tableState?.rowsPerPage || parseInt(searchParams.get('rowsPerPage') || '30', 10);
  const manualPageIndexParam = previousState?.tableState?.manualPageIndex || (pageIndexParam + 1).toString();
  
  // State management
  const [tableData, setTableData] = useState<TableData>({ total: 0, rows: [] });
  const [loading, setLoading] = useState(!previousState); // Don't show loading if we have previous state
  const [error, setError] = useState<string | null>(null);
  const [withoutPDX, setWithoutPDX] = useState(withoutPDXParam);
  const [globalFilter, setGlobalFilter] = useState(queryParam);
  const [debouncedFilter, setDebouncedFilter] = useState(queryParam);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageParam);
  const [pageIndex, setPageIndex] = useState(pageIndexParam);
  const [manualPageIndex, setManualPageIndex] = useState(manualPageIndexParam);
  const [forceRefresh, setForceRefresh] = useState(0); // Add a force refresh counter
  
  // Track the last successful request to prevent outdated data
  const lastSuccessfulRequest = useRef({
    query: '',
    withoutPDX: false,
    pageIndex: 0,
    pageSize: 30
  });
  
  // Store previous search results
  const [cachedSearchResults, setCachedSearchResults] = useState<{
    query: string;
    withoutPDX: boolean;
    pageIndex: number;
    pageSize: number;
    data: TableData;
  } | null>(null);
  
  // Handle returning from structure page - this runs ONCE
  useEffect(() => {
    if (previousState?.previousSearch && !isReturnFromStructure.current) {
      console.log('Returning from structure page with state:', previousState.tableState);
      isReturnFromStructure.current = true;
      
      // Update URL params without triggering a navigation
      setSearchParams({
        query: previousState.tableState.globalFilter,
        withoutPDX: previousState.tableState.withoutPDX.toString(),
        pageIndex: previousState.tableState.pageIndex.toString(),
        rowsPerPage: previousState.tableState.rowsPerPage.toString()
      }, { replace: true });
      
      // Clear location state to prevent issues on page refresh
      window.history.replaceState({}, '', window.location.pathname + window.location.search);
      
      // If we have cached data for this exact query, use it immediately
      if (cachedSearchResults && 
          cachedSearchResults.query === previousState.tableState.globalFilter &&
          cachedSearchResults.withoutPDX === previousState.tableState.withoutPDX &&
          cachedSearchResults.pageIndex === previousState.tableState.pageIndex &&
          cachedSearchResults.pageSize === previousState.tableState.rowsPerPage) {
        
        console.log('Using cached data for return navigation');
        setTableData(cachedSearchResults.data);
        setLoading(false);
        initialLoadComplete.current = true;
      } else {
        // Otherwise, we'll need to fetch the data
        console.log('No cache available, will fetch data for page', previousState.tableState.pageIndex);
        
        // Mark as not loaded yet
        initialLoadComplete.current = false;
      }
    }
  }, []);
  
  // Debounce filter changes
  useEffect(() => {
    if (isReturnFromStructure.current && !initialLoadComplete.current) {
      // Don't debounce when returning from structure page - we want immediate results
      return;
    }
    
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter);
      
      // Only reset page index for user-initiated filter changes
      if (!isReturnFromStructure.current || initialLoadComplete.current) {
        setPageIndex(0);
        setManualPageIndex('1');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [globalFilter]);
  
  // Fetch data from the backend
  const fetchSearchResults = async () => {
    // Skip fetch if we're returning from structure page and already have the data
    if (isReturnFromStructure.current && 
        !initialLoadComplete.current && 
        previousState?.tableState) {
      
      console.log('Fetching data from structure return, page:', previousState.tableState.pageIndex);
      
      // Make sure we fetch data for the correct page from structure
      const structPageIndex = previousState.tableState.pageIndex;
      const structQuery = previousState.tableState.globalFilter;
      const structWithoutPDX = previousState.tableState.withoutPDX;
      const structRowsPerPage = previousState.tableState.rowsPerPage;
      
      // Ensure parameters match what we should fetch
      if (debouncedFilter !== structQuery) {
        setDebouncedFilter(structQuery);
      }
      if (withoutPDX !== structWithoutPDX) {
        setWithoutPDX(structWithoutPDX);
      }
      if (pageIndex !== structPageIndex) {
        setPageIndex(structPageIndex);
      }
      if (rowsPerPage !== structRowsPerPage) {
        setRowsPerPage(structRowsPerPage);
      }
      
      initialLoadComplete.current = true;
    }
    
    // Check if this is a duplicate request
    if (lastSuccessfulRequest.current.query === debouncedFilter &&
        lastSuccessfulRequest.current.withoutPDX === withoutPDX &&
        lastSuccessfulRequest.current.pageIndex === pageIndex &&
        lastSuccessfulRequest.current.pageSize === rowsPerPage) {
      
      // We've already made this exact request successfully, don't duplicate
      console.log('Skipping duplicate request');
      return;
    }
    
    // Check if we have cached results that match current search parameters
    if (cachedSearchResults && 
        cachedSearchResults.query === debouncedFilter && 
        cachedSearchResults.withoutPDX === withoutPDX && 
        cachedSearchResults.pageIndex === pageIndex && 
        cachedSearchResults.pageSize === rowsPerPage) {
      console.log('Using cached results');
      setTableData(cachedSearchResults.data);
      return;
    }
    
    // Create a request ID for logging
    const requestId = `${debouncedFilter}-${withoutPDX}-${pageIndex}-${rowsPerPage}-${Date.now()}`;
    console.log(`Starting request ${requestId} for page ${pageIndex}`);
    
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL('http://127.0.0.1:8000/api/search/');
      url.searchParams.append('query', debouncedFilter);
      url.searchParams.append('without_pdx', withoutPDX.toString());
      url.searchParams.append('page_index', pageIndex.toString());
      url.searchParams.append('page_size', rowsPerPage.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Request ${requestId} successful, received data for page ${pageIndex}`);
      
      // Update last successful request
      lastSuccessfulRequest.current = {
        query: debouncedFilter,
        withoutPDX: withoutPDX,
        pageIndex: pageIndex,
        pageSize: rowsPerPage
      };
      
      setTableData(data);
      
      // Cache the results
      setCachedSearchResults({
        query: debouncedFilter,
        withoutPDX,
        pageIndex,
        pageSize: rowsPerPage,
        data
      });
      
      // Update URL params silently
      setSearchParams({
        query: debouncedFilter,
        withoutPDX: withoutPDX.toString(),
        pageIndex: pageIndex.toString(),
        rowsPerPage: rowsPerPage.toString()
      }, { replace: true });
      
      // Mark as fully loaded when returning from structure and final data loaded
      if (isReturnFromStructure.current) {
        initialLoadComplete.current = true;
      }
    } catch (err) {
      console.error(`Request ${requestId} failed:`, err);
      setError('Failed to load search results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when parameters change
  useEffect(() => {
    // Handle special case for returning from structure page
    if (isReturnFromStructure.current && !initialLoadComplete.current && previousState?.tableState) {
      console.log('Initial fetch for returning from structure');
      fetchSearchResults();
      return;
    }
    
    // Skip initial fetch if we're returning from structure and already handled it
    if (isReturnFromStructure.current && !initialLoadComplete.current) {
      return;
    }
    
    // Normal case - fetch when params change
    const handler = setTimeout(() => {
      fetchSearchResults();
    }, 50);
    
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedFilter, withoutPDX, pageIndex, rowsPerPage]);
  
  // Define table columns
  const columnHelper = createColumnHelper<TableRow>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('hormone_type', {
      header: 'Hormone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pocket_id', {
      header: 'Pocket ID',
      cell: info => {
        const row = info.row.original;
        return (
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Navigate to structure page
              navigate(`/structure/${row.hormone_type}/${info.getValue()}`, {
                state: {
                  pocketId: info.getValue(),
                  pdbId: row.pdb_id,
                  structTitle: row.struct_title,
                  paperTitle: row.paper_title,
                  paperLink: row.paper_link,
                  tableState: {
                    pageIndex,
                    rowsPerPage,
                    globalFilter: debouncedFilter,
                    withoutPDX,
                    manualPageIndex
                  },
                  sourcePage: 'search' // 添加来源页面标识
                }
              });
            }}
          >
            {info.getValue()}
          </a>
        );
      },
    }),
    columnHelper.accessor('grid_score', {
      header: 'Grid Score',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pdb_id', {
      header: 'PDB ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('struct_title', {
      header: 'Struct Title',
      cell: info => {
        const value = info.getValue();
        return (
          <div 
            className="max-w-md truncate" 
            title={value}
          >
            {value}
          </div>
        );
      },
    }),
    columnHelper.accessor('paper_title', {
      header: 'Paper Title',
      cell: info => {
        const row = info.row.original;
        return (
          <a 
            href={row.paper_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 hover:underline max-w-md truncate block"
            title={info.getValue()}
          >
            {info.getValue()}
          </a>
        );
      },
    }),
  ], [pageIndex, rowsPerPage, debouncedFilter, withoutPDX, manualPageIndex]);
  
  // Set up table instance
  const table = useReactTable({
    data: tableData.rows,
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize: rowsPerPage,
      },
    },
    // Don't automatically reset pagination
    autoResetPageIndex: false,
    // Tell table that we'll manage pagination manually
    manualPagination: true,
    pageCount: Math.ceil(tableData.total / rowsPerPage),
    // Handle page changes from the table component
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize: rowsPerPage,
        });
        
        const newPageIndex = newState.pageIndex;
        
        // Only update if the page is actually different to avoid UI desyncs
        if (newPageIndex !== pageIndex) {
          console.log(`Table pagination change: ${pageIndex} -> ${newPageIndex}`);
          setPageIndex(newPageIndex);
          setManualPageIndex((newPageIndex + 1).toString());
          // Force a refresh when page changes
          setForceRefresh(prev => prev + 1);
        }
      }
    },
    // Use memo to prevent recreating this on every render
    getCoreRowModel: useMemo(() => getCoreRowModel(), []),
  });
  
  // Calculate page numbers for pagination display
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(0);
    
    // If current page is not first page and previous page is not first page, add previous page
    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }
    
    // If current page is not first or last page, add current page
    if (currentPage > 0 && currentPage < pageCount - 1) {
      pages.push(currentPage);
    }
    
    // If current page is not last page and next page is not last page, add next page
    if (currentPage < pageCount - 2) {
      pages.push(currentPage + 1);
    }
    
    // If more than 1 page, always show last page
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }
    
    // Deduplicate and sort
    return [...new Set(pages)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  // Handle manual page change
  const handleManualPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualPageIndex(e.target.value);
  };

  const handleManualPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(manualPageIndex, 10);
    
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      // Only update if the page is actually different
      if (pageNumber - 1 !== pageIndex) {
        console.log(`Manual page change from ${pageIndex} to ${pageNumber - 1}`);
        setPageIndex(pageNumber - 1);
        // Force refresh when manually changing pages
        setForceRefresh(prev => prev + 1);
      }
    } else {
      // Reset to current page if invalid
      setManualPageIndex((pageIndex + 1).toString());
    }
  };

  // Handle withoutPDX change
  const handleWithoutPDXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    // Only update if the value actually changed
    if (newValue !== withoutPDX) {
      console.log(`Without PDX change: ${withoutPDX} -> ${newValue}`);
      setWithoutPDX(newValue);
      setPageIndex(0);
      setManualPageIndex('1');
      // Force refresh when changing filter
      setForceRefresh(prev => prev + 1);
    }
  };

  // Handle global filter change with debouncing built in
  const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue !== globalFilter) {
      console.log(`Filter change: "${globalFilter}" -> "${newValue}"`);
      setGlobalFilter(newValue);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8" key={`main-container-${forceRefresh}`}>
        <div className="mb-6 flex justify-between items-center">
          <button 
            className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
            onClick={() => navigate('/')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          <h1 className="text-2xl font-bold text-green-700">
            Global Searching Results for: {debouncedFilter || "All"}
          </h1>
          
          <div className="select-none">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 mr-2 cursor-pointer accent-green-700"
                checked={withoutPDX}
                onChange={handleWithoutPDXChange}
              />
              <span className="text-lg">Without PDX</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4 flex justify-end">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={globalFilter}
              onChange={handleGlobalFilterChange}
              placeholder="Search across all molecules..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {globalFilter !== debouncedFilter && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-r-2 border-green-700 border-l-2 border-transparent"></div>
              </div>
            )}
          </div>
        </div>
        
        {loading && debouncedFilter === globalFilter ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-green-700 border-r-2 border-green-700 border-b-2 border-green-700 border-l-2 border-transparent"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchSearchResults}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-700 text-white">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th 
                          key={header.id}
                          className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody 
                  className="bg-white divide-y divide-gray-200"
                  key={`page-${pageIndex}-size-${rowsPerPage}`}
                >
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row, rowIndex) => (
                      <tr 
                        key={row.id}
                        className={`
                          ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-green-50'} 
                          hover:bg-green-100 transition-colors
                        `}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td 
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                        No results found. Try a different search term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination component */}
            {tableData.total > 0 && (
              <div className="mt-4 flex flex-wrap justify-between items-center text-sm">
                {/* Show current page and total */}
                <div className="flex items-center mb-2 md:mb-0">
                  <span className="text-gray-600">
                    Showing {pageIndex * rowsPerPage + 1} to{' '}
                    {Math.min(
                      (pageIndex + 1) * rowsPerPage,
                      tableData.total
                    )}{' '}
                    of {tableData.total} rows
                  </span>
                  
                  {/* Select rows per page */}
                  <select
                    value={rowsPerPage}
                    onChange={e => {
                      const newRowsPerPage = Number(e.target.value);
                      setRowsPerPage(newRowsPerPage);
                      // Update page index to maintain approximate position
                      const currentFirstRow = pageIndex * rowsPerPage;
                      const newPageIndex = Math.floor(currentFirstRow / newRowsPerPage);
                      setPageIndex(newPageIndex);
                      setManualPageIndex((newPageIndex + 1).toString());
                    }}
                    className="ml-4 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize} rows
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Pagination buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous page button */}
                  <button
                    onClick={() => {
                      if (pageIndex > 0) {
                        const newPageIndex = pageIndex - 1;
                        console.log(`Page change: ${pageIndex} -> ${newPageIndex} (Previous)`);
                        setPageIndex(newPageIndex);
                        setManualPageIndex((newPageIndex + 1).toString());
                        // Force refresh when changing page
                        setForceRefresh(prev => prev + 1);
                      }
                    }}
                    disabled={pageIndex === 0}
                    className={`
                      px-3 py-1 rounded-md border
                      ${pageIndex > 0 
                        ? 'border-green-700 text-green-700 hover:bg-green-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Page number buttons */}
                  {pageNumbers.map((pageNum, idx) => {
                    const isCurrentPage = pageNum === currentPage;
                    const showEllipsisBefore = idx > 0 && pageNumbers[idx - 1] !== pageNum - 1;
                    const showEllipsisAfter = idx < pageNumbers.length - 1 && pageNumbers[idx + 1] !== pageNum + 1;
                    
                    return (
                      <div key={pageNum} className="flex items-center">
                        {showEllipsisBefore && (
                          <span className="px-3 py-1 text-gray-500">...</span>
                        )}
                        
                        <button
                          onClick={() => {
                            // Only update if clicking a different page
                            if (pageNum !== pageIndex) {
                              console.log(`Page change: ${pageIndex} -> ${pageNum} (Direct)`);
                              setPageIndex(pageNum);
                              setManualPageIndex((pageNum + 1).toString());
                              // Force refresh when clicking page number
                              setForceRefresh(prev => prev + 1);
                            }
                          }}
                          className={`
                            px-3 py-1 rounded-md
                            ${isCurrentPage
                              ? 'bg-green-700 text-white'
                              : 'text-green-700 hover:bg-green-50'}
                          `}
                        >
                          {pageNum + 1}
                        </button>
                        
                        {showEllipsisAfter && (
                          <span className="px-3 py-1 text-gray-500">...</span>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Next page button */}
                  <button
                    onClick={() => {
                      if (pageIndex < pageCount - 1) {
                        const newPageIndex = pageIndex + 1;
                        console.log(`Page change: ${pageIndex} -> ${newPageIndex} (Next)`);
                        setPageIndex(newPageIndex);
                        setManualPageIndex((newPageIndex + 1).toString());
                        // Force refresh when changing page
                        setForceRefresh(prev => prev + 1);
                      }
                    }}
                    disabled={pageIndex >= pageCount - 1}
                    className={`
                      px-3 py-1 rounded-md border
                      ${pageIndex < pageCount - 1 
                        ? 'border-green-700 text-green-700 hover:bg-green-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Manual page input */}
                  <form onSubmit={handleManualPageSubmit} className="flex items-center">
                    <input
                      type="text"
                      value={manualPageIndex}
                      onChange={handleManualPageChange}
                      className="w-12 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      className="ml-2 px-2 py-1 bg-green-700 text-white rounded-md hover:bg-green-800"
                    >
                      GO
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default GlobalSearchPage; 