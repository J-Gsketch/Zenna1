import React from 'react';
import { PhoneCall, Users, FileText, Settings } from 'lucide-react';

export type MobileNavTab = 'calls' | 'leads' | 'quote' | 'settings';

export interface MobileNavBarProps {
  activeTab?: MobileNavTab | string;
  onSelectTab?: (tab: MobileNavTab) => void;
  badgeCounts?: {
    calls?: number;
    leads?: number;
  };
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab = 'calls',
  onSelectTab,
  badgeCounts
}) => {
  const navItems: Array<{ id: MobileNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'calls', label: 'Call Log', icon: PhoneCall, badge: badgeCounts?.calls },
    { id: 'leads', label: 'Leads', icon: Users, badge: badgeCounts?.leads },
    { id: 'quote', label: 'Quick Quote', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-gray-200 bg-white/95 backdrop-blur-md pb-safe md:hidden dark:border-white/10 dark:bg-slate-900/95"
    >
      <div className="flex w-full items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab?.(item.id)}
              className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-amber-600 font-semibold dark:text-amber-400' 
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight mt-1 ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-6 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
