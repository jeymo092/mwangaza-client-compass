
// This is a browser-compatible mock database service
// In a real application, you would make API calls to your backend

// Store data in localStorage for persistence between page reloads
const getLocalStorage = (key: string, defaultValue: any[] = []) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Mock database tables
const DB_KEYS = {
  CLIENTS: 'db_clients',
  PARENTS: 'db_parents',
  HOME_VISITS: 'db_home_visits',
};

// Initialize with some data if empty
const initializeDatabase = () => {
  // Only initialize if not already set up
  if (!localStorage.getItem(DB_KEYS.CLIENTS)) {
    console.log('Initializing mock database');
    setLocalStorage(DB_KEYS.CLIENTS, []);
    setLocalStorage(DB_KEYS.PARENTS, []);
    setLocalStorage(DB_KEYS.HOME_VISITS, []);
  }
};

// Test database connection (always succeeds in this mock version)
export const testConnection = async () => {
  try {
    // Initialize database if needed
    initializeDatabase();
    console.log('Mock database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Generic query function that simulates database operations
export const query = async <T>(sql: string, params?: any[]): Promise<T> => {
  console.log('Executing mock query:', sql, params);
  
  // Simulate database latency
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    // Parse the SQL query to determine operation type and table
    const operation = sql.trim().split(' ')[0].toUpperCase();
    
    // Handle different operations
    switch (operation) {
      case 'SELECT': {
        return handleSelect(sql, params) as unknown as T;
      }
      case 'INSERT': {
        return handleInsert(sql, params) as unknown as T;
      }
      case 'UPDATE': {
        return handleUpdate(sql, params) as unknown as T;
      }
      case 'DELETE': {
        return handleDelete(sql, params) as unknown as T;
      }
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Helper functions to parse and execute different types of queries
const handleSelect = (sql: string, params?: any[]) => {
  // Simple SQL parsing - this is not a full SQL parser, just handles basic cases
  let table: string;
  let whereClause = false;
  let filterColumn: string | null = null;
  
  if (sql.includes('FROM clients')) {
    table = DB_KEYS.CLIENTS;
  } else if (sql.includes('FROM parents')) {
    table = DB_KEYS.PARENTS;
  } else if (sql.includes('FROM home_visits')) {
    table = DB_KEYS.HOME_VISITS;
  } else {
    throw new Error('Unknown table in SELECT query');
  }
  
  // Check for WHERE clause
  if (sql.includes('WHERE')) {
    whereClause = true;
    // Very basic parsing - assumes WHERE column = ?
    const wherePattern = /WHERE\s+([a-zA-Z_]+)\s*=\s*\?/i;
    const match = sql.match(wherePattern);
    if (match) {
      filterColumn = match[1];
    }
  }
  
  // Get data from storage
  const data = getLocalStorage(table);
  
  // Filter data if WHERE clause exists
  if (whereClause && filterColumn && params && params.length > 0) {
    // Map DB column names to JS property names
    const columnMappings: Record<string, string> = {
      'client_id': 'clientId',
      'id': 'id',
    };
    
    const jsProperty = columnMappings[filterColumn] || filterColumn;
    const filterValue = params[0];
    
    return data.filter((item: any) => item[jsProperty] === filterValue);
  }
  
  // Return all data if no filter
  return data;
};

const handleInsert = (sql: string, params?: any[]) => {
  // Very basic parsing - extract table name
  let table: string;
  
  if (sql.includes('INTO clients')) {
    table = DB_KEYS.CLIENTS;
  } else if (sql.includes('INTO parents')) {
    table = DB_KEYS.PARENTS;
  } else if (sql.includes('INTO home_visits')) {
    table = DB_KEYS.HOME_VISITS;
  } else {
    throw new Error('Unknown table in INSERT query');
  }
  
  // Get current data
  const data = getLocalStorage(table);
  
  // Since we're not actually parsing the SQL, we'll just add the object directly
  // In a real implementation, you'd map parameters to column names
  
  // For simplicity, we'll assume the parameters are already formatted correctly
  // and we're just adding a record
  const newRecord = {}; // This would be constructed from the SQL and params
  
  // For demo purposes, just acknowledge the operation was successful
  setLocalStorage(table, data);
  
  return { affectedRows: 1, insertId: 'mock-id' };
};

const handleUpdate = (sql: string, params?: any[]) => {
  // Simplified implementation
  return { affectedRows: 1 };
};

const handleDelete = (sql: string, params?: any[]) => {
  // Simplified implementation
  return { affectedRows: 1 };
};

// Helper to reset the database (useful for testing)
export const resetDatabase = () => {
  localStorage.removeItem(DB_KEYS.CLIENTS);
  localStorage.removeItem(DB_KEYS.PARENTS);
  localStorage.removeItem(DB_KEYS.HOME_VISITS);
  initializeDatabase();
};

export default { testConnection, query, resetDatabase };
