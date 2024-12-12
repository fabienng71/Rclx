import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { formatCurrency } from '../utils/format';

export function PriceValidation() {
  const navigate = useNavigate();
  const { selectedProducts, updateSelectedProducts } = useProductStore();
  const [modifiedProducts, setModifiedProducts] = React.useState(() =>
    selectedProducts.map(product => ({
      ...product,
      modifiedPrice: product.unitPrice
    }))
  );

  React.useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate('/quotations');
    }
  }, [selectedProducts, navigate]);

  const handlePriceChange = (itemCode: string, value: string) => {
    const newPrice = parseFloat(value) || 0;
    setModifiedProducts(prev =>
      prev.map(product =>
        product.itemCode === itemCode
          ? { ...product, modifiedPrice: newPrice }
          : product
      )
    );
  };

  const handleValidate = () => {
    updateSelectedProducts(modifiedProducts);
    navigate('/quotations/customer-select');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/quotations')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Validate Prices</h1>
        </div>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Validate and Continue
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                List Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quote Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modifiedProducts.map((product) => {
              const listPrice = product.unitPrice;
              const quotePrice = product.modifiedPrice || product.unitPrice;
              const discountPercent = ((listPrice - quotePrice) / listPrice) * 100;
              
              return (
                <tr key={product.itemCode}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.itemCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(listPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => handlePriceChange(product.itemCode, e.target.value)}
                      className="w-32 px-2 py-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    discountPercent > 0 ? 'text-green-600' : discountPercent < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {discountPercent === 0 ? '-' : `${Math.abs(discountPercent).toFixed(1)}%`}
                    {discountPercent !== 0 && (discountPercent > 0 ? ' discount' : ' markup')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}