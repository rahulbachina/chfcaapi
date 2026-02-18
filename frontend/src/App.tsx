import React, { useState } from 'react';
import { Search, Shield, User, Info, Loader2, HelpCircle, Hash, Building2, Users, ExternalLink, Calendar, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png';
import DNBTab from './components/dnb/DNBTab';
import LexisNexisTab from './components/lexisnexis/LexisNexisTab';

interface SearchResult {
  'URL'?: string;
  'Status'?: string;
  'Reference Number'?: string;
  'Type of business or Individual'?: string;
  'Name'?: string;
  // Companies House fields
  company_number?: string;
  title?: string;
  company_type?: string;
  company_status?: string;
  address_snippet?: string;
}

const mockResults: SearchResult[] = [
  {
    "URL": "https://register.fca.org.uk/services/V0.1/Firm/204224",
    "Status": "See full details",
    "Reference Number": "204224",
    "Type of business or Individual": "Firm",
    "Name": "Barclays Bank PLC"
  },
  {
    "URL": "https://register.fca.org.uk/services/V0.1/Firm/919921",
    "Status": "See full details",
    "Reference Number": "919921",
    "Type of business or Individual": "Firm",
    "Name": "Cyborg Finance Limited"
  }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<'fca' | 'ch' | 'dnb' | 'lexis'>('fca');
  const [activeTab, setActiveTab] = useState('overview');

  const retrievableInfo = [
    {
      category: "Firm Insights",
      items: [
        { name: "Firm Details", desc: "Core identity and registration status of any regulated firm." },
        { name: "Trading Names", desc: "Official brand names and trading styles used by the business." },
        { name: "Addresses", desc: "Registered office and official contact locations." },
        { name: "Regulators", desc: "Details of the specific bodies overseeing the firm's activities." },
        { name: "Passporting", desc: "Rights to operate across borders within the European Economic Area." }
      ]
    },
    {
      category: "Permissions & Requirements",
      items: [
        { name: "Regulated Activities", desc: "Exactly what financial services the firm is authorised to provide." },
        { name: "Requirements", desc: "Specific conditions or restrictions placed on the firm's operations." },
        { name: "Investment Types", desc: "Detailed breakdown of permitted investment instruments." }
      ]
    },
    {
      category: "People & Compliance",
      items: [
        { name: "Individuals", desc: "Key personnel and their specific regulatory roles within a firm." },
        { name: "Control Functions", desc: "Management roles with significant influence on the business." },
        { name: "Disciplinary History", desc: "Professional record of past regulatory actions or findings." },
        { name: "Waivers & Exclusions", desc: "Approved exemptions from standard regulatory rules." }
      ]
    }
  ];

  const faqs = [
    { q: "What is an FRN?", a: "A Firm Reference Number is a unique 6 or 7-digit ID assigned to every firm regulated by the FCA." },
    { q: "What is an IRN?", a: "Individual Reference Numbers are unique IDs for persons approved to perform regulated roles." },
    { q: "How do I search?", a: "You can search by the exact name of a firm/individual or their Reference Number (FRN/IRN)." }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = searchSource === 'fca'
        ? `http://localhost:8000/api/search?q=${encodeURIComponent(query)}`
        : `http://localhost:8000/api/companies/search?q=${encodeURIComponent(query)}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (searchSource === 'fca') {
        if (data && data.Data) {
          setResults(data.Data);
        } else {
          setResults([]);
          if (data.Message) setError(data.Message);
        }
      } else {
        // Companies House response structure is { items: [...] }
        if (data && data.items) {
          setResults(data.items);
        } else {
          setResults([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend. Using mock data for demonstration.');
      setResults(mockResults.filter(r => r.Name?.toLowerCase().includes(query.toLowerCase())));
    } finally {
      setLoading(false);
    }
  };

  const fetchFirmDetails = async (frn: string) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    setActiveTab('overview');
    try {
      const [details, individuals, permissions, address, requirements, regulators, passports, disciplinary, waivers, names] = await Promise.all([
        fetch(`http://localhost:8000/api/firm/${frn}`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/individuals`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/permissions`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/address`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/requirements`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/regulators`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/passports`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/disciplinary`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/waivers`).then(r => r.ok ? r.json() : null),
        fetch(`http://localhost:8000/api/firm/${frn}/names`).then(r => r.ok ? r.json() : null)
      ]);

      // Normalize permissions: FCA API returns an object where keys are permission names, 
      // but we need an array for mapping/searching in the UI.
      const rawPermissions = permissions?.Data;
      const normalizedPermissions = !rawPermissions ? [] : (
        Array.isArray(rawPermissions) ? rawPermissions :
          Object.entries(rawPermissions).map(([name, details]) => ({
            'Permission Name': name,
            'Details': details
          }))
      );

      setSelectedFirm({
        source: 'fca',
        details: details?.Data?.[0] || {},
        individuals: individuals?.Data || [],
        permissions: normalizedPermissions,
        address: address?.Data?.[0] || null,
        requirements: requirements?.Data || [],
        regulators: regulators?.Data || [],
        passports: passports?.Data || [],
        disciplinary: disciplinary?.Data || [],
        waivers: waivers?.Data || [],
        names: names?.Data || []
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch firm details');
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchCompanyDetails = async (companyNumber: string) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    setActiveTab('overview');
    try {
      const response = await fetch(`http://localhost:8000/api/companies/${companyNumber}`);
      const data = await response.json();

      setSelectedFirm({
        source: 'ch',
        details: data.profile,
        individuals: data.officers?.items || [],
        psc: data.psc?.items || [],
        filing_history: data.filing_history?.items || [],
        address: data.profile?.registered_office_address || {}
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch company details');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
            <div style={{
              background: '#fff',
              padding: '12px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)'
            }}>
              <img
                src={logo}
                alt="Ardonagh Specialty Logo"
                style={{ maxHeight: '60px', width: 'auto' }}
              />
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-2px', textTransform: 'uppercase' }}>
              FCA<span className="text-gradient"> SEARCH</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: '24px', fontWeight: 500 }}>
            Precision intelligence tool for the Financial Services Register.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowHelp(false)}
              className={!showHelp ? "btn-primary" : "glass"}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                borderRadius: '30px',
                color: !showHelp ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Search Dashboard
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className={showHelp ? "btn-primary" : "glass"}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                borderRadius: '30px',
                color: showHelp ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
              Help & Information
            </button>
          </div>
        </motion.div>
      </header>

      {!showHelp ? (
        <>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ padding: '40px', marginBottom: '40px' }}
          >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setSearchSource('fca')}
                className={searchSource === 'fca' ? 'btn-primary' : 'glass'}
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  borderRadius: '30px',
                  color: searchSource === 'fca' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  opacity: searchSource === 'fca' ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}
              >
                FCA Register
              </button>
              <button
                onClick={() => setSearchSource('ch')}
                className={searchSource === 'ch' ? 'btn-primary' : 'glass'}
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  borderRadius: '30px',
                  color: searchSource === 'ch' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  opacity: searchSource === 'ch' ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}
              >
                Companies House
              </button>
              <button
                onClick={() => setSearchSource('dnb')}
                className={searchSource === 'dnb' ? 'btn-primary' : 'glass'}
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  borderRadius: '30px',
                  color: searchSource === 'dnb' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  opacity: searchSource === 'dnb' ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}
              >
                Dun & Bradstreet
              </button>
              <button
                onClick={() => setSearchSource('lexis')}
                className={searchSource === 'lexis' ? 'btn-primary' : 'glass'}
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  borderRadius: '30px',
                  color: searchSource === 'lexis' ? 'white' : 'var(--text-muted)',
                  fontWeight: 600,
                  opacity: searchSource === 'lexis' ? 1 : 0.7,
                  transition: 'all 0.3s ease'
                }}
              >
                LexisNexis
              </button>
            </div>
            {(searchSource === 'fca' || searchSource === 'ch') && (
              <>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="input-glass"
                      placeholder={searchSource === 'fca' ? "Search by Firm Name, FRN, or IRN..." : "Search by Company Name or Number..."}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      style={{ paddingLeft: '56px' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
                    {loading ? 'Searching...' : `Search ${searchSource === 'fca' ? 'Register' : 'Companies'}`}
                  </button>
                </form>
              </>
            )}

            {searchSource === 'dnb' && <DNBTab />}
            {searchSource === 'lexis' && <LexisNexisTab />}
          </motion.section>

          {(searchSource === 'fca' || searchSource === 'ch') && error && (
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Info size={20} />
              {error}
            </div>
          )}

          {(searchSource === 'fca' || searchSource === 'ch') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              <AnimatePresence>
                {results.map((result, idx) => (
                  <motion.div
                    key={searchSource === 'fca' ? (result['Reference Number'] || `fca-${idx}`) : (result.company_number || `ch-${idx}`)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass card-anim"
                    style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '8px', borderRadius: '12px' }}>
                        {searchSource === 'fca' ? (
                          result['Type of business or Individual'] === 'Firm' ? <Shield size={24} color="#00d2ff" /> : <User size={24} color="#9d50bb" />
                        ) : (
                          <Building2 size={24} color="#00d2ff" />
                        )}
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        #{searchSource === 'fca' ? result['Reference Number'] : result.company_number}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                      {searchSource === 'fca' ? result.Name : result.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <Hash size={14} color="var(--accent-primary)" />
                        <span>{searchSource === 'fca' ? result['Reference Number'] : result.company_number}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        <Building2 size={14} color="var(--accent-secondary)" />
                        <span>
                          {searchSource === 'fca'
                            ? `${result['Type of business or Individual']} • Registered`
                            : `${result.company_status?.toUpperCase() || 'ACTIVE'} • ${result.company_type?.replace('-', ' ').toUpperCase() || 'LTD'}`
                          }
                        </span>
                      </div>
                      {searchSource === 'ch' && result.address_snippet && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {result.address_snippet}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (searchSource === 'fca') {
                          const frn = result['Reference Number'];
                          if (frn) {
                            fetchFirmDetails(frn);
                          } else {
                            setError('Could not extract FRN from result');
                          }
                        } else {
                          const companyNumber = result.company_number;
                          if (companyNumber) {
                            fetchCompanyDetails(companyNumber);
                          }
                        }
                      }}
                      className="btn-primary"
                      style={{ padding: '10px 16px', fontSize: '14px', width: '100%' }}
                    >
                      View Details
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {(searchSource === 'fca' || searchSource === 'ch') && !(loading || results.length > 0 || query) && (
            <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
              <Shield size={64} style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '1.5rem' }}>Ready for Investigation</h2>
              <p>Enter a name or reference number to begin.</p>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {retrievableInfo.map((section, idx) => (
              <div key={idx} className="glass" style={{ padding: '32px' }}>
                <h3 className="text-gradient" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase' }}>
                  {section.category}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(157, 80, 187, 0.2)', padding: '12px', borderRadius: '15px' }}>
                <HelpCircle size={28} color="var(--accent-secondary)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Search Guidance & FAQs</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Q: {faq.q}</div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(90deg, #00d2ff10, #9d50bb10)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              All data is queried directly from the official <strong style={{ color: 'var(--text-main)' }}>FCA Financial Services Register API (V0.1)</strong>.
            </p>
          </div>
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass modal-content"
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '800px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '40px'
              }}
            >
              {detailLoading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
                  <p>Retrieving deep intelligence...</p>
                </div>
              ) : selectedFirm ? (
                <div className="space-y-6">
                  {/* Header */}
                  <header style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
                        {selectedFirm.source === 'ch'
                          ? selectedFirm.details?.company_name
                          : (selectedFirm.details?.['Organisation Name'] || selectedFirm.details?.Name || 'Firm Details')
                        }
                      </h2>
                      {selectedFirm.source === 'ch' && (
                        <a
                          href={`https://find-and-update.company-information.service.gov.uk/company/${selectedFirm.details?.company_number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gradient"
                          style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                        >
                          View on CH <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <span className="flex items-center gap-2">
                        <Hash size={14} />
                        {selectedFirm.source === 'ch' ? 'Number: ' : 'FRN: '}
                        {selectedFirm.source === 'ch' ? selectedFirm.details?.company_number : selectedFirm.details?.FRN}
                      </span>
                      <span className="flex items-center gap-2">
                        <Building2 size={14} />
                        {selectedFirm.source === 'ch'
                          ? (selectedFirm.details?.type?.replace('-', ' ').toUpperCase() || 'LIMITED COMPANY')
                          : selectedFirm.details?.['Business Type']
                        }
                      </span>
                      <span style={{
                        background: (selectedFirm.details?.Status === 'Authorised' || selectedFirm.details?.company_status === 'active' || selectedFirm.details?.company_status === 'open') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: (selectedFirm.details?.Status === 'Authorised' || selectedFirm.details?.company_status === 'active' || selectedFirm.details?.company_status === 'open') ? '#22c55e' : '#ef4444',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {selectedFirm.source === 'ch' ? selectedFirm.details?.company_status : selectedFirm.details?.Status}
                      </span>
                      {selectedFirm.source === 'ch' && selectedFirm.details?.date_of_creation && (
                        <span className="flex items-center gap-2"><Calendar size={14} /> Incorporated: {new Date(selectedFirm.details.date_of_creation).toLocaleDateString()}</span>
                      )}
                    </div>
                  </header>

                  {/* Tabs */}
                  <nav className="tab-container">
                    <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                    {selectedFirm.source === 'ch' ? (
                      <>
                        <button className={`tab-btn ${activeTab === 'filing' ? 'active' : ''}`} onClick={() => setActiveTab('filing')}>Filing history</button>
                        <button className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')}>People</button>
                      </>
                    ) : (
                      <>
                        <button className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`} onClick={() => setActiveTab('permissions')}>Permissions</button>
                        <button className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')}>People</button>
                      </>
                    )}
                    <button className={`tab-btn ${activeTab === 'more' ? 'active' : ''}`} onClick={() => setActiveTab('more')}>More</button>
                  </nav>

                  <div className="tab-content" style={{ minHeight: '400px' }}>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <section>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Registered Office Address</h3>
                            <div className="glass" style={{ padding: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                              <MapPin size={18} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
                              {selectedFirm.address ? (
                                selectedFirm.source === 'ch' ? (
                                  <>
                                    {selectedFirm.address.address_line_1}<br />
                                    {selectedFirm.address.address_line_2 && <>{selectedFirm.address.address_line_2}<br /></>}
                                    {selectedFirm.address.locality && <>{selectedFirm.address.locality}<br /></>}
                                    {selectedFirm.address.region && <>{selectedFirm.address.region}<br /></>}
                                    {selectedFirm.address.postal_code}
                                  </>
                                ) : (
                                  <>
                                    {selectedFirm.address['Address Line 1']}<br />
                                    {selectedFirm.address['Address Line 2'] && <>{selectedFirm.address['Address Line 2']}<br /></>}
                                    {selectedFirm.address['Address Line 3'] && <>{selectedFirm.address['Address Line 3']}<br /></>}
                                    {selectedFirm.address.Town && <>{selectedFirm.address.Town}<br /></>}
                                    {selectedFirm.address.County && <>{selectedFirm.address.County}<br /></>}
                                    {selectedFirm.address.Postcode}
                                  </>
                                )
                              ) : 'Address not available'}
                            </div>
                          </section>

                          {selectedFirm.source === 'fca' && (
                            <section style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>What can this firm do in the UK?</h3>

                              <div style={{ display: 'grid', gap: '16px' }}>
                                {/* Restrictions */}
                                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--accent-secondary)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Restrictions</h4>
                                  </div>
                                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Check the requirements placed on this firm. Requirements are restrictions governing the regulated activities that this firm can do.
                                  </p>
                                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {selectedFirm.requirements && selectedFirm.requirements.length > 0 ? (
                                      selectedFirm.requirements.map((req: any, i: number) => (
                                        <div key={i} style={{ marginBottom: '10px', fontSize: '14px', display: 'flex', gap: '8px' }}>
                                          <span style={{ color: 'var(--accent-secondary)' }}>•</span>
                                          <span>{req.Requirement || req['Requirement Type'] || req.Description}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No specific restrictions found.</div>
                                    )}
                                  </div>
                                </div>

                                {/* Client Money */}
                                <div className="glass" style={{ padding: '20px', borderLeft: '4px solid var(--accent-primary)' }}>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0' }}>Client Money</h4>
                                  <p style={{ fontSize: '14px' }}>
                                    {Array.isArray(selectedFirm.permissions) && selectedFirm.permissions.some((p: any) =>
                                      JSON.stringify(p).toLowerCase().includes('client money') &&
                                      !JSON.stringify(p).toLowerCase().includes('cannot hold')
                                    ) ? (
                                      "This firm can hold and can control client money."
                                    ) : (
                                      "This firm cannot hold client money."
                                    )}
                                  </p>
                                </div>
                              </div>
                            </section>
                          )}

                          <section>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Company Summary</h3>
                            <div className="glass" style={{ padding: '20px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Type</span>
                                <span style={{ fontWeight: 600 }}>{selectedFirm.source === 'ch' ? selectedFirm.details?.type?.replace('-', ' ').toUpperCase() : selectedFirm.details?.['Business Type']}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                <span style={{ fontWeight: 600, color: '#22c55e' }}>{selectedFirm.source === 'ch' ? selectedFirm.details?.company_status?.toUpperCase() : selectedFirm.details?.Status}</span>
                              </div>
                              {selectedFirm.source === 'ch' && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Incorporated</span>
                                    <span style={{ fontWeight: 600 }}>{new Date(selectedFirm.details?.date_of_creation).toLocaleDateString()}</span>
                                  </div>
                                  {selectedFirm.details?.sic_codes && (
                                    <div style={{ marginTop: '8px' }}>
                                      <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nature of Business (SIC)</span>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {selectedFirm.details.sic_codes.map((sic: string) => (
                                          <span key={sic} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{sic}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                              {selectedFirm.source === 'fca' && selectedFirm.details?.['Client Money Permission'] && (
                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Client Money Permission</span>
                                  <span style={{ fontWeight: 600 }}>{selectedFirm.details['Client Money Permission']}</span>
                                </div>
                              )}
                            </div>
                          </section>
                        </div>
                      </div>
                    )}

                    {activeTab === 'filing' && selectedFirm.source === 'ch' && (
                      <section>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Filing History</h3>
                        <div className="glass" style={{ overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)' }}>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedFirm.filing_history?.length > 0 ? selectedFirm.filing_history.map((item: any, i: number) => (
                                <tr key={i} style={{ borderBottom: i === selectedFirm.filing_history.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{new Date(item.date).toLocaleDateString()}</td>
                                  <td style={{ padding: '12px 16px' }}><span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{item.type}</span></td>
                                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{item.description_blob || item.description?.replace(/_/g, ' ')}</td>
                                </tr>
                              )) : (
                                <tr><td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No filing history available</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    )}

                    {activeTab === 'permissions' && selectedFirm.source === 'fca' && (
                      <section>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Current Permissions ({selectedFirm.permissions?.length || 0})</h3>
                        <div className="glass" style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                          {selectedFirm.permissions?.length > 0 ? selectedFirm.permissions.map((perm: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', marginBottom: '12px', borderBottom: i === selectedFirm.permissions.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                              <Shield size={16} color="var(--accent-primary)" style={{ marginTop: '2px' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>{perm.Permission || perm['Permission Name']}</div>
                                {perm.Status && <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{perm.Status}</div>}
                                {perm.Details && Array.isArray(perm.Details) && (
                                  <div style={{ marginTop: '8px', paddingLeft: '8px', borderLeft: '2px solid var(--accent-primary)20', fontSize: '12px' }}>
                                    {perm.Details.map((detail: any, j: number) => (
                                      <div key={j} style={{ marginBottom: j === perm.Details.length - 1 ? 0 : '8px' }}>
                                        {Object.entries(detail).map(([key, val]: [string, any]) => (
                                          <div key={key}>
                                            <span style={{ color: 'var(--text-muted)' }}>{key}:</span> {Array.isArray(val) ? val.join(', ') : val}
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )) : <div style={{ color: 'var(--text-muted)' }}>No specific permissions listed</div>}
                        </div>
                      </section>
                    )}

                    {activeTab === 'people' && (
                      <div className="space-y-6">
                        <section>
                          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {selectedFirm.source === 'ch' ? 'Officers' : 'Key Contacts'} ({selectedFirm.individuals?.length || 0})
                          </h3>
                          <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'var(--glass-border)' }}>
                              {selectedFirm.individuals?.length > 0 ? selectedFirm.individuals.map((ind: any, i: number) => (
                                <div key={i} style={{ background: 'var(--bg-card)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ background: 'var(--accent-secondary)20', padding: '10px', borderRadius: '12px' }}><User size={20} color="var(--accent-secondary)" /></div>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{ind.Name || ind.name || ind['Individual Name']}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{ind.Status || ind.officer_role || 'Active'}</div>
                                    {ind.appointed_on && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Appointed: {new Date(ind.appointed_on).toLocaleDateString()}</div>}
                                  </div>
                                </div>
                              )) : <div style={{ background: 'var(--bg-card)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No individuals listed</div>}
                            </div>
                          </div>
                        </section>

                        {selectedFirm.source === 'ch' && (
                          <section>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: '#ff9f43', textTransform: 'uppercase', marginBottom: '12px' }}>Persons with Significant Control</h3>
                            <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'var(--glass-border)' }}>
                                {selectedFirm.psc?.length > 0 ? selectedFirm.psc.map((p: any, i: number) => (
                                  <div key={i} style={{ background: 'var(--bg-card)', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ background: 'rgba(255, 159, 67, 0.1)', padding: '10px', borderRadius: '12px' }}><Users size={20} color="#ff9f43" /></div>
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.4' }}>{p.natures_of_control?.join(', ')?.replace(/-/g, ' ')}</div>
                                    </div>
                                  </div>
                                )) : <div style={{ background: 'var(--bg-card)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No PSC data available</div>}
                              </div>
                            </div>
                          </section>
                        )}
                      </div>
                    )}

                    {activeTab === 'more' && (
                      <div className="space-y-6">
                        {selectedFirm.source === 'fca' ? (
                          <>
                            {/* Trading Names */}
                            <section>
                              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Trading Names</h3>
                              <div className="glass" style={{ padding: '16px' }}>
                                {selectedFirm.names?.length > 0 ? (
                                  selectedFirm.names.map((name: any, i: number) => {
                                    const tradingName = name.Name || name['Trading Name'];
                                    return tradingName ? (
                                      <div key={i} style={{ marginBottom: i === selectedFirm.names.length - 1 ? 0 : '8px' }}>
                                        • {tradingName}
                                      </div>
                                    ) : null;
                                  })
                                ) : (
                                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '8px' }}>
                                    No trading names registered
                                  </div>
                                )}
                              </div>
                            </section>

                            {/* Regulators */}
                            {selectedFirm.regulators?.length > 0 && (
                              <section>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Regulators</h3>
                                <div className="glass" style={{ padding: '16px' }}>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {selectedFirm.regulators.map((reg: any, i: number) => (
                                      <span key={i} style={{
                                        background: 'rgba(0, 210, 255, 0.1)',
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 600
                                      }}>
                                        {reg['Regulator Name'] || reg.Regulator || reg.Name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* Requirements */}
                            {selectedFirm.requirements?.filter((req: any) => req.Requirement || req.Description || req['Requirement Type']).length > 0 && (
                              <section>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Requirements ({selectedFirm.requirements.filter((req: any) => req.Requirement || req.Description || req['Requirement Type']).length})</h3>
                                <div className="glass" style={{ padding: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                                  {selectedFirm.requirements.filter((req: any) => req.Requirement || req.Description || req['Requirement Type']).map((req: any, i: number) => (
                                    <div key={i} style={{ marginBottom: i === selectedFirm.requirements.length - 1 ? 0 : '10px', fontSize: '14px' }}>
                                      • {req.Requirement || req['Requirement Type'] || req.Description}
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            {/* Disciplinary History */}
                            {selectedFirm.disciplinary?.length > 0 && (
                              <section>
                                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: '#ef4444', textTransform: 'uppercase', marginBottom: '12px' }}>⚠️ Disciplinary History ({selectedFirm.disciplinary.length})</h3>
                                <div className="glass" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)' }}>
                                  {selectedFirm.disciplinary.map((disc: any, i: number) => (
                                    <div key={i} style={{ marginBottom: i === selectedFirm.disciplinary.length - 1 ? 0 : '12px', paddingBottom: i === selectedFirm.disciplinary.length - 1 ? 0 : '12px', borderBottom: i === selectedFirm.disciplinary.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#ef4444' }}>{disc.Type || 'Disciplinary Action'}</div>
                                      <div style={{ fontSize: '13px', marginTop: '4px' }}>{disc.Description || disc.Details}</div>
                                      {disc.Date && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{disc.Date}</div>}
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}
                          </>
                        ) : (
                          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                            <Activity size={48} color="var(--accent-primary)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <h4 style={{ marginBottom: '12px' }}>Additional Intelligence</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                              Extended company data including charges, insolvency details, and mortgage information can be added here once the advanced API scopes are connected.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '24px' }}
                  >
                    Close Dossier
                  </button>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
