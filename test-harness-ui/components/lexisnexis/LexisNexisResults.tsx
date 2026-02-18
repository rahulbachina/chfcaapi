'use client';

import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ScreeningResult, RiskLevel } from '@/types/lexisnexis';

interface LexisNexisResultsProps {
    result: ScreeningResult;
}

export default function LexisNexisResults({ result }: LexisNexisResultsProps) {
    const getRiskLevelColor = (level: RiskLevel) => {
        switch (level) {
            case 'HIGH':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRiskIcon = (level: RiskLevel) => {
        switch (level) {
            case 'HIGH':
                return <XCircle className="w-5 h-5" />;
            case 'MEDIUM':
                return <AlertTriangle className="w-5 h-5" />;
            case 'LOW':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <AlertTriangle className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Screening Summary</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(result.highestRiskLevel)}`}>
                        {result.highestRiskLevel} RISK
                    </span>
                </div>

                <dl className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Screening ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{result.screeningId}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Reference ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{result.referenceId}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">{result.status}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Matches Found</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{result.matchCount}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(result.createdAt).toLocaleString()}</dd>
                    </div>
                    {result.processingTime && (
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Processing Time</dt>
                            <dd className="mt-1 text-sm text-gray-900">{result.processingTime.toFixed(2)}s</dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Matches */}
            {result.matches.length > 0 ? (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Matches ({result.matches.length})
                    </h3>
                    {result.matches.map((match) => (
                        <div
                            key={match.matchId}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                                        {match.name}
                                    </h4>
                                    {match.aliases && match.aliases.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Also known as: {match.aliases.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${getRiskLevelColor(match.riskLevel)}`}>
                                        {getRiskIcon(match.riskLevel)}
                                        {match.riskLevel}
                                    </span>
                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                        Score: {match.score}
                                    </span>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {match.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>

                            {/* Details */}
                            <dl className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-gray-500">Source</dt>
                                    <dd className="text-gray-900 font-medium">{match.source.listName}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">List Type</dt>
                                    <dd className="text-gray-900">{match.source.listType}</dd>
                                </div>
                                {match.dob && (
                                    <div>
                                        <dt className="text-gray-500">Date of Birth</dt>
                                        <dd className="text-gray-900">{match.dob}</dd>
                                    </div>
                                )}
                                {match.nationality && (
                                    <div>
                                        <dt className="text-gray-500">Nationality</dt>
                                        <dd className="text-gray-900">{match.nationality}</dd>
                                    </div>
                                )}
                                {match.source.country && (
                                    <div>
                                        <dt className="text-gray-500">Country</dt>
                                        <dd className="text-gray-900">{match.source.country}</dd>
                                    </div>
                                )}
                                {match.lastUpdated && (
                                    <div>
                                        <dt className="text-gray-500">Last Updated</dt>
                                        <dd className="text-gray-900">{new Date(match.lastUpdated).toLocaleDateString()}</dd>
                                    </div>
                                )}
                            </dl>

                            {match.description && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-700">{match.description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-900 mb-1">No Matches Found</h3>
                    <p className="text-sm text-green-700">
                        The subject was not found in any sanctions, PEP, or adverse media lists.
                    </p>
                </div>
            )}
        </div>
    );
}
