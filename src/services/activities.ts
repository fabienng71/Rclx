import type { Activity } from '../types/crm';

export const ACTIVITIES_SHEET_ID = '1ICJlfixyCzGR1Bburw6UwcRhbRUaR1PNaSkm1zWajR4';
const DEPLOYMENT_ID = 'AKfycbwOqeN0-bsd_qQ58r4NmqrKSowiwCjRNkm7Qtby6eHJiO6R8AAXUVQv88s3BcG9iBnEfA';

async function appendToSheet(sheetId: string, sheetName: string, row: string[]): Promise<void> {
  try {
    const url = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
    
    // Format the data as expected by the Google Apps Script
    const formData = new FormData();
    formData.append('spreadsheetId', sheetId);
    formData.append('sheetName', sheetName);
    formData.append('data', JSON.stringify(row));

    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    // With no-cors, we can't actually check response.ok
    // We'll consider it a success if we get here without an error
    console.log('Activity saved successfully');
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw new Error('Failed to save activity to Google Sheets');
  }
}

export async function saveActivity(activity: Activity): Promise<void> {
  const weekNumber = getWeekNumber(new Date(activity.date));
  
  // Prepare row data matching the sheet headers:
  // ID | Customer Code | Company Name | Search Name | Date | Type | Notes | Status | Created By | Created At | Week Number
  const row = [
    activity.id,
    activity.customerCode,
    activity.companyName,
    activity.searchName,
    activity.date,
    activity.type,
    activity.notes || '',
    activity.status || 'pending',
    activity.createdBy,
    activity.createdAt,
    weekNumber.toString()
  ];

  await appendToSheet(ACTIVITIES_SHEET_ID, 'Activities', row);
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export async function fetchActivities(): Promise<Activity[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${ACTIVITIES_SHEET_ID}/export?format=csv&sheet=Activities`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return []; // Return empty array for empty sheet
    }
    
    const rows = text.split('\n').map(row => {
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            currentValue += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue.trim());
      return values;
    });

    // Skip header row and filter out empty rows
    const dataRows = rows.slice(1).filter(row => row.length >= 10 && row[0]);
    
    return dataRows.map(row => ({
      id: row[0],
      customerCode: row[1],
      companyName: row[2],
      searchName: row[3],
      date: row[4],
      type: row[5] as Activity['type'],
      notes: row[6],
      status: row[7] as Activity['status'],
      createdBy: row[8],
      createdAt: row[9]
    }));
  } catch (error) {
    console.error('Error processing activities:', error);
    throw new Error('Failed to process activities data');
  }
}