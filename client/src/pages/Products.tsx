import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { productsApi } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import {
  Plus,
  Package,
  Globe,
  Loader2,
  Trash2,
  Edit3,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  website_url: string | null;
  description: string | null;
  target_audience: string | null;
  pain_points: string | null;
  key_features: string | null;
  status: string;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? Associated campaigns will be unlinked.')) return;
    try {
      await productsApi.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-600">Define the products you're selling to improve lead targeting</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No products yet</h3>
            <p className="text-slate-600 mt-1 mb-4">
              Add your product so we can better identify relevant leads for you
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    {product.website_url && (
                      <a
                        href={product.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Globe className="w-3 h-3" />
                        {product.website_url}
                      </a>
                    )}
                    {product.description && (
                      <p className="text-sm text-slate-600 mt-2">{product.description}</p>
                    )}
                    {product.target_audience && (
                      <div className="mt-3">
                        <span className="text-xs font-medium text-slate-500">Target Audience:</span>
                        <p className="text-sm text-slate-700">{product.target_audience}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                    >
                      Open <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Product Modal */}
        {(showCreateModal || editingProduct) && (
          <ProductModal
            product={editingProduct}
            onClose={() => {
              setShowCreateModal(false);
              setEditingProduct(null);
            }}
            onSaved={(product) => {
              if (editingProduct) {
                setProducts(products.map((p) => (p.id === product.id ? product : p)));
                setEditingProduct(null);
              } else {
                navigate(`/products/${product.id}`);
                return;
              }
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const [step, setStep] = useState<'url' | 'form'>(product ? 'form' : 'url');
  const [url, setUrl] = useState(product?.website_url || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [targetAudience, setTargetAudience] = useState(product?.target_audience || '');
  const [painPoints, setPainPoints] = useState(product?.pain_points || '');
  const [keyFeatures, setKeyFeatures] = useState(product?.key_features || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleAnalyzeUrl = async () => {
    if (!url.trim()) {
      setAnalyzeError('Please enter a URL');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError('');

    try {
      const data = await productsApi.analyzeUrl(url);
      setName(data.name || '');
      setDescription(data.description || '');
      setTargetAudience(data.target_audience || '');
      setPainPoints(data.pain_points || '');
      setKeyFeatures(data.key_features || '');
      setStep('form');
    } catch (error: any) {
      const errorData = await error?.json?.() || {};
      setAnalyzeError(errorData.error || 'Failed to analyze URL. Please try again or enter details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError('Product name is required');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      const data = {
        name,
        website_url: url || null,
        description,
        target_audience: targetAudience,
        pain_points: painPoints,
        key_features: keyFeatures,
        status: 'active',
      };

      let result;
      if (product) {
        result = await productsApi.update(product.id, data);
      } else {
        result = await productsApi.create(data);
      }
      onSaved(result);
    } catch (error) {
      setSaveError('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'url' ? (
          <div className="space-y-4">
            <p className="text-slate-600">
              Enter your website URL and we'll automatically extract product information.
            </p>

            {analyzeError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {analyzeError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://yourproduct.com"
                />
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <hr className="flex-1" />
              <span>or</span>
              <hr className="flex-1" />
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Enter Details Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {saveError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {saveError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., AI Coach Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://yourproduct.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Brief description of your product/service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target Audience
              </label>
              <textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Who is this product for? Be specific about demographics, roles, or situations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pain Points Solved
              </label>
              <textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="What problems does this product solve?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Key Features
              </label>
              <textarea
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Main features or benefits"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!product) {
                    setStep('url');
                  } else {
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
              >
                {product ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
