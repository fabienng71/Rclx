import React from 'react';
import { Package2, Check, X } from 'lucide-react';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';

interface ProductCardProps {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 relative transition-all ${
        selected ? 'ring-2 ring-indigo-600' : 'hover:shadow-lg'
      }`}
    >
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-indigo-600"
          checked={selected}
          onChange={onSelect}
        />
      </div>
      
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${selected ? 'bg-indigo-100' : 'bg-gray-100'}`}>
          <Package2 className={`h-6 w-6 ${selected ? 'text-indigo-600' : 'text-gray-600'}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{product.description}</h3>
          <p className="text-sm text-gray-500">{product.itemCode}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Inventory</p>
              <p className={`font-medium ${product.inventory <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                {product.inventory} {product.baseUnitOfMeasure}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-medium">{formatCurrency(product.unitPrice)}</p>
            </div>
            <div>
              <p className="text-gray-500">Vendor</p>
              <p className="font-medium">{product.vendor}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium flex items-center space-x-1">
                {product.blocked ? (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Blocked</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Available</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}