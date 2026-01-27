import { useState, useEffect } from 'react';

interface Tab {
  id: string;
  title: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  currentSlug: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, currentSlug, onTabChange }: TabNavigationProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);

  // 从localStorage加载当前tab和完成状态
  useEffect(() => {
    const key = `tab-progress-${currentSlug}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const progress = JSON.parse(saved);
        const savedTab = progress.currentTab || 0;
        const savedCompleted = progress.completedTabs || [];

        // 确保保存的tab索引有效
        if (savedTab >= 0 && savedTab < tabs.length) {
          setCurrentTab(savedTab);
          setCompletedTabs(savedCompleted);
          onTabChange(tabs[savedTab].id);
        }
      } catch (e) {
        console.error('Failed to load tab progress:', e);
      }
    } else {
      // 如果没有保存的进度，不自动标记完成，只设置当前 tab 为第一个
      if (tabs.length > 0) {
        setCurrentTab(0);
        setCompletedTabs([]);
      }
    }
  }, [currentSlug, tabs]);

  // 监听 progress-updated 事件，更新 completedTabs 状态
  useEffect(() => {
    const handleProgressUpdate = () => {
      const key = `tab-progress-${currentSlug}`;
      const saved = localStorage.getItem(key);

      if (saved) {
        try {
          const progress = JSON.parse(saved);
          const savedCompleted = progress.completedTabs || [];
          setCompletedTabs(savedCompleted);
        } catch (e) {
          console.error('Failed to update completed tabs:', e);
        }
      }
    };

    window.addEventListener('progress-updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('progress-updated', handleProgressUpdate);
    };
  }, [currentSlug]);

  // 监听外部的 tab-change 事件（来自导航按钮）
  useEffect(() => {
    const handleExternalTabChange = (e: CustomEvent) => {
      const tabId = e.detail.tabId;
      const tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex !== -1 && tabIndex !== currentTab) {
        setCurrentTab(tabIndex);
        // 标记当前 tab 为已完成
        markTabAsCompleted(tabIndex);
      }
    };

    window.addEventListener('tab-change', handleExternalTabChange as EventListener);
    return () => {
      window.removeEventListener('tab-change', handleExternalTabChange as EventListener);
    };
  }, [tabs, currentTab]);

  // 标记 tab 为已完成
  const markTabAsCompleted = (tabIndex: number) => {
    setCompletedTabs(prev => {
      if (!prev.includes(tabIndex)) {
        const newCompleted = [...prev, tabIndex];
        // 保存到 localStorage
        const key = `tab-progress-${currentSlug}`;
        localStorage.setItem(key, JSON.stringify({
          currentTab: tabIndex,
          completedTabs: newCompleted,
          lastUpdated: Date.now(),
        }));
        // 触发进度更新事件，让Header实时更新进度
        window.dispatchEvent(new Event('progress-updated'));
        return newCompleted;
      } else {
        // 即使 tab 已经完成，也需要更新 currentTab
        const key = `tab-progress-${currentSlug}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const progress = JSON.parse(saved);
            localStorage.setItem(key, JSON.stringify({
              ...progress,
              currentTab: tabIndex,
              lastUpdated: Date.now(),
            }));
          } catch (e) {
            console.error('Failed to update currentTab:', e);
          }
        }
        return prev;
      }
    });
  };

  // 切换tab
  const handleTabClick = (index: number) => {
    setCurrentTab(index);
    markTabAsCompleted(index);
    // saveProgress 已经在 markTabAsCompleted 中处理了，不需要重复调用

    // 直接在组件内触发事件
    const tabId = tabs[index].id;
    const event = new CustomEvent('tab-change', {
      detail: { tabId }
    });
    window.dispatchEvent(event);

    // 也调用prop回调（如果有的话）
    onTabChange(tabId);
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab, index) => {
          const isActive = index === currentTab;
          const isCompleted = completedTabs.includes(index);

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(index)}
              className={`
                relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                ${isActive
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : isCompleted
                    ? 'text-gray-700 border-b-2 border-green-400 hover:text-gray-900 hover:bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {isCompleted && (
                  <svg className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {tab.title}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
