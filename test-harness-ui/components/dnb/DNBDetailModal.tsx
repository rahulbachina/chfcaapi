'use client';

import { useState, useEffect } from 'react';
import { X, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { getCompanyProfile, getFinancialStatements, getAnalytics } from '@/lib/api/dnb';
import type { DNBCompanyProfile, DNBFinancialStatementDetail, DNBRiskScore } from '@/types/dnb';

interface DNBDetailModalProps {
    duns: string;
    onClose: () => void;
}

export default function DNBDetailModal({ duns, onClose }: DNBDetailModalProps) {
    const [profile, setProfile] = useState<DNBCompanyProfile | null>(null);
    const [financials, setFinancials] = useState<DNBFinancialStatementDetail[]>([]);
    const [riskScores, setRiskScores] = useState<DNBRiskScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'financials' | 'analytics'>('profile');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, financialsRes, analyticsRes] = await Promise.allSettled([
                    getCompanyProfile(duns),
                    getFinancialStatements(duns),
                    getAnalytics(duns),
                ]);

                if (profileRes.status === 'fulfilled') {
                    setProfile(profileRes.value.Organization);
                }
                if (financialsRes.status === 'fulfilled') {
                    setFinancials(financialsRes.value.FinancialStatements);
                }
                if (analyticsRes.status === 'fulfilled') {
                    setRiskScores(analyticsRes.value.RiskScores);
                }
            } catch (err) {
                console.error('Error fetching company details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [duns]);

    const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {profile?.OrganizationName.OrganizationPrimaryName[0].OrganizationName || 'Loading...'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">DUNS: {duns}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-1 px-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'profile'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Building2 className="w-4 h-4 inline mr-2" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('financials')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'financials'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Financials
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'analytics'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4 inline mr-2" />
                            Analytics
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* Profile Tab */}
                            {activeTab === 'profile' && profile && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                                        <dl className="grid grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Operating Status</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{profile.OperatingStatusText || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{profile.StartDate || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Employees</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{profile.EmployeeQuantity?.toLocaleString() || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Annual Revenue</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{formatCurrency(profile.SalesRevenueAmount)}</dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {profile.BusinessDescription && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Description</h3>
                                            <p className="text-sm text-gray-700">{profile.BusinessDescription}</p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                                        <p className="text-sm text-gray-700">
                                            {profile.PrimaryAddress.StreetAddressLine?.map(line => line.LineText).join(', ')}
                                            <br />
                                            {profile.PrimaryAddress.PrimaryTownName}, {profile.PrimaryAddress.TerritoryAbbreviatedName} {profile.PrimaryAddress.PostalCode}
                                            <br />
                                            {profile.PrimaryAddress.CountryISOAlpha2Code}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Financials Tab */}
                            {activeTab === 'financials' && (
                                <div className="space-y-6">
                                    {financials.length > 0 ? (
                                        financials.map((statement, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    {statement.StatementDate} {statement.FiscalYear && `(FY ${statement.FiscalYear})`}
                                                </h3>

                                                {statement.IncomeStatement && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Income Statement</h4>
                                                        <dl className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <dt className="text-xs text-gray-500">Revenue</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.IncomeStatement.Revenue, statement.Currency)}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-xs text-gray-500">Net Income</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.IncomeStatement.NetIncome, statement.Currency)}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-xs text-gray-500">EBITDA</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.IncomeStatement.EBITDA, statement.Currency)}</dd>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                )}

                                                {statement.BalanceSheet && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Balance Sheet</h4>
                                                        <dl className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <dt className="text-xs text-gray-500">Total Assets</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.BalanceSheet.TotalAssets, statement.Currency)}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-xs text-gray-500">Total Liabilities</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.BalanceSheet.TotalLiabilities, statement.Currency)}</dd>
                                                            </div>
                                                            <div>
                                                                <dt className="text-xs text-gray-500">Net Worth</dt>
                                                                <dd className="text-sm font-medium">{formatCurrency(statement.BalanceSheet.NetWorth, statement.Currency)}</dd>
                                                            </div>
                                                        </dl>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No financial data available</p>
                                    )}
                                </div>
                            )}

                            {/* Analytics Tab */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-6">
                                    {riskScores.length > 0 ? (
                                        riskScores.map((score, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{score.ScoreType}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${score.RiskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                                                            score.RiskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {score.RiskLevel}
                                                    </span>
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 mb-2">{score.ScoreValue}</p>
                                                <p className="text-sm text-gray-600 mb-2">{score.ScoreDescription}</p>
                                                <p className="text-xs text-gray-500">As of {score.ScoreDate}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No analytics data available</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
