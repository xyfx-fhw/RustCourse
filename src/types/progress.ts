// 进度跟踪相关类型定义
export interface LessonProgress {
  lessonId: string; // 课程ID (如 "01-rust-basics/01-installation")
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // 学习时长(毫秒)
  attempts: number; // 尝试次数
  lastVisited?: Date;
}

export interface QuizProgress {
  quizId: string;
  attemptedAt: Date;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  createdAt: Date;
  lastActive: Date;
  settings: Record<string, any>;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userName: string;
  issuedAt: Date;
  score: number;
  certificateData: string; // Base64 encoded PDF
}

export interface CourseProgress {
  courseId: string;
  total: number; // 总课程数
  completed: number; // 已完成数
  percentage: number; // 完成百分比
  lessons: LessonProgress[];
}
