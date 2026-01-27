import type { CourseMetadata, Chapter, Heading } from '@/types/course';

/**
 * 从文件路径提取章节和课程信息
 * 例如: "01-rust-basics/02-hello-world" => { chapter: "01-rust-basics", lesson: "02-hello-world" }
 */
export function parseSlug(slug: string): { chapter: string; lesson: string } {
  const parts = slug.split('/');
  if (parts.length !== 2) {
    throw new Error(`Invalid slug format: ${slug}. Expected: "chapter/lesson"`);
  }
  return {
    chapter: parts[0],
    lesson: parts[1],
  };
}

/**
 * 章节中文名称映射
 */
const CHAPTER_NAMES: Record<string, string> = {
  '01-rust-basics': 'Rust 基础',
  '02-ownership': '所有权系统',
  '03-structs': '结构体',
  '04-enums': '枚举与模式匹配',
  '05-packages': '包和模块',
  // 添加更多章节映射...
};

/**
 * 从文件夹名提取章节序号和标题
 * 例如: "01-rust-basics" => { order: 1, title: "Rust 基础" }
 */
export function parseChapterName(folderName: string): { order: number; title: string } {
  const match = folderName.match(/^(\d+)-(.+)$/);
  if (!match) {
    return { order: 0, title: folderName };
  }
  const [, orderStr, titleSlug] = match;

  // 优先使用中文映射，否则使用英文自动转换
  const title = CHAPTER_NAMES[folderName] || titleSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    order: parseInt(orderStr, 10),
    title,
  };
}

/**
 * 从文件名提取课程序号和标题
 * 例如: "01-installation.md" => { order: 1, title: "Installation" }
 */
export function parseLessonName(fileName: string): { order: number; title: string } {
  const nameWithoutExt = fileName.replace(/\.(md|mdx)$/, '');
  const match = nameWithoutExt.match(/^(\d+)-(.+)$/);
  if (!match) {
    return { order: 0, title: nameWithoutExt };
  }
  const [, orderStr, titleSlug] = match;
  const title = titleSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    order: parseInt(orderStr, 10),
    title,
  };
}

/**
 * 构建课程URL
 */
export function buildLessonUrl(chapter: string, lesson: string): string {
  return `/courses/${chapter}/${lesson}`;
}

/**
 * 按章节分组课程列表
 */
export function groupByChapter(lessons: CourseMetadata[]): Chapter[] {
  const chapters = new Map<string, Chapter>();

  for (const lesson of lessons) {
    const { chapter, chapterTitle } = lesson;

    if (!chapters.has(chapter)) {
      const { order } = parseChapterName(chapter);
      chapters.set(chapter, {
        id: chapter,
        title: chapterTitle,
        folder: chapter,
        lessons: [],
      });
    }

    chapters.get(chapter)!.lessons.push(lesson);
  }

  // 按章节序号排序
  const sortedChapters = Array.from(chapters.values()).sort((a, b) => {
    const orderA = parseChapterName(a.id).order;
    const orderB = parseChapterName(b.id).order;
    return orderA - orderB;
  });

  // 每个章节内的课程也排序
  for (const chapter of sortedChapters) {
    chapter.lessons.sort((a, b) => {
      const orderA = parseLessonName(a.lesson).order;
      const orderB = parseLessonName(b.lesson).order;
      return orderA - orderB;
    });
  }

  return sortedChapters;
}

/**
 * 查找给定课程的上一课和下一课
 */
export function findAdjacentLessons(
  currentSlug: string,
  allLessons: CourseMetadata[]
): { prev: CourseMetadata | null; next: CourseMetadata | null } {
  const chapters = groupByChapter(allLessons);
  const flatLessons: CourseMetadata[] = [];

  for (const chapter of chapters) {
    flatLessons.push(...chapter.lessons);
  }

  const currentIndex = flatLessons.findIndex(lesson => lesson.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? flatLessons[currentIndex - 1] : null,
    next: currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null,
  };
}

/**
 * 从 Markdown 内容提取标题列表(用于生成目录)
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [, hashes, text] = match;
    const depth = hashes.length;
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({
      depth,
      text: text.trim(),
      slug,
    });
  }

  return headings;
}

/**
 * 格式化持续时间(分钟)为可读格式
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} 小时`;
  }
  return `${hours} 小时 ${mins} 分钟`;
}

/**
 * 格式化难度等级
 */
export function formatDifficulty(difficulty?: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };
  return difficulty ? map[difficulty] || difficulty : '未分类';
}
