import React, { useState, useEffect } from 'react';
import { X, Building2, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompanyProfile, getFinancialStatements, getAnalytics } from '../../api/dnb';
import type { DNBCompanyProfile, DNBFinancialStatementDetail, DNBRiskScore } from '../../types/dnb';

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
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass modal-content"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                            {profile?.OrganizationName.OrganizationPrimaryName[0].OrganizationName || 'Loading...'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>DUNS: {duns}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <nav className="tab-container" style={{ padding: '0 24px', marginTop: '16px' }}>
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <Building2 size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />Profile
                    </button>
                    <button className={`tab-btn ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>
                        <DollarSign size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />Financials
                    </button>
                    <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <TrendingUp size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />Analytics
                    </button>
                </nav>

                {/* Content */}
                <div style={{ padding: '24px', minHeight: '400px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Retrieving deep intelligence...</p>
                        </div>
                    ) : (
                        <>
                            {/* Profile Tab */}
                            {activeTab === 'profile' && profile && (
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    <div className="glass" style={{ padding: '24px' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--accent-primary)' }}>Basic Information</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Operating Status</div>
                                                <div style={{ fontWeight: 600 }}>{profile.OperatingStatusText || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Start Date</div>
                                                <div style={{ fontWeight: 600 }}>{profile.StartDate || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Employees</div>
                                                <div style={{ fontWeight: 600 }}>{profile.EmployeeQuantity?.toLocaleString() || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Annual Revenue</div>
                                                <div style={{ fontWeight: 600 }}>{formatCurrency(profile.SalesRevenueAmount)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {profile.BusinessDescription && (
                                        <div className="glass" style={{ padding: '24px' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: 'var(--accent-secondary)' }}>Business Description</h3>
                                            <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{profile.BusinessDescription}</p>
                                        </div>
                                    )}

                                    <div className="glass" style={{ padding: '24px' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>Address</h3>
                                        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
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
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {financials.length > 0 ? (
                                        financials.map((statement, index) => (
                                            <div key={index} className="glass" style={{ padding: '24px' }}>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>
                                                    {statement.StatementDate} {statement.FiscalYear && `(FY ${statement.FiscalYear})`}
                                                </h3>

                                                {statement.IncomeStatement && (
                                                    <div style={{ marginBottom: '24px' }}>
                                                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Income Statement</h4>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Revenue</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.IncomeStatement.Revenue, statement.Currency)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Net Income</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.IncomeStatement.NetIncome, statement.Currency)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>EBITDA</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.IncomeStatement.EBITDA, statement.Currency)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {statement.BalanceSheet && (
                                                    <div>
                                                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance Sheet</h4>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Total Assets</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.BalanceSheet.TotalAssets, statement.Currency)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Total Liabilities</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.BalanceSheet.TotalLiabilities, statement.Currency)}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Net Worth</div>
                                                                <div style={{ fontWeight: 600 }}>{formatCurrency(statement.BalanceSheet.NetWorth, statement.Currency)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No financial data available</div>
                                    )}
                                </div>
                            )}

                            {/* Analytics Tab */}
                            {activeTab === 'analytics' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {riskScores.length > 0 ? (
                                        riskScores.map((score, index) => (
                                            <div key={index} className="glass" style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{score.ScoreType}</h3>
                                                    <span style={{
                                                        padding: '6px 14px',
                                                        borderRadius: '20px',
                                                        fontWeight: 600,
                                                        fontSize: '13px',
                                                        background: score.RiskLevel === 'LOW' ? 'rgba(34, 197, 94, 0.1)' :
                                                            score.RiskLevel === 'MEDIUM' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: score.RiskLevel === 'LOW' ? '#22c55e' :
                                                            score.RiskLevel === 'MEDIUM' ? '#eab308' : '#ef4444'
                                                    }}>
                                                        {score.RiskLevel}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>{score.ScoreValue}</div>
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{score.ScoreDescription}</p>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>As of {score.ScoreDate}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No analytics data available</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
