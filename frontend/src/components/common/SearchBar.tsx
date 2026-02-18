import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    buttonText?: string;
    loading?: boolean;
}

export default function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = 'Search...',
    buttonText = 'Search',
    loading = false
}: SearchBarProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="input-glass"
                    style={{ paddingLeft: '56px' }}
                />
            </div>
            <button
                onClick={onSearch}
                className="btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                <Search size={20} />
                {buttonText}
            </button>
        </div>
    );
}
