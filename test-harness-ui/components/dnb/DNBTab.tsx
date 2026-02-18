'use client';

import { useState } from 'react';
import SearchBar from '../SearchBar';
import CompanyCard from '../CompanyCard';
import { searchCompanies } from '@/lib/api/dnb';
import type { DNBMatchCandidate } from '@/types/dnb';
import DNBDetailModal from './DNBDetailModal';

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
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Dun & Bradstreet API Test
                </h2>
                <p className="text-sm text-gray-600">
                    Search for companies and retrieve detailed business information
                </p>
            </div>

            {/* Search Controls */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">All Countries</option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                        </select>
                    </div>
                </div>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    placeholder="Enter company name (e.g., Gorman)"
                    buttonText="Search Companies"
                />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
                <div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Found {results.length} result{results.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((candidate) => (
                            <CompanyCard
                                key={candidate.Organization.DUNSNumber}
                                id={candidate.Organization.DUNSNumber}
                                name={candidate.Organization.OrganizationName.OrganizationPrimaryName[0].OrganizationName}
                                status={candidate.MatchGrade || 'N/A'}
                                type={`Confidence: ${candidate.ConfidenceCode || 'N/A'}`}
                                address={formatAddress(candidate)}
                                onViewDetails={() => setSelectedDuns(candidate.Organization.DUNSNumber)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {!loading && !error && results.length === 0 && searchQuery && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No companies found. Try a different search term.</p>
                </div>
            )}

            {/* Detail Modal */}
            {selectedDuns && (
                <DNBDetailModal
                    duns={selectedDuns}
                    onClose={() => setSelectedDuns(null)}
                />
            )}
        </div>
    );
}
