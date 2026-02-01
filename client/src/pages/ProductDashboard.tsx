import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { productsApi, influencersApi, hashtagsApi, leadsApi, ApiError } from '../hooks/useApi';
import { useScanProgress } from '../hooks/useScanProgress';
import {
  RefreshCw,
  Loader2,
  Users,
  Hash,
  MessageCircle,
  Plus,
  X,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  Instagram,
  AlertCircle,
  Radio,
  CheckCircle2,
  XCircle,
  Check,
  ThumbsUp,
  TrendingUp,
  Inbox,
  History,
} from 'lucide-react';

interface Influencer {
  id: number;
  handle: string;
  platform: string;
  status: string;
  profile_url: string;
  last_scraped_at: string | null;
  leads_count: number;
}

interface Hashtag {
  id: number;
  tag: string;
  platform: string;
  status: string;
  hashtag_url: string;
  last_scraped_at: string | null;
  leads_count: number;
}

interface Lead {
  id: number;
  commenter_username: string;
  comment_text: string;
  intent_score: number;
  intent_category: string;
  status: string;
  source_type: string;
  source_display: string;
  source_post_url: string;
  ai_suggested_reply: string | null;
  instagram_profile_url: string;
  instagram_comment_url: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  target_audience: string | null;
}

interface DashboardData {
  product: Product;
  influencers: Influencer[];
  hashtags: Hashtag[];
  leads: Lead[];
  stats: {
    total_influencers: number;
    active_influencers: number;
    total_hashtags: number;
    active_hashtags: number;
    total_leads: number;
    relevant_leads: number;
    engaged_leads: number;
    dismissed_leads: number;
    reply_rate: number | null;
  };
}

export default function ProductDashboard() {
  const { productId: id } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newInfluencer, setNewInfluencer] = useState('');
  const [newHashtag, setNewHashtag] = useState('');
  const [addingInfluencer, setAddingInfluencer] = useState(false);
  const [addingHashtag, setAddingHashtag] = useState(false);
  const [scanPollingEnabled, setScanPollingEnabled] = useState(false);
  const [copiedLeadId, setCopiedLeadId] = useState<number | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null);
  const [leadsView, setLeadsView] = useState<'inbox' | 'history'>('inbox');

  const productId = parseInt(id || '0');

  // Helper to get status tooltip text
  const getStatusTooltip = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active - Will be scanned';
      case 'paused':
        return 'Paused - Skipped during scans';
      case 'error':
        return 'Error - Last scan failed';
      default:
        return status;
    }
  };

  const loadDashboard = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await productsApi.dashboard(productId);
      setData(result);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError('Product not found');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to load product data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const refreshLeads = useCallback(async () => {
    if (!productId) return;
    try {
      const result = await productsApi.dashboard(productId);
      setData(result);
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  }, [productId]);

  const { scanStatus, isScanning, startPolling } = useScanProgress({
    productId,
    enabled: scanPollingEnabled,
    onNewLeadsFound: refreshLeads,
  });

  // Check for active scan on mount
  useEffect(() => {
    if (productId) {
      setScanPollingEnabled(true);
    }
  }, [productId]);

  // Stop polling when scan completes
  useEffect(() => {
    if (scanStatus.status === 'completed') {
      refreshLeads();
      const timer = setTimeout(() => {
        setScanPollingEnabled(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanStatus.status, refreshLeads]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleTriggerScan = async () => {
    try {
      await productsApi.triggerScan(productId);
      startPolling();
      setScanPollingEnabled(true);
    } catch (error) {
      console.error('Failed to trigger scan:', error);
    }
  };

  const handleAddInfluencer = async () => {
    if (!newInfluencer.trim()) return;
    setAddingInfluencer(true);
    try {
      await influencersApi.create(productId, { handle: newInfluencer });
      setNewInfluencer('');
      loadDashboard();
    } catch (error) {
      console.error('Failed to add influencer:', error);
    } finally {
      setAddingInfluencer(false);
    }
  };

  const handleToggleInfluencer = async (influencer: Influencer) => {
    const newStatus = influencer.status === 'active' ? 'paused' : 'active';
    try {
      await influencersApi.update(productId, influencer.id, { status: newStatus });
      loadDashboard();
    } catch (error) {
      console.error('Failed to update influencer:', error);
    }
  };

  const handleDeleteInfluencer = async (influencer: Influencer) => {
    if (!confirm(`Remove @${influencer.handle}?`)) return;
    try {
      await influencersApi.delete(productId, influencer.id);
      loadDashboard();
    } catch (error) {
      console.error('Failed to delete influencer:', error);
    }
  };

  const handleAddHashtag = async () => {
    if (!newHashtag.trim()) return;
    setAddingHashtag(true);
    try {
      await hashtagsApi.create(productId, { tag: newHashtag });
      setNewHashtag('');
      loadDashboard();
    } catch (error) {
      console.error('Failed to add hashtag:', error);
    } finally {
      setAddingHashtag(false);
    }
  };

  const handleToggleHashtag = async (hashtag: Hashtag) => {
    const newStatus = hashtag.status === 'active' ? 'paused' : 'active';
    try {
      await hashtagsApi.update(productId, hashtag.id, { status: newStatus });
      loadDashboard();
    } catch (error) {
      console.error('Failed to update hashtag:', error);
    }
  };

  const handleDeleteHashtag = async (hashtag: Hashtag) => {
    if (!confirm(`Remove #${hashtag.tag}?`)) return;
    try {
      await hashtagsApi.delete(productId, hashtag.id);
      loadDashboard();
    } catch (error) {
      console.error('Failed to delete hashtag:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-emerald-500';
    if (score >= 0.7) return 'bg-emerald-400';
    return 'bg-amber-400';
  };

  const copyReplyToClipboard = async (lead: Lead) => {
    const replyText = `@${lead.commenter_username} ${lead.ai_suggested_reply || ''}`.trim();
    try {
      await navigator.clipboard.writeText(replyText);
      setCopiedLeadId(lead.id);
      setTimeout(() => setCopiedLeadId(null), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const handleReplyOnInstagram = async (lead: Lead) => {
    // Copy the reply to clipboard first if there's a suggested reply
    if (lead.ai_suggested_reply) {
      await copyReplyToClipboard(lead);
    }
    // Then open Instagram
    const url = lead.instagram_comment_url || lead.source_post_url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleUpdateLeadStatus = async (leadId: number, status: 'engaged' | 'dismissed') => {
    setUpdatingLeadId(leadId);
    try {
      await leadsApi.updateStatus(leadId, status);
      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === leadId ? { ...l, status } : l
          ),
          stats: {
            ...prev.stats,
            engaged_leads: status === 'engaged' ? prev.stats.engaged_leads + 1 : prev.stats.engaged_leads,
            dismissed_leads: status === 'dismissed' ? prev.stats.dismissed_leads + 1 : prev.stats.dismissed_leads,
          },
        };
      });
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setUpdatingLeadId(null);
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

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            {error === 'Product not found' ? 'Product not found' : 'Something went wrong'}
          </h2>
          <p className="text-slate-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const progressPercent = scanStatus.total_sources
    ? Math.round(((scanStatus.completed_sources || 0) + (scanStatus.failed_sources || 0)) / scanStatus.total_sources * 100)
    : 0;

  const scanInProgress = isScanning || scanStatus.status === 'scanning';

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col -m-4 lg:-m-6">
        {/* Header */}
        <div className="px-4 lg:px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{data.product.name}</h1>
            {data.product.target_audience && (
              <p className="text-sm text-slate-500 mt-0.5">
                Target: {data.product.target_audience}
              </p>
            )}
          </div>
          <button
            onClick={handleTriggerScan}
            disabled={scanInProgress}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${scanInProgress ? 'animate-spin' : ''}`} />
            {scanInProgress
              ? scanStatus.leads_found
                ? `${scanStatus.leads_found} leads found`
                : 'Scanning...'
              : 'Scan Now'}
          </button>
        </div>

        {/* Stats Bar */}
        <div className="px-4 lg:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 lg:gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Influencers:</span>
            <span className="font-semibold text-slate-700">
              {data.stats.active_influencers}/{data.stats.total_influencers}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Hashtags:</span>
            <span className="font-semibold text-slate-700">
              {data.stats.active_hashtags}/{data.stats.total_hashtags}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Relevant Leads:</span>
            <span className="font-semibold text-emerald-600">{data.stats.relevant_leads}</span>
            <span className="text-slate-400">/ {data.stats.total_leads} total</span>
          </div>
          {(data.stats.engaged_leads > 0 || data.stats.dismissed_leads > 0) && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Reply Rate:</span>
              <span className="font-semibold text-blue-600">
                {data.stats.reply_rate !== null ? `${data.stats.reply_rate}%` : '—'}
              </span>
              <span className="text-slate-400">
                ({data.stats.engaged_leads} replied)
              </span>
            </div>
          )}
        </div>

        {/* Scan Progress Banner */}
        {scanStatus.status === 'scanning' && (
          <div className="px-4 lg:px-6 py-3 bg-emerald-50 border-b border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-sm font-medium text-emerald-800">
                Scanning in progress ({(scanStatus.completed_sources || 0) + (scanStatus.failed_sources || 0)}/{scanStatus.total_sources} sources)
              </span>
              {(scanStatus.leads_found || 0) > 0 && (
                <span className="ml-auto text-sm font-semibold text-emerald-700">
                  {scanStatus.leads_found} new leads found
                </span>
              )}
            </div>
            {scanStatus.detail && (
              <p className="text-xs text-emerald-700 mb-2 ml-7">{scanStatus.detail}</p>
            )}
            <div className="ml-7">
              <div className="w-full bg-emerald-200 rounded-full h-1.5">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(progressPercent, 2)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {scanStatus.status === 'completed' && (
          <div className="px-4 lg:px-6 py-3 bg-emerald-50 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Scan complete
              </span>
              {(scanStatus.leads_found || 0) > 0 && (
                <span className="text-sm text-emerald-700">
                  &mdash; {scanStatus.leads_found} new leads found
                </span>
              )}
              {(scanStatus.failed_sources || 0) > 0 && (
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-600">
                  <XCircle className="w-3 h-3" />
                  {scanStatus.failed_sources} source{scanStatus.failed_sources !== 1 ? 's' : ''} failed
                </span>
              )}
            </div>
          </div>
        )}

        {/* Main Content - Three Column Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Influencers Panel */}
          <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-white">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Influencers
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInfluencer}
                  onChange={(e) => setNewInfluencer(e.target.value)}
                  placeholder="@username"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInfluencer()}
                />
                <button
                  onClick={handleAddInfluencer}
                  disabled={addingInfluencer}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-48 lg:max-h-none">
              {data.influencers.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No influencers added yet
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.influencers.map((inf) => (
                    <div key={inf.id} className="p-3 flex items-center gap-3 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 truncate">
                          @{inf.handle}
                        </div>
                        <div className="text-xs text-slate-400">
                          {inf.leads_count} leads
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full cursor-help ${
                          inf.status === 'active'
                            ? 'bg-emerald-500'
                            : inf.status === 'paused'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        title={getStatusTooltip(inf.status)}
                      />
                      <button
                        onClick={() => handleToggleInfluencer(inf)}
                        className="p-1 hover:bg-slate-100 rounded"
                        title={inf.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {inf.status === 'active' ? (
                          <Pause className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Play className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteInfluencer(inf)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hashtags Panel */}
          <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-white">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                Hashtags
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="#hashtag"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                />
                <button
                  onClick={handleAddHashtag}
                  disabled={addingHashtag}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-48 lg:max-h-none">
              {data.hashtags.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  No hashtags added yet
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.hashtags.map((ht) => (
                    <div key={ht.id} className="p-3 flex items-center gap-3 hover:bg-slate-50">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 truncate">
                          #{ht.tag}
                        </div>
                        <div className="text-xs text-slate-400">
                          {ht.leads_count} leads
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full cursor-help ${
                          ht.status === 'active'
                            ? 'bg-emerald-500'
                            : ht.status === 'paused'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        title={getStatusTooltip(ht.status)}
                      />
                      <button
                        onClick={() => handleToggleHashtag(ht)}
                        className="p-1 hover:bg-slate-100 rounded"
                        title={ht.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {ht.status === 'active' ? (
                          <Pause className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Play className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteHashtag(ht)}
                        className="p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Leads Feed */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  High-Intent Leads
                  <span className="font-normal text-slate-400">(≥60% relevance)</span>
                </h3>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setLeadsView('inbox')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      leadsView === 'inbox'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    Inbox
                    {data.leads.filter((l) => l.status === 'new_lead').length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        {data.leads.filter((l) => l.status === 'new_lead').length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setLeadsView('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      leadsView === 'history'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    History
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(() => {
                const filteredLeads = leadsView === 'inbox'
                  ? data.leads.filter((l) => l.status === 'new_lead')
                  : data.leads.filter((l) => l.status === 'engaged' || l.status === 'dismissed');

                if (filteredLeads.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-500">
                      {leadsView === 'inbox' ? (
                        <>
                          <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No pending leads</p>
                          <p className="text-sm mt-1">
                            {data.leads.length > 0
                              ? 'All leads have been reviewed!'
                              : 'Add influencers or hashtags and run a scan to find leads'}
                          </p>
                        </>
                      ) : (
                        <>
                          <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No history yet</p>
                          <p className="text-sm mt-1">
                            Leads you reply to or dismiss will appear here
                          </p>
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => (
                      <div key={lead.id} className="p-4 hover:bg-slate-50">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {lead.commenter_username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm text-slate-900">
                                @{lead.commenter_username}
                              </span>
                              <span className="text-xs text-slate-400">
                                via {lead.source_display}
                              </span>

                              {/* Action Buttons in header (inbox view) or Status Badge (history view) */}
                              <div className="ml-auto flex items-center gap-2">
                                {leadsView === 'inbox' && lead.status === 'new_lead' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateLeadStatus(lead.id, 'engaged')}
                                      disabled={updatingLeadId === lead.id}
                                      className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 text-xs font-medium disabled:opacity-50"
                                      title="Mark as replied"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      Replied
                                    </button>
                                    <button
                                      onClick={() => handleUpdateLeadStatus(lead.id, 'dismissed')}
                                      disabled={updatingLeadId === lead.id}
                                      className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 text-xs font-medium disabled:opacity-50"
                                      title="Dismiss this lead"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                                {leadsView === 'history' && (
                                  <>
                                    {lead.status === 'engaged' ? (
                                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Replied
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                                        <XCircle className="w-3 h-3" />
                                        Dismissed
                                      </span>
                                    )}
                                  </>
                                )}
                                <div
                                  className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getScoreColor(
                                    lead.intent_score
                                  )}`}
                                >
                                  {Math.round(lead.intent_score * 100)}%
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{lead.comment_text}</p>

                            {lead.ai_suggested_reply && (
                              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-2">
                                <p className="text-xs font-medium text-emerald-700 mb-1">
                                  Suggested Reply:
                                </p>
                                <p className="text-sm text-emerald-900">{lead.ai_suggested_reply}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-xs flex-wrap">
                              <span className="text-slate-400">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>

                              <button
                                onClick={() => handleReplyOnInstagram(lead)}
                                className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
                                  copiedLeadId === lead.id
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                                }`}
                              >
                                <Instagram className="w-3 h-3" />
                                {copiedLeadId === lead.id ? 'Reply copied!' : 'Reply on IG'}
                              </button>
                              <a
                                href={lead.instagram_profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-500 hover:underline"
                              >
                                Profile <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
