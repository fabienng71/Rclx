import React, { useState, useEffect, useMemo } from 'react';
import { Package2, ChevronDown, ChevronRight, Loader, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useProductStore } from '../store/productStore';
import { fetchProducts, fetchSales } from '../services/googleSheets';
import { cn } from '../utils/cn';
import { getCategoryColors } from '../utils/categoryMapping';

function formatMonthHeader(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('en-US', { month: 'short' }).toUpperCase() + 
         year.slice(2);
}

function calculateAverageSales(monthlyData: Record<string, number>): number {
  const values = Object.values(monthlyData);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / values.length);
}

function getStockLevelColor(inventory: number, avgSales: number): string {
  if (inventory <= 0) return 'text-red-600 font-bold';
  if (avgSales === 0) return 'text-gray-600';
  if (inventory < avgSales / 2) return 'text-red-500';
  if (inventory < avgSales) return 'text-orange-500';
  return 'text-green-600';
}

function getStockLevelMessage(inventory: number, avgSales: number): string {
  if (inventory <= 0) return 'Out of stock';
  if (avgSales === 0) return 'No sales data';
  if (inventory < avgSales / 2) return 'Critical stock level';
  if (inventory < avgSales) return 'Low stock level';
  return 'Stock level healthy';
}

export function Inventory() {
  const { sales, setSales } = useStore();
  const { products, setProducts, isLoading, error, setLoading, setError } = useProductStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, salesData] = await Promise.all([
          fetchProducts(),
          fetchSales()
        ]);
        setProducts(productsData);
        setSales(salesData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (products.length === 0 || sales.length === 0) {
      loadData();
    }
  }, [products.length, sales.length, setProducts, setSales, setLoading, setError]);

  const months = useMemo(() => {
    return Array.from(new Set(
      sales.map(sale => {
        const date = new Date(sale.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    )).sort();
  }, [sales]);

  const categorizedProducts = useMemo(() => {
    const categoryMap = new Map<string, {
      items: Array<{
        product: typeof products[0];
        totalQuantity: number;
        monthlyData: Record<string, number>;
        averageSales: number;
      }>;
      totalQuantity: number;
      monthlyData: Record<string, number>;
      averageSales: number;
    }>();

    sales.forEach(sale => {
      const category = sale.postingGroup;
      if (!category) return;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          items: [],
          totalQuantity: 0,
          monthlyData: {},
          averageSales: 0
        });
      }

      const categoryData = categoryMap.get(category)!;
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!categoryData.monthlyData[monthKey]) {
        categoryData.monthlyData[monthKey] = 0;
      }

      sale.items.forEach(saleItem => {
        const product = products.find(p => p.itemCode === saleItem.itemCode);
        if (!product) return;

        let productData = categoryData.items.find(item => item.product.itemCode === product.itemCode);
        if (!productData) {
          productData = {
            product,
            totalQuantity: 0,
            monthlyData: {},
            averageSales: 0
          };
          categoryData.items.push(productData);
        }

        if (!productData.monthlyData[monthKey]) {
          productData.monthlyData[monthKey] = 0;
        }

        const quantity = Math.round(saleItem.quantity);
        productData.totalQuantity += quantity;
        productData.monthlyData[monthKey] += quantity;
        categoryData.totalQuantity += quantity;
        categoryData.monthlyData[monthKey] += quantity;
      });
    });

    categoryMap.forEach(category => {
      category.averageSales = calculateAverageSales(category.monthlyData);
      category.items.forEach(item => {
        item.averageSales = calculateAverageSales(item.monthlyData);
      });
    });

    return categoryMap;
  }, [products, sales]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Package2 className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3"></th>
                <th className="w-[85%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category / Item
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Monthly Sales
                </th>
                {months.map(month => (
                  <th key={month} className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {formatMonthHeader(month)}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Sold
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from(categorizedProducts.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([category, data]) => {
                  const colors = getCategoryColors(category);
                  return (
                    <React.Fragment key={category}>
                      <tr className={cn("transition-colors", colors.bg)}>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedCategories.has(category) ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className={cn("text-sm font-medium", colors.text)}>
                            {colors.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-bold text-gray-900">
                          {data.averageSales.toLocaleString()}
                        </td>
                        {months.map(month => (
                          <td key={month} className={cn(
                            "px-3 py-4 text-right whitespace-nowrap text-sm",
                            data.monthlyData[month] > data.averageSales ? "text-red-600" : "text-gray-900"
                          )}>
                            {data.monthlyData[month]?.toLocaleString() || '-'}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-900">
                          {data.totalQuantity.toLocaleString()}
                        </td>
                      </tr>

                      {expandedCategories.has(category) && (
                        data.items
                          .sort((a, b) => b.totalQuantity - a.totalQuantity)
                          .map(({ product, totalQuantity, monthlyData, averageSales }) => {
                            const stockLevelColor = getStockLevelColor(product.inventory, averageSales);
                            const stockMessage = getStockLevelMessage(product.inventory, averageSales);
                            const showWarning = product.inventory < averageSales;
                            
                            return (
                              <tr key={product.itemCode} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3"></td>
                                <td className="px-6 py-3">
                                  <div className="flex items-start">
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs text-gray-900 leading-relaxed break-words pr-8">
                                        {product.description}
                                      </div>
                                      {product.blocked && (
                                        <div className="text-xs text-red-600 font-medium mt-0.5">
                                          BLOCKED
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end space-x-1 group">
                                    {showWarning && (
                                      <AlertTriangle className={cn(
                                        "h-4 w-4",
                                        product.inventory <= 0 || product.inventory < averageSales / 2 
                                          ? "text-red-500" 
                                          : "text-orange-500"
                                      )} />
                                    )}
                                    <span className={cn("text-sm font-medium", stockLevelColor)}>
                                      {product.inventory.toLocaleString()} {product.baseUnitOfMeasure}
                                    </span>
                                    <div className="hidden group-hover:block absolute bg-gray-900 text-white text-xs rounded px-2 py-1 right-0 mr-24">
                                      {stockMessage}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right whitespace-nowrap text-sm font-bold text-gray-900">
                                  {averageSales.toLocaleString()}
                                </td>
                                {months.map(month => (
                                  <td key={month} className={cn(
                                    "px-3 py-3 text-right whitespace-nowrap text-xs",
                                    monthlyData[month] > averageSales ? "text-red-600" : "text-gray-900"
                                  )}>
                                    {monthlyData[month]?.toLocaleString() || '-'}
                                  </td>
                                ))}
                                <td className="px-6 py-3 text-right whitespace-nowrap text-xs text-gray-900">
                                  {totalQuantity.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}