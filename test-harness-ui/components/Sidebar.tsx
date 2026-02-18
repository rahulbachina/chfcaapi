'use client';

import Link from 'next/link';
import { Building2, FileText, FlaskConical } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
            {/* Logo/Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="font-semibold text-gray-900">Vantage KYC Automation Test Harness</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                {/* Testing - Core Section */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Testing - Core
                    </h3>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                href="#"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <FileText className="w-4 h-4" />
                                All Cases
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                <Building2 className="w-4 h-4" />
                                Create Case
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Testing - Third Party APIs Section */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Testing - Third Party APIs
                    </h3>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                href="/"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-blue-600 rounded-md"
                            >
                                <FlaskConical className="w-4 h-4" />
                                API Test Harness
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
