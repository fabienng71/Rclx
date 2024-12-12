import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package2, Users, BarChart3, PieChart, Building2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  onClick: () => void;
  bgColor: string;
  iconColor: string;
}

function MetricCard({ title, value, subValue, icon, onClick, bgColor, iconColor }: MetricCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-lg shadow-sm p-6 cursor-pointer transition-all",
        "hover:shadow-md hover:brightness-95",
        bgColor
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "flex-shrink-0 rounded-md p-3",
          "bg-white bg-opacity-50"
        )}>
          {React.cloneElement(icon as React.ReactElement, {
            className: cn("h-6 w-6", iconColor)
          })}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-700">
              {title}
            </dt>
            <dd className="text-xl font-bold text-gray-900 mt-1">
              {value}
            </dd>
            <dd className="text-sm text-gray-600 mt-1">
              {subValue}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function PerformanceReports() {
  const navigate = useNavigate();
  const { sales } = useStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Calculate metrics for each report type
  const metrics = useMemo(() => {
    // Items Performance
    const items = new Map<string, { quantity: number; revenue: number }>();
    let totalItems = 0;
    let totalItemRevenue = 0;
    let topItem = { code: '', revenue: 0 };

    // Customer Performance
    const customers = new Map<string, { revenue: number }>();
    let totalCustomers = 0;
    let totalCustomerRevenue = 0;
    let topCustomer = { code: '', name: '', revenue: 0 };

    // Channel Performance
    const channels = new Map<string, { revenue: number }>();
    let totalChannels = 0;
    let totalChannelRevenue = 0;
    let topChannel = { type: '', revenue: 0 };

    // Category Performance
    const categories = new Map<string, { revenue: number }>();
    let totalCategories = 0;
    let totalCategoryRevenue = 0;
    let topCategory = { group: '', revenue: 0 };

    // Vendor Performance
    const vendors = new Map<string, { revenue: number }>();
    let totalVendors = 0;
    let totalVendorRevenue = 0;
    let topVendor = { code: '', revenue: 0 };

    sales.forEach(sale => {
      // Process items
      sale.items.forEach(item => {
        const revenue = item.quantity * item.price;
        if (!items.has(item.itemCode)) {
          items.set(item.itemCode, { quantity: 0, revenue: 0 });
          totalItems++;
        }
        const itemData = items.get(item.itemCode)!;
        itemData.quantity += item.quantity;
        itemData.revenue += revenue;
        totalItemRevenue += revenue;

        if (itemData.revenue > topItem.revenue) {
          topItem = { code: item.itemCode, revenue: itemData.revenue };
        }
      });

      // Process customer
      if (!customers.has(sale.customerCode)) {
        customers.set(sale.customerCode, { revenue: 0 });
        totalCustomers++;
      }
      const customerRevenue = customers.get(sale.customerCode)!.revenue + sale.total;
      customers.set(sale.customerCode, { revenue: customerRevenue });
      totalCustomerRevenue += sale.total;

      if (customerRevenue > topCustomer.revenue) {
        topCustomer = { 
          code: sale.customerCode, 
          name: sale.companyName,
          revenue: customerRevenue 
        };
      }

      // Process channel
      if (!channels.has(sale.custType)) {
        channels.set(sale.custType, { revenue: 0 });
        totalChannels++;
      }
      const channelRevenue = channels.get(sale.custType)!.revenue + sale.total;
      channels.set(sale.custType, { revenue: channelRevenue });
      totalChannelRevenue += sale.total;

      if (channelRevenue > topChannel.revenue) {
        topChannel = { type: sale.custType, revenue: channelRevenue };
      }

      // Process category
      if (!categories.has(sale.postingGroup)) {
        categories.set(sale.postingGroup, { revenue: 0 });
        totalCategories++;
      }
      const categoryRevenue = categories.get(sale.postingGroup)!.revenue + sale.total;
      categories.set(sale.postingGroup, { revenue: categoryRevenue });
      totalCategoryRevenue += sale.total;

      if (categoryRevenue > topCategory.revenue) {
        topCategory = { group: sale.postingGroup, revenue: categoryRevenue };
      }

      // Process vendor
      if (!vendors.has(sale.vendorNo)) {
        vendors.set(sale.vendorNo, { revenue: 0 });
        totalVendors++;
      }
      const vendorRevenue = vendors.get(sale.vendorNo)!.revenue + sale.total;
      vendors.set(sale.vendorNo, { revenue: vendorRevenue });
      totalVendorRevenue += sale.total;

      if (vendorRevenue > topVendor.revenue) {
        topVendor = { code: sale.vendorNo, revenue: vendorRevenue };
      }
    });

    return {
      items: {
        total: totalItems,
        revenue: totalItemRevenue,
        topItem
      },
      customers: {
        total: totalCustomers,
        revenue: totalCustomerRevenue,
        topCustomer
      },
      channels: {
        total: totalChannels,
        revenue: totalChannelRevenue,
        topChannel
      },
      categories: {
        total: totalCategories,
        revenue: totalCategoryRevenue,
        topCategory
      },
      vendors: {
        total: totalVendors,
        revenue: totalVendorRevenue,
        topVendor
      }
    };
  }, [sales]);

  const handleReportSelect = (path: string) => {
    setSelectedReport(path);
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Performance Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore key performance metrics across various dimensions of your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Items Performance */}
        <MetricCard
          title="Item Performance"
          value={`${metrics.items.total.toLocaleString()} Items`}
          subValue={`Top Item Revenue: ${formatCurrency(metrics.items.topItem.revenue)}`}
          icon={<Package2 />}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => handleReportSelect('/sales/items')}
        />

        {/* Customer Performance */}
        <MetricCard
          title="Customer Performance"
          value={`${metrics.customers.total.toLocaleString()} Customers`}
          subValue={`Top Customer Revenue: ${formatCurrency(metrics.customers.topCustomer.revenue)}`}
          icon={<Users />}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          onClick={() => handleReportSelect('/sales/customers')}
        />

        {/* Channel Performance */}
        <MetricCard
          title="Channel Performance"
          value={`${metrics.channels.total.toLocaleString()} Channels`}
          subValue={`Top Channel Revenue: ${formatCurrency(metrics.channels.topChannel.revenue)}`}
          icon={<BarChart3 />}
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          onClick={() => handleReportSelect('/sales/channels')}
        />

        {/* Category Performance */}
        <MetricCard
          title="Category Performance"
          value={`${metrics.categories.total.toLocaleString()} Categories`}
          subValue={`Top Category Revenue: ${formatCurrency(metrics.categories.topCategory.revenue)}`}
          icon={<PieChart />}
          bgColor="bg-red-50"
          iconColor="text-red-600"
          onClick={() => handleReportSelect('/sales/categories')}
        />

        {/* Vendor Performance */}
        <MetricCard
          title="Vendor Performance"
          value={`${metrics.vendors.total.toLocaleString()} Vendors`}
          subValue={`Top Vendor Revenue: ${formatCurrency(metrics.vendors.topVendor.revenue)}`}
          icon={<Building2 />}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          onClick={() => handleReportSelect('/sales/vendors')}
        />
      </div>
    </div>
  );
}