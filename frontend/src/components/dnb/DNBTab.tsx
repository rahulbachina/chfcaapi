import React, { useState } from 'react';
import SearchBar from '../common/SearchBar';
import CompanyCard from '../common/CompanyCard';
import { searchCompanies } from '../../api/dnb';
import type { DNBMatchCandidate } from '../../types/dnb';
import DNBDetailModal from './DNBDetailModal';
import { Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DNBTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [country, setCountry] = useState('');
    const [results, setResults] = useState<DNBMatchCandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDuns, setSelectedDuns] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await searchCompanies(searchQuery, country);
            // Handle both structure types just in case
            setResults(response.MatchCandidate || []);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to search companies');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (candidate: DNBMatchCandidate): string => {
        const addr = candidate.Organization.PrimaryAddress;
        const parts = [];

        if (addr.PrimaryTownName) parts.push(addr.PrimaryTownName);
        if (addr.TerritoryAbbreviatedName) parts.push(addr.TerritoryAbbreviatedName);
        if (addr.PostalCode) parts.push(addr.PostalCode);
        if (addr.CountryISOAlpha2Code) parts.push(addr.CountryISOAlpha2Code);

        return parts.join(', ');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <section className="glass" style={{ padding: '40px', marginBottom: '40px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                        Dun & Bradstreet Investigation
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Search Global Database for Business Verification and Risk Analysis
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    <div style={{ width: '200px' }}>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="input-glass"
                            style={{ padding: '12px 16px', fontSize: '14px' }}
                        >
                            <option value="" style={{ color: 'black' }}>All Countries</option>
                            <option value="GB" style={{ color: 'black' }}>United Kingdom</option>
                            <option value="US" style={{ color: 'black' }}>United States</option>
                            <option value="CA" style={{ color: 'black' }}>Canada</option>
                            <option value="AU" style={{ color: 'black' }}>Australia</option>
                            <option value="DE" style={{ color: 'black' }}>Germany</option>
                            <option value="FR" style={{ color: 'black' }}>France</option>
                        </select>
                    </div>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        placeholder="Enter company name (e.g., Gorman)"
                        buttonText="Search Global DB"
                        loading={loading}
                    />
                </div>
            </section>

            {error && (
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Info size={20} />
                    {error}
                </div>
            )}

            {results.length > 0 && (
                <div style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                <AnimatePresence>
                    {results.map((candidate, idx) => (
                        <motion.div
                            key={candidate.Organization.DUNSNumber}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <CompanyCard
                                id={candidate.Organization.DUNSNumber}
                                name={candidate.Organization.OrganizationName.OrganizationPrimaryName[0].OrganizationName}
                                status={candidate.MatchGrade ? `Grade: ${candidate.MatchGrade}` : 'N/A'}
                                type={`Confidence: ${candidate.ConfidenceCode || 'N/A'}`}
                                address={formatAddress(candidate)}
                                onViewDetails={() => setSelectedDuns(candidate.Organization.DUNSNumber)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* No Results Empty State */}
            {!loading && !error && results.length === 0 && searchQuery && (
                <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                    <Info size={48} style={{ marginBottom: '16px' }} />
                    <p>No companies found matching your criteria.</p>
                </div>
            )}


            {/* Detail Modal */}
            <AnimatePresence>
                {selectedDuns && (
                    <DNBDetailModal
                        duns={selectedDuns}
                        onClose={() => setSelectedDuns(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
