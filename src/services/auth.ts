import bcrypt from 'bcryptjs';
import type { LoginCredentials, User, AuthResponse, LoginAttempt } from '../types/auth';

// Storage keys
const STORAGE_KEY = 'auth_users';
const LOGIN_JOURNAL_KEY = 'auth_login_journal';

export function getStoredUsers(): User[] {
  const storedUsers = localStorage.getItem(STORAGE_KEY);
  if (!storedUsers) {
    // Initialize with default users if storage is empty
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Fabien',
        email: 'Fabien@repertoire.co.th',
        password: bcrypt.hashSync('1234', 10),
        telephone: '+925 901 406',
        role: 'admin',
      },
      {
        id: '2',
        name: 'Umberto',
        email: 'Umberto@repertoire.co.th',
        password: bcrypt.hashSync('1234', 10),
        telephone: '+66 98 282 5881',
        role: 'admin',
      },
      {
        id: '3',
        name: 'Kate',
        email: 'Kate@repertoire.co.th',
        password: bcrypt.hashSync('1234', 10),
        telephone: '+66 80 362 1547',
        role: 'user',
      },
      {
        id: '4',
        name: 'Celia',
        email: 'Celia@repertoire.co.th',
        password: bcrypt.hashSync('1234', 10),
        telephone: '+66 92 802 5623',
        role: 'user',
      },
      {
        id: '5',
        name: 'Blue',
        email: 'Blue@repertoire.co.th',
        password: bcrypt.hashSync('1234', 10),
        role: 'user',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(storedUsers);
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getLoginJournal(): LoginAttempt[] {
  const journal = localStorage.getItem(LOGIN_JOURNAL_KEY);
  return journal ? JSON.parse(journal) : [];
}

function saveLoginJournal(journal: LoginAttempt[]) {
  localStorage.setItem(LOGIN_JOURNAL_KEY, JSON.stringify(journal));
}

function logLoginAttempt(email: string, success: boolean) {
  const journal = getLoginJournal();
  const attempt: LoginAttempt = {
    id: crypto.randomUUID(),
    email,
    timestamp: new Date().toISOString(),
    success,
    ipAddress: '127.0.0.1', // Simulated IP address
    userAgent: navigator.userAgent,
  };
  journal.unshift(attempt); // Add to beginning of array
  
  // Keep only last 1000 attempts
  if (journal.length > 1000) {
    journal.pop();
  }
  
  saveLoginJournal(journal);
  return attempt;
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const users = getStoredUsers();
  const user = users.find((u) => u.email === credentials.email);
  
  if (!user) {
    logLoginAttempt(credentials.email, false);
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  
  if (!isValid) {
    logLoginAttempt(credentials.email, false);
    throw new Error('Invalid password');
  }

  logLoginAttempt(credentials.email, true);

  // Generate JWT token (simplified for demo)
  const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 30 * 60 * 1000 }));

  return {
    user: { ...user, password: '' },
    token,
  };
}

export async function logoutUser(): Promise<void> {
  return Promise.resolve();
}

export async function getAllUsers(): Promise<User[]> {
  const users = getStoredUsers();
  return users.map(user => ({ ...user, password: '' }));
}

export async function getLoginJournalEntries(): Promise<LoginAttempt[]> {
  return getLoginJournal();
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  if (updates.password) {
    updates.password = bcrypt.hashSync(updates.password, 10);
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);
  
  return { ...users[userIndex], password: '' };
}

export async function deleteUser(userId: string): Promise<void> {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users.splice(userIndex, 1);
  saveUsers(users);
}

export async function addUser(newUser: Omit<User, 'id'>): Promise<User> {
  const users = getStoredUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === newUser.email)) {
    throw new Error('Email already exists');
  }

  const id = (users.length + 1).toString();
  const user: User = {
    ...newUser,
    id,
    password: bcrypt.hashSync(newUser.password, 10),
  };
  
  users.push(user);
  saveUsers(users);
  
  return { ...user, password: '' };
}