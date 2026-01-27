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
  slug: string; // URL slug (2级: "chapter/lesson" 或 3级: "chapter/lesson/subsection")
  chapter: string; // 章节ID (如 "01-rust-basics")
  chapterTitle: string; // 章节标题
  lesson: string; // 课程ID (如 "01-installation")
  subsection?: string; // 小节ID (如 "01-linux")
  subsectionTitle?: string; // 小节标题
  url: string; // 完整URL路径
}

// 小节接口
export interface Subsection {
  id: string; // 小节ID
  title: string; // 小节标题
  order: number; // 排序
  metadata: CourseMetadata; // 小节元数据
}

// 课程接口（可能包含小节）
export interface Lesson {
  id: string; // 课程ID
  title: string; // 课程标题
  order: number; // 排序
  subsections: Subsection[]; // 小节列表（如果有）
  metadata?: CourseMetadata; // 如果没有小节，直接关联元数据
}

export interface Chapter {
  id: string; // 章节ID
  title: string; // 章节标题
  folder: string; // 文件夹名称
  lessons: Lesson[]; // 课程列表（每个课程可能包含小节）
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
