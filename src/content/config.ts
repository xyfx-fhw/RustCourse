import { defineCollection, z } from 'astro:content';

// 定义课程集合的 schema
const coursesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    duration: z.number().optional(), // 预计学习时长(分钟)
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tags: z.array(z.string()).optional(),
    hasQuiz: z.boolean().optional(),
    hasExercise: z.boolean().optional(),
    order: z.number().optional(),
    hasPlayground: z.boolean().optional(), // 是否显示代码编辑器
    defaultCode: z.string().optional(), // 默认代码
  }),
});

// 导出集合
export const collections = {
  courses: coursesCollection,
};
