import React from 'react';
import { Mail, Phone, Pencil, Trash2, Building2 } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { cn } from '../../utils/cn';

interface ContactListProps {
  searchQuery: string;
  onEdit: (id: string) => void;
}

export function ContactList({ searchQuery, onEdit }: ContactListProps) {
  const { contacts, deleteContact } = useContactStore();

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.role.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    await deleteContact(id);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer/Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Info
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {contact.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                  <div className="text-sm text-gray-900">
                    {contact.customerCode}
                    {contact.isLead && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Lead
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{contact.role}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-indigo-600">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contact.phone}`} className="hover:text-indigo-600">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => onEdit(contact.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}