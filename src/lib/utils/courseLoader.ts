import type { CourseMetadata, Chapter, Lesson, Subsection, Heading } from '@/types/course';

/**
 * 从文件路径提取章节、课程和小节信息
 * 支持2级: "01-rust-basics/02-hello-world" => { chapter: "01-rust-basics", lesson: "02-hello-world" }
 * 支持3级: "01-rust-basics/01-installation/01-linux" => { chapter: "01-rust-basics", lesson: "01-installation", subsection: "01-linux" }
 */
export function parseSlug(slug: string): { chapter: string; lesson: string; subsection?: string } {
  const parts = slug.split('/');
  if (parts.length === 2) {
    // 2级结构: chapter/lesson
    return {
      chapter: parts[0],
      lesson: parts[1],
    };
  } else if (parts.length === 3) {
    // 3级结构: chapter/lesson/subsection
    return {
      chapter: parts[0],
      lesson: parts[1],
      subsection: parts[2],
    };
  } else {
    throw new Error(`Invalid slug format: ${slug}. Expected: "chapter/lesson" or "chapter/lesson/subsection"`);
  }
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
 * 从文件名提取小节序号和标题
 * 例如: "01-linux.md" => { order: 1, title: "Linux" }
 */
export function parseSubsectionName(fileName: string): { order: number; title: string } {
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
 * 支持2级和3级结构
 */
export function buildLessonUrl(chapter: string, lesson: string, subsection?: string): string {
  if (subsection) {
    return `/courses/${chapter}/${lesson}/${subsection}`;
  }
  return `/courses/${chapter}/${lesson}`;
}

/**
 * 按章节分组课程列表，支持3级结构
 * 自动识别是否有小节（通过slug的层级判断）
 */
export function groupByChapter(allCourses: CourseMetadata[]): Chapter[] {
  const chapters = new Map<string, Chapter>();

  // 第一步：按章节分组
  for (const course of allCourses) {
    const { chapter, chapterTitle } = course;

    if (!chapters.has(chapter)) {
      const { order } = parseChapterName(chapter);
      chapters.set(chapter, {
        id: chapter,
        title: chapterTitle,
        folder: chapter,
        lessons: [],
      });
    }
  }

  // 第二步：按课程和小节分组
  for (const course of allCourses) {
    const { chapter, lesson, subsection } = course;
    const chapterObj = chapters.get(chapter)!;

    // 查找或创建课程
    let lessonObj = chapterObj.lessons.find(l => l.id === lesson);
    if (!lessonObj) {
      // 先尝试从已有课程中查找 index.md 获取标题
      const indexCourse = allCourses.find(c =>
        c.chapter === chapter &&
        c.lesson === lesson &&
        c.subsection === 'index'
      );

      const { order, title } = parseLessonName(lesson);
      lessonObj = {
        id: lesson,
        title: indexCourse?.title || title, // 优先使用 index.md 的标题
        order,
        subsections: [],
      };
      chapterObj.lessons.push(lessonObj);
    }

    // 如果有小节，添加到小节列表
    if (subsection) {
      // 跳过 index.md，它不是小节而是课程概览
      if (subsection === 'index') {
        // index.md 作为课程本身的元数据
        lessonObj.metadata = course;
      } else {
        // 其他文件作为小节
        const { order, title } = parseSubsectionName(subsection);
        lessonObj.subsections.push({
          id: subsection,
          title,
          order,
          metadata: course,
        });
      }
    } else {
      // 如果没有小节，直接关联元数据
      lessonObj.metadata = course;
    }
  }

  // 第三步：排序
  const sortedChapters = Array.from(chapters.values()).sort((a, b) => {
    const orderA = parseChapterName(a.id).order;
    const orderB = parseChapterName(b.id).order;
    return orderA - orderB;
  });

  // 每个章节内的课程排序
  for (const chapter of sortedChapters) {
    chapter.lessons.sort((a, b) => a.order - b.order);

    // 每个课程内的小节排序
    for (const lesson of chapter.lessons) {
      lesson.subsections.sort((a, b) => a.order - b.order);
    }
  }

  return sortedChapters;
}

/**
 * 查找给定课程的上一课和下一课
 * 支持3级结构（小节导航）
 */
export function findAdjacentLessons(
  currentSlug: string,
  allLessons: CourseMetadata[]
): { prev: CourseMetadata | null; next: CourseMetadata | null } {
  const chapters = groupByChapter(allLessons);
  const flatLessons: CourseMetadata[] = [];

  // 扁平化所有课程和小节（跳过 index.md）
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) {
      if (lesson.subsections.length > 0) {
        // 如果有小节，先添加 index.md（如果存在）
        if (lesson.metadata) {
          flatLessons.push(lesson.metadata);
        }
        // 然后添加所有小节
        for (const subsection of lesson.subsections) {
          flatLessons.push(subsection.metadata);
        }
      } else if (lesson.metadata) {
        // 没有小节，直接添加课程
        flatLessons.push(lesson.metadata);
      }
    }
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
