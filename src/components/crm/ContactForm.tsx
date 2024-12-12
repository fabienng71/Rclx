import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { useAuthStore } from '../../store/authStore';
import { useCustomerStore } from '../../store/customerStore';
import { CustomerSearchField } from '../CustomerSearchField';
import type { Customer } from '../../types';
import type { ContactFormData } from '../../types/crm';

const ROLE_OPTIONS = [
  'Chef de Cuisine',
  'Executive Chef',
  'Executive Sous Chef',
  'General Manager',
  'Owner',
  'Pastry Chef',
  'Restaurant Manager'
].sort();

interface ContactFormProps {
  contactId?: string | null;
  onClose: () => void;
}

export function ContactForm({ contactId, onClose }: ContactFormProps) {
  const { user } = useAuthStore();
  const { contacts, addContact, updateContact } = useContactStore();
  const { customers, loadCustomers } = useCustomerStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    customerCode: '',
    isLead: false
  });

  // Load customers if not already loaded
  useEffect(() => {
    if (customers.length === 0) {
      loadCustomers();
    }
  }, [customers.length, loadCustomers]);

  // Load existing contact data if editing
  useEffect(() => {
    if (contactId) {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        setFormData({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          role: contact.role,
          customerCode: contact.customerCode,
          isLead: contact.isLead
        });

        // Set selected customer if this is a customer contact
        if (!contact.isLead) {
          const customer = customers.find(c => c.customerCode === contact.customerCode);
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      }
    }
  }, [contactId, contacts, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!formData.isLead && !selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      customerCode: formData.isLead ? '' : selectedCustomer?.customerCode || ''
    };

    try {
      if (contactId) {
        await updateContact(contactId, submitData);
      } else {
        await addContact(submitData, user.id);
      }
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {contactId ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="space-y-6">
            {/* Contact Type Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Type
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={!formData.isLead}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        isLead: false
                      }));
                    }}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Customer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={formData.isLead}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        isLead: true,
                        customerCode: ''
                      }));
                      setSelectedCustomer(null);
                      setCustomerSearchQuery('');
                    }}
                    className="form-radio h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lead</span>
                </label>
              </div>
            </div>

            {/* Customer Selection */}
            {!formData.isLead && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <CustomerSearchField
                  value={customerSearchQuery}
                  onChange={setCustomerSearchQuery}
                  onSelect={(customer) => {
                    setSelectedCustomer(customer);
                    setFormData(prev => ({
                      ...prev,
                      customerCode: customer.customerCode
                    }));
                  }}
                  selectedCustomer={selectedCustomer}
                  onClear={() => {
                    setSelectedCustomer(null);
                    setCustomerSearchQuery('');
                    setFormData(prev => ({
                      ...prev,
                      customerCode: ''
                    }));
                  }}
                  autoFocus
                />
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  required
                >
                  <option value="">Select a role...</option>
                  {ROLE_OPTIONS.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Saving...' : contactId ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}