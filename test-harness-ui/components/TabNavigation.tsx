'use client';

interface Tab {
    id: string;
    label: string;
    disabled?: boolean;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="border-b border-gray-200">
            <nav className="flex gap-1 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && onTabChange(tab.id)}
                        disabled={tab.disabled}
                        className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : tab.disabled
                                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
