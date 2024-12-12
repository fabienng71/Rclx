import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { UserList } from '../../components/admin/UserList';
import { AddUserModal } from '../../components/admin/AddUserModal';
import { LoginJournal } from '../../components/admin/LoginJournal';
import { SearchBar } from '../../components/SearchBar';

export function UserManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-full max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users by name or email..."
          />
        </div>
      </div>

      <UserList searchQuery={searchQuery} />

      <LoginJournal />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}