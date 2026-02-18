'use client';

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
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Header with Icon and ID */}
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">#{id}</span>
            </div>

            {/* Company Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                {status && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                        {status}
                    </span>
                )}
                {type && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {type}
                    </span>
                )}
            </div>

            {/* Address */}
            {address && (
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{address}</p>
            )}

            {/* View Details Button */}
            <button
                onClick={onViewDetails}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
                View Details
            </button>
        </div>
    );
}
