// Helper functions to encode/decode state for URL sharing

// Define common types
export interface TableState {
  pageIndex: number;
  rowsPerPage: number;
  globalFilter: string;
  withoutPDX: boolean;
  manualPageIndex: string;
}

export interface StructureInfo {
  pdbId: string;
  structTitle: string;
  paperTitle: string;
  paperLink: string;
}

export type SourcePage = 'table' | 'search';

// Serialize table state to URL query parameters
export const serializeTableState = (
  tableState: TableState,
  sourcePage: SourcePage
): string => {
  const params = new URLSearchParams();
  params.set('page_index', tableState.pageIndex.toString());
  params.set('page_size', tableState.rowsPerPage.toString());
  params.set('query', tableState.globalFilter);
  params.set('without_pdx', tableState.withoutPDX.toString());
  params.set('manualPageIndex', tableState.manualPageIndex);
  params.set('sourcePage', sourcePage);
  return params.toString();
};

// Serialize structure info to URL query parameters
export const serializeStructureInfo = (structureInfo: StructureInfo): string => {
  const params = new URLSearchParams();
  params.set('pdbId', encodeURIComponent(structureInfo.pdbId || ''));
  params.set('structTitle', encodeURIComponent(structureInfo.structTitle || ''));
  params.set('paperTitle', encodeURIComponent(structureInfo.paperTitle || ''));
  params.set('paperLink', encodeURIComponent(structureInfo.paperLink || ''));
  return params.toString();
};

// Combine table state and structure info into one URL query string
export const serializeAllStateInfo = (
  tableState: TableState,
  sourcePage: SourcePage,
  structureInfo: StructureInfo
): string => {
  const tableParams = new URLSearchParams(serializeTableState(tableState, sourcePage));
  
  // Add structure info parameters
  tableParams.set('pdbId', encodeURIComponent(structureInfo.pdbId || ''));
  tableParams.set('structTitle', encodeURIComponent(structureInfo.structTitle || ''));
  tableParams.set('paperTitle', encodeURIComponent(structureInfo.paperTitle || ''));
  tableParams.set('paperLink', encodeURIComponent(structureInfo.paperLink || ''));
  
  return tableParams.toString();
};

// Deserialize table state from URL query parameters
export const deserializeTableState = (query: string): {
  tableState: TableState;
  sourcePage?: SourcePage;
} | null => {
  try {
    const params = new URLSearchParams(query);
    
    // Handle both the old and new parameter names for compatibility
    const pageIndex = parseInt(
      params.get('page_index') || params.get('pageIndex') || '0', 
      10
    );
    const rowsPerPage = parseInt(
      params.get('page_size') || params.get('rowsPerPage') || '10', 
      10
    );
    const globalFilter = params.get('query') || '';
    const withoutPDX = params.get('without_pdx') === 'true' || params.get('withoutPDX') === 'true';
    const manualPageIndex = params.get('manualPageIndex') || '1';
    const sourcePage = params.get('sourcePage') as SourcePage | null;
    
    return {
      tableState: {
        pageIndex,
        rowsPerPage,
        globalFilter,
        withoutPDX,
        manualPageIndex
      },
      sourcePage: sourcePage || undefined
    };
  } catch (error) {
    console.error('Error deserializing state from URL', error);
    return null;
  }
};

// Deserialize structure info from URL query parameters
export const deserializeStructureInfo = (query: string): StructureInfo | null => {
  try {
    const params = new URLSearchParams(query);
    
    const pdbId = params.get('pdbId') ? decodeURIComponent(params.get('pdbId') || '') : '';
    const structTitle = params.get('structTitle') ? decodeURIComponent(params.get('structTitle') || '') : '';
    const paperTitle = params.get('paperTitle') ? decodeURIComponent(params.get('paperTitle') || '') : '';
    const paperLink = params.get('paperLink') ? decodeURIComponent(params.get('paperLink') || '') : '';
    
    return {
      pdbId,
      structTitle,
      paperTitle,
      paperLink
    };
  } catch (error) {
    console.error('Error deserializing structure info from URL', error);
    return null;
  }
};

// Save state to localStorage with a specific key
export const saveStateToLocalStorage = <T>(
  key: string, 
  state: T
): void => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage', error);
  }
};

// Get state from localStorage with a specific key
export const getStateFromLocalStorage = <T>(
  key: string
): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting state from localStorage', error);
    return null;
  }
};

// Generate a state key for a specific molecule/page combination
export const getStateKey = (
  sourcePage: SourcePage, 
  moleculeId?: string
): string => {
  return sourcePage === 'table' 
    ? `table_state_${moleculeId || 'default'}`
    : 'search_state';
}; 