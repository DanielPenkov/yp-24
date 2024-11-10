import React from 'react';

type TabType = 'goals' | 'profile';

interface TabsProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="mb-8 flex justify-center">
            <button
                onClick={() => setActiveTab('goals')}
                className={`px-4 py-2 mx-2 rounded-lg ${activeTab === 'goals' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                Goal Settings
            </button>
            <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 mx-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                Profile Settings
            </button>
        </div>
    );
};

export default Tabs;