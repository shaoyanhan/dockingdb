import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  ColumnFiltersState,
} from '@tanstack/react-table';

// 定义表格数据类型
interface TableRow {
  rank: number;
  pocketId: string;
  gridScore: string;
  structTitle: string;
  pdbId: string;
  paperTitle: string;
  paperLink: string;
}

interface TableData {
  total: number;
  rows: TableRow[];
}

const MoleculeTablePage = () => {
  // 获取分子ID，这个ID是HomePage.tsx中点击分子卡片时传递过来的，通过useParams获取
  const { moleculeId } = useParams<{ moleculeId: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [tableData, setTableData] = useState<TableData>({ total: 0, rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withoutPDX, setWithoutPDX] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [manualPageIndex, setManualPageIndex] = useState('1');
  
  // 将分子ID转换为API路径中需要的格式
  const formatMoleculeNameForApi = (name: string): string => { // 这是一个箭头函数（=>），接收一个参数 name，类型为 string。
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
  
  // 生成API URL
  const getApiUrl = (molecule: string, withoutPDX: boolean): string => {
    const formattedName = formatMoleculeNameForApi(molecule);
    const fileName = withoutPDX ? 'statistic_result_bang_sorted' : 'statistic_result_sorted';
    return `https://cbi.gxu.edu.cn/download/yhshao/DockingDB/table/${formattedName}/${fileName}.json`;
  };
  
  // 获取表格数据
  const fetchTableData = async () => {
    if (!moleculeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = getApiUrl(moleculeId, withoutPDX);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTableData(data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // 当分子ID或withoutPDX变化时获取数据
  // useEffect 是一个React钩子函数，用于在组件挂载、更新或卸载时执行某些操作。第一个参数是一个回调函数，当依赖项发生变化时执行。第二个参数是一个依赖数组，当数组中的值发生变化时，回调函数会重新执行。
  useEffect(() => {
    fetchTableData();
    // 重置到第一页，但保留过滤条件
    setPageIndex(0);
  }, [moleculeId, withoutPDX]);
  
  // 定义表格列
  const columnHelper = createColumnHelper<TableRow>();
  

  // useMemo 是React的一个Hook，用于缓存计算结果，避免在组件重新渲染时重复计算。这里的columns是一个数组，包含了表格的列配置。通过useMemo，只有在依赖项（这里是空数组[]）发生变化时，才会重新计算columns，从而优化性能。
  const columns = useMemo(() => [
    // columnHelper.accessor 是tanstack/react-table库中的一个函数，用于定义表格的列。它接收两个参数：第一个参数是数据的访问路径，第二个参数是一个配置对象，用于定义列的显示方式。
    columnHelper.accessor('rank', {
      header: 'Rank', // 列头显示为“Rank”。
      cell: info => info.getValue(), // 单元格内容为数据源中的rank字段。
      enableGlobalFilter: false, // 表示这一列的值不会被全局搜索功能检索
    }),
    columnHelper.accessor('pocketId', {
      header: 'Pocket ID',
      cell: info => (
        <a 
          href={`#/structure/${info.getValue()}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            // 这里可以添加跳转到分子对接结构结果页面的逻辑
            alert(`Will navigate to structure view for ${info.getValue()}`);
          }}
        >
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('gridScore', {
      header: 'Grid Score',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pdbId', {
      header: 'PDB ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('structTitle', {
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
    columnHelper.accessor('paperTitle', {
      header: 'Paper Title',
      cell: info => {
        const row = info.row.original;
        return (
          <a 
            href={row.paperLink} 
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
  ], []);
  
  // 设置表格实例
  const table = useReactTable({
    data: tableData.rows,
    columns,
    state: {
      globalFilter,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: rowsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const { pageIndex: newPageIndex } = updater({
          pageIndex,
          pageSize: rowsPerPage,
        });
        setPageIndex(newPageIndex);
        setManualPageIndex((newPageIndex + 1).toString());
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });
  
  // 计算页码显示逻辑
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  
  const getPageNumbers = () => {
    const pages = [];
    
    // 始终显示第一页
    pages.push(0);
    
    // 如果当前页不是第一页，并且前一页不是第一页，添加当前页的前一页
    if (currentPage > 1) {
      pages.push(currentPage - 1);
    }
    
    // 如果当前页不是第一页也不是最后一页，添加当前页
    if (currentPage > 0 && currentPage < pageCount - 1) {
      pages.push(currentPage);
    }
    
    // 如果当前页不是最后一页，并且后一页不是最后一页，添加当前页的后一页
    if (currentPage < pageCount - 2) {
      pages.push(currentPage + 1);
    }
    
    // 如果有多于1页，始终显示最后一页
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }
    
    // 去重并排序
    return [...new Set(pages)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  // 处理手动页码跳转
  const handleManualPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualPageIndex(e.target.value);
  };
  
  const handleManualPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(manualPageIndex, 10);
    
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount) {
      setPageIndex(pageNumber - 1);
    } else {
      // 如果输入无效，重置为当前页码
      setManualPageIndex((pageIndex + 1).toString());
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
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
            {moleculeId} Docking Results
          </h1>
          
          <div className="select-none">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 mr-2 cursor-pointer accent-green-700"
                checked={withoutPDX}
                onChange={(e) => setWithoutPDX(e.target.checked)}
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
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Fuzzy filter..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-green-700 border-r-2 border-green-700 border-b-2 border-green-700 border-l-2 border-transparent"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchTableData}
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row, rowIndex) => (
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
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页组件 */}
            <div className="mt-4 flex flex-wrap justify-between items-center text-sm">
              {/* 显示当前页码和总页数 */}
              <div className="flex items-center mb-2 md:mb-0">
                <span className="text-gray-600">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{' '}
                  of {table.getFilteredRowModel().rows.length} rows
                </span>
                
                {/* 选择每页显示的行数 */}  
                <select
                  value={rowsPerPage}
                  onChange={e => {
                    setRowsPerPage(Number(e.target.value));
                    table.setPageIndex(0);
                    setManualPageIndex('1');
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
              
              {/* 分页按钮 */}  
              <div className="flex items-center space-x-2">
                {/* 上一页按钮 */}
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={`
                    px-3 py-1 rounded-md border
                    ${table.getCanPreviousPage() 
                      ? 'border-green-700 text-green-700 hover:bg-green-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* 页码按钮 */}    
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
                          table.setPageIndex(pageNum);
                          setManualPageIndex((pageNum + 1).toString());
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
                
                {/* 下一页按钮 */}
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={`
                    px-3 py-1 rounded-md border
                    ${table.getCanNextPage() 
                      ? 'border-green-700 text-green-700 hover:bg-green-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* 手动页码输入框 */}
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
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MoleculeTablePage; 