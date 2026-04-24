import { defineCollection, z } from 'astro:content';

const chapters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: z.number(),
    keywords: z.array(z.string()),
  }),
});

// 测试对象的 schema
const testSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('compiles'),
    description: z.string(),
  }),
  z.object({
    type: z.literal('stdout'),
    description: z.string(),
    expected: z.string(),
  }),
]);

// 练习题 collection
const exercises = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      starterCode: z.string(),
      tests: z.array(testSchema),
      hint: z.string().optional(),
      solution: z.string().optional(),
    })
  ),
});

// 测验题 collection
const quizzes = defineCollection({
  type: 'data',
  schema: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('multiple-choice'),
        question: z.string(),
        options: z.array(z.string()),
        answer: z.number(),
        explanation: z.string(),
      }),
      z.object({
        type: z.literal('coding'),
        exerciseId: z.string(),
      }),
    ])
  ),
});

export const collections = { chapters, exercises, quizzes };
