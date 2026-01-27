/**
 * Tab 内容结构
 */
export interface TabContent {
  id: string;
  title: string;
  content: string;
  order: number;
}

/**
 * 从 Markdown 内容中解析 Tab 结构
 *
 * 自动识别一级标题（# 标题）作为tab分割点
 * 文档标题在 frontmatter 的 title 字段中定义
 *
 * @param content Markdown 原始内容
 * @returns Tab数组，如果只有一个或没有一级标题则返回null
 */
export function parseTabContent(content: string): TabContent[] | null {
  // 匹配一级标题: # 标题
  const h1Regex = /^#\s+(.+)$/gm;
  const matches = Array.from(content.matchAll(h1Regex));

  // 如果只有一个或没有一级标题，返回null（表示这不是一个tab文章）
  if (matches.length <= 1) {
    return null;
  }

  const tabs: TabContent[] = [];

  // 分割内容
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].trim();
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : content.length;

    const tabContent = content.slice(startIndex, endIndex).trim();

    tabs.push({
      id: `tab-${i}`,
      title,
      content: tabContent,
      order: i,
    });
  }

  return tabs;
}

/**
 * 生成tab的唯一标识符
 */
export function getTabProgressKey(slug: string): string {
  return `tab-progress-${slug}`;
}

/**
 * 从localStorage获取tab进度
 */
export function getTabProgress(slug: string) {
  if (typeof window === 'undefined') return null;

  const key = getTabProgressKey(slug);
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse tab progress:', e);
      return null;
    }
  }

  return null;
}

/**
 * 保存tab进度到localStorage
 */
export function saveTabProgress(slug: string, currentTab: number, unlockedTabs: number[]) {
  if (typeof window === 'undefined') return;

  const key = getTabProgressKey(slug);
  localStorage.setItem(key, JSON.stringify({
    currentTab,
    unlockedTabs,
    lastUpdated: Date.now(),
  }));
}
