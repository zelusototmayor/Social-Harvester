import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../hooks/useApi';
import { Building2, Users, Megaphone, ArrowRight, AlertCircle } from 'lucide-react';

const COMPANY_SIZES = [
  'Solo/Freelancer',
  '2-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
];

const EMPLOYEE_COUNTS = [
  'Just me',
  '2-5',
  '6-20',
  '21-50',
  '50+',
];

const REFERRAL_SOURCES = [
  'Google Search',
  'Social Media',
  'Friend/Colleague',
  'Blog/Article',
  'Other',
];

export default function Onboarding() {
  const [companySize, setCompanySize] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUserData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companySize || !employeeCount || !referralSource) {
      setError('Please answer all questions');
      return;
    }

    setIsLoading(true);

    try {
      await userApi.completeOnboarding({
        company_size: companySize,
        employee_count: employeeCount,
        referral_source: referralSource,
      });
      await refreshUserData();
      // Use hard redirect to ensure fresh auth state is loaded
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="Signal Harvester" className="w-10 h-10" />
            <span className="text-2xl font-bold text-slate-900">Signal Harvester</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome! Let's get you set up</h1>
          <p className="text-slate-600 mt-1">Help us personalize your experience</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Size */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <Building2 className="w-4 h-4 text-emerald-600" />
                What's your company size?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setCompanySize(size)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      companySize === size
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Employee Count */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <Users className="w-4 h-4 text-emerald-600" />
                How many people are on your marketing team?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EMPLOYEE_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setEmployeeCount(count)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      employeeCount === count
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Referral Source */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                Where did you hear about us?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REFERRAL_SOURCES.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setReferralSource(source)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      referralSource === source
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !companySize || !employeeCount || !referralSource}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Setting up...'
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
