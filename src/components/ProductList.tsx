import React from 'react';
import type { Product } from '../types';
import { DataTable } from './DataTable';
import { formatCurrency } from '../utils/format';
import { Check, X } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  selectedProducts: Product[];
  onSelect: (product: Product) => void;
}

export function ProductList({ products, selectedProducts, onSelect }: ProductListProps) {
  const columns = [
    {
      id: 'select',
      header: '',
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-indigo-600"
          checked={selectedProducts.some((p) => p.itemCode === row.original.itemCode)}
          onChange={() => onSelect(row.original)}
        />
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }: any) => (
        <span className="font-semibold">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'itemCode',
      header: 'Item Code',
      cell: ({ getValue }: any) => (
        <span className="text-sm text-gray-500">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'inventory',
      header: 'Inventory',
      cell: ({ row }: any) => (
        <span className={row.original.inventory <= 0 ? 'text-red-500' : 'text-green-600'}>
          {row.original.inventory} {row.original.baseUnitOfMeasure}
        </span>
      ),
    },
    {
      accessorKey: 'unitPrice',
      header: 'Unit Price',
      cell: ({ getValue }: any) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor',
    },
    {
      accessorKey: 'blocked',
      header: 'Status',
      cell: ({ getValue }: any) => (
        <span className="inline-flex items-center">
          {getValue() ? (
            <X className="h-5 w-5 text-red-500" />
          ) : (
            <Check className="h-5 w-5 text-green-500" />
          )}
        </span>
      ),
    },
  ];

  return <DataTable data={products} columns={columns} />;
}