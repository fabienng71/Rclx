import React, { useEffect, useState } from 'react';
import { Users, Plus, Loader } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { ContactList } from '../../components/crm/ContactList';
import { ContactForm } from '../../components/crm/ContactForm';
import { SearchBar } from '../../components/SearchBar';
import { ErrorDisplay } from '../../components/ErrorDisplay';

export function Contacts() {
  const { contacts, isLoading, error, loadContacts } = useContactStore();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Contact Management</h2>
        </div>
        <button
          onClick={() => {
            setEditingContact(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="w-full max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search contacts by name, email, or role..."
        />
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No contacts found. Add your first contact to get started.</p>
        </div>
      ) : (
        <ContactList
          searchQuery={searchQuery}
          onEdit={(id) => {
            setEditingContact(id);
            setShowForm(true);
          }}
        />
      )}

      {showForm && (
        <ContactForm
          contactId={editingContact}
          onClose={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
}