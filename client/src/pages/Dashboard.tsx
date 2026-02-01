import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { productsApi, ApiError } from '../hooks/useApi';
import { Package, Users, TrendingUp, CheckCircle, Loader2, Plus, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  status: string;
  influencers_count: number;
  hashtags_count: number;
  leads_count: number;
  relevant_leads_count: number;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productsApi.list();
      setProducts(result || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate totals
  const totalProducts = products.length;
  const totalLeads = products.reduce((sum, p) => sum + p.leads_count, 0);
  const relevantLeads = products.reduce((sum, p) => sum + p.relevant_leads_count, 0);
  const totalSources = products.reduce((sum, p) => sum + p.influencers_count + p.hashtags_count, 0);

  const stats = [
    {
      label: 'Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      label: 'Relevant Leads',
      value: relevantLeads,
      icon: TrendingUp,
      color: 'bg-amber-500',
    },
    {
      label: 'Sources Tracked',
      value: totalSources,
      icon: CheckCircle,
      color: 'bg-purple-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Your Products</h2>
            <Link
              to="/dashboard/products"
              className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              New Product
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">
                        {product.influencers_count} influencers · {product.hashtags_count} hashtags
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {product.relevant_leads_count > 0 && (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                        {product.relevant_leads_count} leads
                      </span>
                    )}
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="font-medium">No products yet</p>
                <p className="text-sm mb-4">Create your first product to start finding leads!</p>
                <Link
                  to="/dashboard/products"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                  Create Product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
