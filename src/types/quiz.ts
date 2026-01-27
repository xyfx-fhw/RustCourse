// 测验相关类型定义
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-answer'
  | 'true-false'
  | 'code-completion';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // 选项(用于选择题)
  correctAnswer: string | number | number[]; // 正确答案
  explanation: string; // 答案解析
  points: number; // 分值
  code?: string; // 代码(用于代码填空题)
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number; // 及格分数(百分比)
  timeLimit?: number; // 时间限制(秒), 可选
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  attemptedAt: Date;
  completedAt?: Date;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  timeSpent?: number; // 用时(秒)
}
