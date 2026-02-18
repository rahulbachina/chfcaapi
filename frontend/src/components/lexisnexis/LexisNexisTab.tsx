import React, { useState } from 'react';
import { User, Building, Loader2, Info, Shield } from 'lucide-react';
import { screenPerson, screenEntity } from '../../api/lexisnexis';
import type { PersonScreenRequest, EntityScreenRequest, ScreeningResult } from '../../types/lexisnexis';
import LexisNexisResults from './LexisNexisResults';
import { motion } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <section className="glass" style={{ padding: '40px', marginBottom: '40px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                        LexisNexis Screening
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Screen individuals and entities against sanctions, PEP, and adverse media lists
                    </p>
                </div>

                {/* Screening Type Toggle */}
                <div style={{ marginBottom: '32px', display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setScreeningType('person')}
                        className={screeningType === 'person' ? "btn-primary" : "glass"}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            color: screeningType === 'person' ? 'white' : 'var(--text-muted)',
                            border: screeningType === 'person' ? 'none' : '1px solid var(--glass-border)',
                            cursor: 'pointer'
                        }}
                    >
                        <User size={18} />
                        Person Screening
                    </button>
                    <button
                        onClick={() => setScreeningType('entity')}
                        className={screeningType === 'entity' ? "btn-primary" : "glass"}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '12px',
                            color: screeningType === 'entity' ? 'white' : 'var(--text-muted)',
                            border: screeningType === 'entity' ? 'none' : '1px solid var(--glass-border)',
                            cursor: 'pointer'
                        }}
                    >
                        <Building size={18} />
                        Entity Screening
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                    {/* Form Section */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>
                            {screeningType === 'person' ? 'Person Details' : 'Entity Details'}
                        </h3>

                        {screeningType === 'person' ? (
                            <form onSubmit={handlePersonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={personForm.fullName}
                                        onChange={(e) => setPersonForm({ ...personForm, fullName: e.target.value })}
                                        className="input-glass"
                                        placeholder="e.g., Vladimir Putin"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>First Name</label>
                                        <input
                                            type="text"
                                            value={personForm.firstName}
                                            onChange={(e) => setPersonForm({ ...personForm, firstName: e.target.value })}
                                            className="input-glass"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Last Name</label>
                                        <input
                                            type="text"
                                            value={personForm.lastName}
                                            onChange={(e) => setPersonForm({ ...personForm, lastName: e.target.value })}
                                            className="input-glass"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={personForm.dob}
                                        onChange={(e) => setPersonForm({ ...personForm, dob: e.target.value })}
                                        className="input-glass"
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Nationality</label>
                                        <input
                                            type="text"
                                            value={personForm.nationality}
                                            onChange={(e) => setPersonForm({ ...personForm, nationality: e.target.value })}
                                            className="input-glass"
                                            placeholder="e.g., RU"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Country</label>
                                        <input
                                            type="text"
                                            value={personForm.country}
                                            onChange={(e) => setPersonForm({ ...personForm, country: e.target.value })}
                                            className="input-glass"
                                            placeholder="e.g., RU"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
                                    {loading ? 'Screening...' : 'Screen Person'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleEntitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Entity Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={entityForm.entityName}
                                        onChange={(e) => setEntityForm({ ...entityForm, entityName: e.target.value })}
                                        className="input-glass"
                                        placeholder="e.g., Acme Corporation"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Country</label>
                                    <input
                                        type="text"
                                        value={entityForm.country}
                                        onChange={(e) => setEntityForm({ ...entityForm, country: e.target.value })}
                                        className="input-glass"
                                        placeholder="e.g., US"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Registration Number</label>
                                    <input
                                        type="text"
                                        value={entityForm.registrationNumber}
                                        onChange={(e) => setEntityForm({ ...entityForm, registrationNumber: e.target.value })}
                                        className="input-glass"
                                        placeholder="e.g., 123456789"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
                                    {loading ? 'Screening...' : 'Screen Entity'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Results Section */}
                    <div>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-muted)' }}>Checking against global watchlists...</p>
                            </div>
                        )}

                        {error && (
                            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Info size={20} />
                                {error}
                            </div>
                        )}

                        {!loading && !result && !error && (
                            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                                <Shield size={64} style={{ marginBottom: '16px' }} />
                                <p>Results will appear here</p>
                            </div>
                        )}

                        {result && !loading && <LexisNexisResults result={result} />}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
