import type { Product, Customer, Sale, SaleItem } from '../types';

const ITEMS_SHEET_ID = '16jp17omSDlzAhypGJBTkOrV7Z775lGEC_WeB8WyljME';
const CUSTOMERS_SHEET_ID = '19d6DQcrKLLIpPYwiUcs5ey4CdVkuYQZoutSfVOX2Kd8';
const SALES_SHEET_ID = '1I1ygS_RbBe1OVh85Tpt-fSlU0_cEynjh0G3NRz_5GCA';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const TIMEOUT = 10000;

export class GoogleSheetsError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new GoogleSheetsError(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof GoogleSheetsError && error.message.includes('429')) {
        await sleep(RETRY_DELAY * 2);
      } else if (attempt < retries) {
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw new GoogleSheetsError('Failed to fetch after multiple retries', lastError);
}

async function fetchSheetData(sheetId: string, sheetName: string): Promise<string[][]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetchWithRetry(url);
    const text = await response.text();
    
    if (!text.trim()) {
      throw new GoogleSheetsError('Received empty response from Google Sheets');
    }
    
    const rows = text.split('\n').map(row => {
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      let i = 0;
      
      while (i < row.length) {
        const char = row[i];
        
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            currentValue += '"';
            i += 2;
          } else {
            inQuotes = !inQuotes;
            i++;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
          i++;
        } else {
          currentValue += char;
          i++;
        }
      }
      
      values.push(currentValue.trim());
      return values;
    });

    if (rows.length === 0) {
      throw new GoogleSheetsError('Sheet contains no data');
    }

    const headerRow = rows[0];
    if (headerRow.length === 0) {
      throw new GoogleSheetsError('Sheet header row is empty');
    }

    return rows;
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to fetch data from Google Sheets', error as Error);
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const rows = await fetchSheetData(ITEMS_SHEET_ID, 'Items');
    
    if (rows.length < 2) {
      throw new GoogleSheetsError('Invalid product data: insufficient rows');
    }
    
    const dataRows = rows.slice(1).filter(row => row.length >= 9 && row[0]);
    
    return dataRows.map(row => ({
      itemCode: row[0],
      description: row[1],
      inventory: Number(row[2]) || 0,
      baseUnitOfMeasure: row[3],
      unitCost: Number(row[4]) || 0,
      unitPrice: Number(row[5]) || 0,
      vendorNo: row[6],
      blocked: row[7].toLowerCase() === 'true',
      vendor: row[8]
    }));
  } catch (error) {
    console.error('Error processing products:', error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to process product data', error as Error);
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const rows = await fetchSheetData(CUSTOMERS_SHEET_ID, 'Customers');
    
    if (rows.length < 2) {
      throw new GoogleSheetsError('Invalid customer data: insufficient rows');
    }
    
    const dataRows = rows.slice(1).filter(row => row.length >= 3 && row[0]);
    
    return dataRows.map(row => ({
      customerCode: row[0],
      companyName: row[1],
      searchName: row[2]
    }))
    .sort((a, b) => a.searchName.localeCompare(b.searchName));
  } catch (error) {
    console.error('Error processing customers:', error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to process customer data', error as Error);
  }
}

export async function fetchSales(): Promise<Sale[]> {
  try {
    const rows = await fetchSheetData(SALES_SHEET_ID, 'Sales');
    
    if (rows.length < 2) {
      throw new GoogleSheetsError('Invalid sales data: insufficient rows');
    }
    
    const dataRows = rows.slice(1).filter(row => row.length >= 20 && row[0]);
    
    const sales = dataRows.map(row => {
      try {
        const customerCode = row[0];
        const companyName = row[1];
        const searchName = row[2];
        const custType = row[3];
        const salesPersonCode = row[4];
        const docId = row[5];
        const postingDate = row[6];
        const itemCode = row[7];
        const description = row[8];
        const postingGroup = row[9];
        const vendorNo = row[12];
        const quantity = Number(row[14]) || 0;
        const unitPrice = Number(row[16]) || 0;
        const amount = Number(row[17]) || 0;

        if (!customerCode || !docId || !postingDate || !itemCode || quantity <= 0) {
          return null;
        }

        const item: SaleItem = {
          itemCode,
          description,
          quantity,
          price: unitPrice
        };

        return {
          id: docId,
          date: postingDate,
          customerCode,
          customerName: companyName,
          companyName,
          searchName,
          salesPersonCode,
          custType,
          postingGroup,
          vendorNo,
          items: [item],
          total: amount
        };
      } catch (error) {
        console.error('Error processing sale row:', error);
        return null;
      }
    });

    const validSales = sales.filter((sale): sale is Sale => 
      sale !== null && 
      sale.items.length > 0 && 
      sale.items[0].itemCode && 
      sale.items[0].quantity > 0
    );

    if (validSales.length === 0) {
      throw new GoogleSheetsError('No valid sales data found');
    }

    return validSales;
  } catch (error) {
    console.error('Error processing sales:', error);
    throw error instanceof GoogleSheetsError
      ? error
      : new GoogleSheetsError('Failed to process sales data', error as Error);
  }
}