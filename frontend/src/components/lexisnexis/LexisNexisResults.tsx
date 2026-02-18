import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ScreeningResult, RiskLevel } from '../../types/lexisnexis';

interface LexisNexisResultsProps {
    result: ScreeningResult;
}

export default function LexisNexisResults({ result }: LexisNexisResultsProps) {
    const getRiskLevelColor = (level: RiskLevel) => {
        switch (level) {
            case 'HIGH':
                return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
            case 'MEDIUM':
                return { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: 'rgba(234, 179, 8, 0.2)' }; // Yellow
            case 'LOW':
                return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' }; // Green
            default:
                return { bg: 'rgba(255, 255, 255, 0.1)', text: 'var(--text-muted)', border: 'var(--glass-border)' };
        }
    };

    const getRiskIcon = (level: RiskLevel) => {
        switch (level) {
            case 'HIGH':
                return <XCircle size={16} />;
            case 'MEDIUM':
                return <AlertTriangle size={16} />;
            case 'LOW':
                return <CheckCircle size={16} />;
            default:
                return <AlertTriangle size={16} />;
        }
    };

    const riskStyle = getRiskLevelColor(result.highestRiskLevel);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Card */}
            <div className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Screening Summary</h3>
                    <span style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '13px',
                        background: riskStyle.bg,
                        color: riskStyle.text,
                        border: `1px solid ${riskStyle.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {getRiskIcon(result.highestRiskLevel)}
                        {result.highestRiskLevel} RISK
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Screening ID</div>
                        <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{result.screeningId}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Reference ID</div>
                        <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{result.referenceId}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Status</div>
                        <div style={{ fontWeight: 600 }}>{result.status}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Matches Found</div>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{result.matchCount}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Created At</div>
                        <div>{new Date(result.createdAt).toLocaleString()}</div>
                    </div>
                    {result.processingTime && (
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Processing Time</div>
                            <div>{result.processingTime.toFixed(2)}s</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Matches */}
            {result.matches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                        Matches ({result.matches.length})
                    </h3>
                    {result.matches.map((match) => {
                        const matchRisk = getRiskLevelColor(match.riskLevel);
                        return (
                            <div
                                key={match.matchId}
                                className="glass"
                                style={{ padding: '24px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
                                            {match.name}
                                        </h4>
                                        {match.aliases && match.aliases.length > 0 && (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                                                Also known as: {match.aliases.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            background: matchRisk.bg,
                                            color: matchRisk.text,
                                            border: `1px solid ${matchRisk.border}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {getRiskIcon(match.riskLevel)}
                                            {match.riskLevel}
                                        </span>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'var(--text-muted)'
                                        }}>
                                            Score: {match.score}
                                        </span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                    {match.categories.map((category) => (
                                        <span
                                            key={category}
                                            style={{
                                                background: 'rgba(0, 210, 255, 0.1)',
                                                color: '#00d2ff',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 600
                                            }}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>

                                {/* Details */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-muted)' }}>Source: </span>
                                        <span style={{ fontWeight: 600 }}>{match.source.listName}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-muted)' }}>List Type: </span>
                                        <span>{match.source.listType}</span>
                                    </div>
                                    {match.dob && (
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>DOB: </span>
                                            <span>{match.dob}</span>
                                        </div>
                                    )}
                                    {match.nationality && (
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>Nationality: </span>
                                            <span>{match.nationality}</span>
                                        </div>
                                    )}
                                    {match.source.country && (
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>Country: </span>
                                            <span>{match.source.country}</span>
                                        </div>
                                    )}
                                    {match.lastUpdated && (
                                        <div>
                                            <span style={{ color: 'var(--text-muted)' }}>Updated: </span>
                                            <span>{new Date(match.lastUpdated).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {match.description && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                                        <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>{match.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
                    <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Matches Found</h3>
                    <p style={{ color: '#22c55e', opacity: 0.8 }}>
                        The subject was not found in any sanctions, PEP, or adverse media lists.
                    </p>
                </div>
            )}
        </div>
    );
}
