// 课程相关类型定义
export interface CourseFrontmatter {
  title: string;
  description: string;
  duration?: number; // 预计学习时长(分钟)
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  hasQuiz?: boolean;
  hasExercise?: boolean;
  order?: number; // 课程顺序
  hasPlayground?: boolean; // 是否显示代码编辑器
  defaultCode?: string; // 默认代码
}

export interface CourseMetadata extends CourseFrontmatter {
  slug: string; // URL slug
  chapter: string; // 章节ID (如 "01-rust-basics")
  chapterTitle: string; // 章节标题
  lesson: string; // 课程ID (如 "01-installation")
  url: string; // 完整URL路径
}

export interface Chapter {
  id: string; // 章节ID
  title: string; // 章节标题
  folder: string; // 文件夹名称
  lessons: CourseMetadata[];
}

export interface CourseStructure {
  id: string;
  title: string;
  description: string;
  icon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  chapters: Chapter[];
  certificate?: {
    enabled: boolean;
    requiredCompletion: number; // 完成百分比要求
  };
}

// 标题(Heading)类型，用于生成目录
export interface Heading {
  depth: number; // 1-6 (h1-h6)
  text: string;
  slug: string; // 用于锚点链接
}
