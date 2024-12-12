import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import { fetchCustomers } from '../services/googleSheets';
import { CustomerCard } from '../components/CustomerCard';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { SearchBar } from '../components/SearchBar';

interface LeadCustomer {
  customerCode: string;
  companyName: string;
  searchName: string;
  isLead: true;
}

export function CustomerSelect() {
  const navigate = useNavigate();
  const {
    customers,
    selectedCustomer,
    isLoading,
    error,
    setCustomers,
    setSelectedCustomer,
    setLoading,
    setError,
  } = useCustomerStore();

  const selectedProducts = useProductStore((state) => state.selectedProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');

  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate('/quotations');
      return;
    }

    let mounted = true;

    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCustomers();
        if (mounted) {
          setCustomers(data);
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error 
              ? error.message 
              : 'Failed to load customers. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, [navigate, selectedProducts.length, setCustomers, setError, setLoading]);

  const handleContinue = () => {
    if (selectedCustomer) {
      navigate('/quotations/preview');
    }
  };

  const handleAddLead = () => {
    if (!leadName.trim()) return;

    const leadCustomer: LeadCustomer = {
      customerCode: `LEAD-${Date.now()}`,
      companyName: leadName,
      searchName: leadName,
      isLead: true
    };

    setSelectedCustomer(leadCustomer);
    setShowLeadForm(false);
    setLeadName('');
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.customerCode.toLowerCase().includes(searchLower) ||
      customer.companyName.toLowerCase().includes(searchLower) ||
      customer.searchName.toLowerCase().includes(searchLower)
    );
  });

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
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/quotations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Select Customer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowLeadForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedCustomer}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCustomer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue with Selected {selectedCustomer?.isLead ? 'Lead' : 'Customer'}
            </button>
          </div>
        </div>

        {showLeadForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Enter lead company name"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddLead}
                disabled={!leadName.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
              <button
                onClick={() => {
                  setShowLeadForm(false);
                  setLeadName('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by customer code, company name, or search name..."
          />
        </div>
      </div>

      {filteredCustomers.length === 0 && !selectedCustomer?.isLead ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <p className="text-gray-500">No customers found matching your search.</p>
          ) : (
            <p className="text-gray-500">No customers available.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedCustomer?.isLead && (
            <CustomerCard
              key={selectedCustomer.customerCode}
              customer={selectedCustomer}
              selected={true}
              onSelect={() => {}}
            />
          )}
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.customerCode}
              customer={customer}
              selected={selectedCustomer?.customerCode === customer.customerCode}
              onSelect={() => setSelectedCustomer(customer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}