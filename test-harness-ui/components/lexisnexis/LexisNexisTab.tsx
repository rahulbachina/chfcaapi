'use client';

import { useState } from 'react';
import { User, Building } from 'lucide-react';
import { screenPerson, screenEntity } from '@/lib/api/lexisnexis';
import type { PersonScreenRequest, EntityScreenRequest, ScreeningResult } from '@/types/lexisnexis';
import LexisNexisResults from './LexisNexisResults';

export default function LexisNexisTab() {
    const [screeningType, setScreeningType] = useState<'person' | 'entity'>('person');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ScreeningResult | null>(null);

    // Person form state
    const [personForm, setPersonForm] = useState<PersonScreenRequest>({
        referenceId: `REF-${Date.now()}`,
        fullName: '',
        firstName: '',
        lastName: '',
        dob: '',
        nationality: '',
        country: '',
    });

    // Entity form state
    const [entityForm, setEntityForm] = useState<EntityScreenRequest>({
        referenceId: `REF-${Date.now()}`,
        entityName: '',
        country: '',
        registrationNumber: '',
    });

    const handlePersonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await screenPerson(personForm);
            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to screen person');
        } finally {
            setLoading(false);
        }
    };

    const handleEntitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await screenEntity(entityForm);
            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to screen entity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    LexisNexis Bridger XG API Test
                </h2>
                <p className="text-sm text-gray-600">
                    Screen individuals and entities against sanctions, PEP, and adverse media lists
                </p>
            </div>

            {/* Screening Type Toggle */}
            <div className="mb-6">
                <div className="inline-flex rounded-lg border border-gray-200 p-1">
                    <button
                        onClick={() => setScreeningType('person')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${screeningType === 'person'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Person Screening
                    </button>
                    <button
                        onClick={() => setScreeningType('entity')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${screeningType === 'entity'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Building className="w-4 h-4" />
                        Entity Screening
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {screeningType === 'person' ? 'Person Details' : 'Entity Details'}
                    </h3>

                    {screeningType === 'person' ? (
                        <form onSubmit={handlePersonSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={personForm.fullName}
                                    onChange={(e) => setPersonForm({ ...personForm, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Vladimir Putin"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={personForm.firstName}
                                        onChange={(e) => setPersonForm({ ...personForm, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={personForm.lastName}
                                        onChange={(e) => setPersonForm({ ...personForm, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={personForm.dob}
                                    onChange={(e) => setPersonForm({ ...personForm, dob: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nationality
                                    </label>
                                    <input
                                        type="text"
                                        value={personForm.nationality}
                                        onChange={(e) => setPersonForm({ ...personForm, nationality: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., RU"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={personForm.country}
                                        onChange={(e) => setPersonForm({ ...personForm, country: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., RU"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? 'Screening...' : 'Screen Person'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleEntitySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Entity Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={entityForm.entityName}
                                    onChange={(e) => setEntityForm({ ...entityForm, entityName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Acme Corporation"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={entityForm.country}
                                    onChange={(e) => setEntityForm({ ...entityForm, country: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., US"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number
                                </label>
                                <input
                                    type="text"
                                    value={entityForm.registrationNumber}
                                    onChange={(e) => setEntityForm({ ...entityForm, registrationNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 123456789"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {loading ? 'Screening...' : 'Screen Entity'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Results Section */}
                <div>
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {result && !loading && <LexisNexisResults result={result} />}
                </div>
            </div>
        </div>
    );
}
