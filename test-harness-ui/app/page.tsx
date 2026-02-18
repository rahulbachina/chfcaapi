'use client';

import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import DNBTab from '@/components/dnb/DNBTab';
import LexisNexisTab from '@/components/lexisnexis/LexisNexisTab';

const tabs = [
  { id: 'companies-house', label: 'Companies House', disabled: true },
  { id: 'fca-register', label: 'FCA Register', disabled: true },
  { id: 'dnb', label: 'Dun & Bradstreet', disabled: false },
  { id: 'lexisnexis', label: 'LexisNexis', disabled: false },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dnb');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          KYC Automation Third Party API Test Harness
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Test and validate third party API integrations
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'companies-house' && (
          <div className="p-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Companies House integration is already live in production.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'fca-register' && (
          <div className="p-6">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                FCA Register integration is already live in production.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'dnb' && <DNBTab />}

        {activeTab === 'lexisnexis' && <LexisNexisTab />}
      </div>
    </div>
  );
}
