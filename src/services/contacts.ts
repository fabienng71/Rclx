import type { Contact, ContactFormData } from '../types/crm';

export const CONTACTS_SHEET_ID = '1ICJlfixyCzGR1Bburw6UwcRhbRUaR1PNaSkm1zWajR4';
const DEPLOYMENT_ID = 'AKfycbwOqeN0-bsd_qQ58r4NmqrKSowiwCjRNkm7Qtby6eHJiO6R8AAXUVQv88s3BcG9iBnEfA';

async function appendToSheet(sheetId: string, sheetName: string, row: string[]): Promise<void> {
  try {
    const url = `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`;
    
    const formData = new FormData();
    formData.append('spreadsheetId', sheetId);
    formData.append('sheetName', sheetName);
    formData.append('data', JSON.stringify(row));

    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    console.log('Contact saved successfully');
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw new Error('Failed to save contact to Google Sheets');
  }
}

export async function saveContact(contact: ContactFormData, userId: string): Promise<Contact> {
  const now = new Date().toISOString();
  const newContact: Contact = {
    id: crypto.randomUUID(),
    ...contact,
    createdBy: userId,
    createdAt: now,
    updatedAt: now
  };

  const row = [
    newContact.id,
    newContact.customerCode,
    newContact.name,
    newContact.email,
    newContact.phone,
    newContact.role,
    newContact.isLead ? 'Yes' : 'No',
    newContact.createdBy,
    newContact.createdAt,
    newContact.updatedAt
  ];

  await appendToSheet(CONTACTS_SHEET_ID, 'Contacts', row);
  return newContact;
}

export async function fetchContacts(): Promise<Contact[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${CONTACTS_SHEET_ID}/export?format=csv&sheet=Contacts`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text.trim()) {
      return [];
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

    const dataRows = rows.slice(1).filter(row => row.length >= 10 && row[0]);
    
    return dataRows.map(row => ({
      id: row[0],
      customerCode: row[1],
      name: row[2],
      email: row[3],
      phone: row[4],
      role: row[5],
      isLead: row[6].toLowerCase() === 'yes',
      createdBy: row[7],
      createdAt: row[8],
      updatedAt: row[9]
    }));
  } catch (error) {
    console.error('Error processing contacts:', error);
    throw new Error('Failed to process contacts data');
  }
}

export async function updateContact(id: string, updates: Partial<ContactFormData>): Promise<void> {
  // In a real application, you would update the specific row in the Google Sheet
  // For now, we'll just append the update as a new row with the same ID
  const row = [
    id,
    updates.customerCode || '',
    updates.name || '',
    updates.email || '',
    updates.phone || '',
    updates.role || '',
    updates.isLead ? 'Yes' : 'No',
    '', // createdBy (unchanged)
    '', // createdAt (unchanged)
    new Date().toISOString() // updatedAt
  ];

  await appendToSheet(CONTACTS_SHEET_ID, 'Contacts', row);
}

export async function deleteContact(id: string): Promise<void> {
  // In a real application, you would delete the specific row from the Google Sheet
  // For now, we'll just append a "deleted" marker row
  const row = [
    id,
    'DELETED',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    new Date().toISOString()
  ];

  await appendToSheet(CONTACTS_SHEET_ID, 'Contacts', row);
}