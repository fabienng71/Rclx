import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCustomerStore } from '../../store/customerStore';
import { useProductStore } from '../../store/productStore';
import { useCRMStore } from '../../store/crmStore';
import { CustomerSearchField } from '../CustomerSearchField';
import { SearchBar } from '../SearchBar';
import { saveActivity } from '../../services/activities';
import { fetchCustomers, fetchProducts } from '../../services/googleSheets';
import { Plus, X } from 'lucide-react';
import type { Activity } from '../../types/crm';
import type { Product } from '../../types';

interface SampleData {
  id: string;
  product: Product | null;
  quantity: number;
  date: string;
}

interface ActivityFormProps {
  onClose: () => void;
}

export function ActivityForm({ onClose }: ActivityFormProps) {
  const { user } = useAuthStore();
  const { customers, setCustomers, setLoading: setLoadingCustomers } = useCustomerStore();
  const { products, setProducts, setLoading: setLoadingProducts } = useProductStore();
  const { addActivity, addSample } = useCRMStore();

  // Customer selection state
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{
    customerCode: string;
    companyName: string;
    searchName: string;
  } | null>(null);

  // Activity state
  const [activityType, setActivityType] = useState<Activity['type']>('visit');
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Activity['status']>('pending');
  const [callbackDate, setCallbackDate] = useState('');

  // Sample state
  const [includeSample, setIncludeSample] = useState(false);
  const [samples, setSamples] = useState<SampleData[]>([
    {
      id: crypto.randomUUID(),
      product: null,
      quantity: 1,
      date: new Date().toISOString().split('T')[0]
    }
  ]);
  const [productSearchQueries, setProductSearchQueries] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoadingCustomers(true);
      setLoadingProducts(true);
      try {
        const [customersData, productsData] = await Promise.all([
          fetchCustomers(),
          fetchProducts()
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoadingCustomers(false);
        setLoadingProducts(false);
      }
    };

    if (customers.length === 0 || products.length === 0) {
      loadData();
    }
  }, [customers.length, products.length, setCustomers, setProducts, setLoadingCustomers, setLoadingProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }

    if (includeSample && samples.some(sample => !sample.product)) {
      setError('Please select products for all samples');
      return;
    }

    if (!user) {
      setError('User information not available');
      return;
    }

    setIsSubmitting(true);

    try {
      const activityId = crypto.randomUUID();
      const activity: Activity = {
        id: activityId,
        customerCode: selectedCustomer.customerCode,
        companyName: selectedCustomer.companyName,
        searchName: selectedCustomer.searchName,
        date: activityDate,
        type: activityType,
        notes,
        status,
        callbackDate: callbackDate || undefined,
        createdBy: user.name,
        createdAt: new Date().toISOString(),
      };

      await saveActivity(activity);
      addActivity(activity);

      if (includeSample) {
        samples.forEach(sample => {
          if (!sample.product) return;

          const sampleData = {
            id: crypto.randomUUID(),
            customerCode: selectedCustomer.customerCode,
            companyName: selectedCustomer.companyName,
            searchName: selectedCustomer.searchName,
            itemCode: sample.product.itemCode,
            description: sample.product.description,
            quantity: sample.quantity,
            date: sample.date,
            notes: `Sample provided during activity: ${activityId}`,
            status: 'pending',
            createdBy: user.name,
            createdAt: new Date().toISOString(),
          };

          addSample(sampleData);
        });
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSample = () => {
    setSamples(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        product: null,
        quantity: 1,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const handleRemoveSample = (id: string) => {
    setSamples(prev => prev.filter(sample => sample.id !== id));
    setProductSearchQueries(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleUpdateSample = (id: string, updates: Partial<SampleData>) => {
    setSamples(prev => prev.map(sample =>
      sample.id === id ? { ...sample, ...updates } : sample
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Log Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <CustomerSearchField
                  value={customerSearchQuery}
                  onChange={setCustomerSearchQuery}
                  onSelect={customer => {
                    setSelectedCustomer({
                      customerCode: customer.customerCode,
                      companyName: customer.companyName,
                      searchName: customer.searchName,
                    });
                  }}
                  selectedCustomer={selectedCustomer}
                  onClear={() => {
                    setSelectedCustomer(null);
                    setCustomerSearchQuery('');
                  }}
                  autoFocus={!selectedCustomer}
                />
              </div>

              {/* Activity Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as Activity['type'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="visit">Meeting</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="sample">Sample</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Activity['status'])}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Date
                  </label>
                  <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call Back Date
                  </label>
                  <input
                    type="date"
                    value={callbackDate}
                    onChange={(e) => setCallbackDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter meeting notes..."
                  maxLength={1000}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {notes.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Right Column - Sample Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeSample"
                    checked={includeSample}
                    onChange={(e) => {
                      setIncludeSample(e.target.checked);
                      if (!e.target.checked) {
                        setSamples([{
                          id: crypto.randomUUID(),
                          product: null,
                          quantity: 1,
                          date: new Date().toISOString().split('T')[0]
                        }]);
                        setProductSearchQueries({});
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeSample" className="ml-2 block text-sm text-gray-900 font-medium">
                    Add Samples
                  </label>
                </div>
                {includeSample && (
                  <button
                    type="button"
                    onClick={handleAddSample}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Sample
                  </button>
                )}
              </div>

              {includeSample && (
                <div className="space-y-6">
                  {samples.map((sample, index) => (
                    <div key={sample.id} className="bg-gray-50 p-4 rounded-lg relative">
                      {samples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSample(sample.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                      
                      <div className="space-y-4">
                        {/* Product Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sample {index + 1} - Search Item
                          </label>
                          <div className="relative">
                            <SearchBar
                              value={productSearchQueries[sample.id] || ''}
                              onChange={(value) => setProductSearchQueries(prev => ({
                                ...prev,
                                [sample.id]: value
                              }))}
                              placeholder="Search products..."
                            />
                            {productSearchQueries[sample.id] && !sample.product && (
                              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                                {products
                                  .filter(product => {
                                    const searchLower = productSearchQueries[sample.id].toLowerCase();
                                    return (
                                      product.itemCode.toLowerCase().includes(searchLower) ||
                                      product.description.toLowerCase().includes(searchLower)
                                    );
                                  })
                                  .map((product) => (
                                    <div
                                      key={product.itemCode}
                                      className="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-indigo-50"
                                      onClick={() => {
                                        handleUpdateSample(sample.id, { product });
                                        setProductSearchQueries(prev => ({
                                          ...prev,
                                          [sample.id]: ''
                                        }));
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                          {product.description}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {product.itemCode} ({product.baseUnitOfMeasure})
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                          {sample.product && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {sample.product.description} ({sample.product.baseUnitOfMeasure})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateSample(sample.id, { product: null });
                                  setProductSearchQueries(prev => ({
                                    ...prev,
                                    [sample.id]: ''
                                  }));
                                }}
                                className="text-sm text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Sample Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity ({sample.product?.baseUnitOfMeasure || 'units'})
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={sample.quantity}
                              onChange={(e) => handleUpdateSample(
                                sample.id,
                                { quantity: Math.max(1, parseInt(e.target.value) || 1) }
                              )}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sample Date
                            </label>
                            <input
                              type="date"
                              value={sample.date}
                              onChange={(e) => handleUpdateSample(
                                sample.id,
                                { date: e.target.value }
                              )}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}