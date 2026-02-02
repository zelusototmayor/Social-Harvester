import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { productsApi } from '../../hooks/useApi';
import {
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  Check,
  Building2,
  LayoutDashboard,
  CreditCard,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Product {
  id: number;
  name: string;
  status: string;
  relevant_leads_count: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, organizations, currentOrganization, switchOrganization } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [currentOrganization]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsApi.list();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchOrg = async (orgId: number) => {
    try {
      await switchOrganization(orgId);
      setOrgDropdownOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  const isProductActive = (productId: number) => {
    return location.pathname === `/products/${productId}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header - Organization Switcher */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative flex-1">
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {currentOrganization?.name.charAt(0).toUpperCase() || 'O'}
              </div>
              <span className="flex-1 text-left font-medium text-slate-900 truncate text-sm">
                {currentOrganization?.name || 'Select Organization'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Org Dropdown */}
            {orgDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrg(org.id)}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-left"
                  >
                    <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-medium">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm truncate">{org.name}</span>
                    {org.id === currentOrganization?.id && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button className="w-full px-3 py-2 flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 text-left">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Create Organization</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 -mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Product Button */}
        <div className="p-3 border-b border-slate-200">
          <Link
            to="/dashboard/products"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Product
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <Link
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-2">
            Products
          </div>
          {loadingProducts ? (
            <div className="px-3 py-4 text-sm text-slate-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="px-3 py-4 text-sm text-slate-400">No products yet</div>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  isProductActive(product.id)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="flex-1 truncate text-sm">{product.name}</span>
                {product.relevant_leads_count > 0 && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                    {product.relevant_leads_count}
                  </span>
                )}
              </Link>
            ))
          )}
        </nav>

        {/* Settings & User */}
        <div className="border-t border-slate-200">
          <Link
            to="/settings/billing"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
              location.pathname === '/settings/billing'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Billing
          </Link>
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
              location.pathname === '/settings'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm truncate">
              <p className="font-medium text-slate-900 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 -ml-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* Click outside to close org dropdown */}
      {orgDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOrgDropdownOpen(false)}
        />
      )}
    </div>
  );
}
