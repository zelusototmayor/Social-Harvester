import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { User, Building2, CreditCard, Bell, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user, currentOrganization } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Profile</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Organization Section */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Organization</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={currentOrganization?.name || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Organization settings coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Notifications</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email notifications</p>
                <p className="text-sm text-slate-500">
                  Get notified when new high-intent leads are found
                </p>
              </div>
              <button
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow translate-x-1" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Notification settings coming soon
            </p>
          </div>
        </div>

        {/* Billing Section */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Billing</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800 font-medium">Beta Access</p>
              <p className="text-sm text-emerald-600 mt-1">
                You're currently on the free beta plan. Enjoy unlimited access during the beta period!
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Security</h2>
            </div>
          </div>
          <div className="p-6">
            <button
              disabled
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
            >
              Change Password
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Password management coming soon
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
