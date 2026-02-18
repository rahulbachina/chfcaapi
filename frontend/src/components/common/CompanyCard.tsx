import React from 'react';
import { Building2 } from 'lucide-react';

interface CompanyCardProps {
    id: string;
    name: string;
    status?: string;
    type?: string;
    address?: string;
    onViewDetails: () => void;
}

export default function CompanyCard({
    id,
    name,
    status,
    type,
    address,
    onViewDetails,
}: CompanyCardProps) {
    return (
        <div
            className="glass card-anim"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
        >
            {/* Header with Icon and ID */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '8px', borderRadius: '12px' }}>
                    <Building2 size={24} color="#00d2ff" />
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>#{id}</span>
            </div>

            {/* Company Name */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', minHeight: '3rem' }}>{name}</h3>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {status && (
                    <span style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>
                        {status}
                    </span>
                )}
                {type && (
                    <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-muted)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>
                        {type}
                    </span>
                )}
            </div>

            {/* Address */}
            {address && (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', minHeight: '40px' }}>
                    {address}
                </p>
            )}

            {/* View Details Button */}
            <button
                onClick={onViewDetails}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '10px 16px' }}
            >
                View Details
            </button>
        </div>
    );
}
