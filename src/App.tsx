import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { QuotationItems } from './pages/QuotationItems';
import { PriceValidation } from './pages/PriceValidation';
import { CustomerSelect } from './pages/CustomerSelect';
import { QuotationPreview } from './pages/QuotationPreview';
import { QuotationHistory } from './pages/QuotationHistory';
import { Inventory } from './pages/Inventory';
import { ItemsPerformance } from './pages/ItemsPerformance';
import { CustomerPerformance } from './pages/CustomerPerformance';
import { ChannelPerformance } from './pages/sales/ChannelPerformance';
import { CategoryPerformance } from './pages/sales/CategoryPerformance';
import { VendorPerformance } from './pages/sales/VendorPerformance';
import { GainsLosses } from './pages/sales/GainsLosses';
import { SalesManagement } from './pages/sales/SalesManagement';
import { SalesAdmin } from './pages/sales/SalesAdmin';
import { CRMLayout } from './pages/crm/CRMLayout';
import { Dashboard as CRMDashboard } from './pages/crm/Dashboard';
import { Contacts } from './pages/crm/Contacts';
import { Toolkit } from './pages/crm/Toolkit';
import { Activities } from './pages/crm/Activities';
import { Samples } from './pages/crm/Samples';
import { UserManagement } from './pages/admin/UserManagement';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PerformanceReports } from './pages/sales/PerformanceReports';
import { Dashboard as SalesDashboard } from './pages/sales/Dashboard';
import { BudgetAnalysis } from './pages/sales/BudgetAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/quotations" element={<QuotationItems />} />
          <Route path="/quotations/price-validation" element={<PriceValidation />} />
          <Route path="/quotations/customer-select" element={<CustomerSelect />} />
          <Route path="/quotations/preview" element={<QuotationPreview />} />
          <Route path="/quotations/history" element={<QuotationHistory />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<SalesManagement />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SalesDashboard />} />
            <Route path="reports" element={<PerformanceReports />} />
            <Route path="budget-analysis" element={<BudgetAnalysis />} />
            <Route path="items" element={<ItemsPerformance />} />
            <Route path="customers" element={<CustomerPerformance />} />
            <Route path="channels" element={<ChannelPerformance />} />
            <Route path="categories" element={<CategoryPerformance />} />
            <Route path="vendors" element={<VendorPerformance />} />
            <Route path="gains-losses" element={<GainsLosses />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin>
                  <SalesAdmin />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/crm" element={<CRMLayout />}>
            <Route index element={<CRMDashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="toolkit" element={<Toolkit />} />
            <Route path="activities" element={<Activities />} />
            <Route path="samples" element={<Samples />} />
          </Route>
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;