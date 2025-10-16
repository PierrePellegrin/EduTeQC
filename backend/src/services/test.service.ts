import { prisma } from '../lib/prisma';

export class TestService {
  static async getAllUserResults(userId: string) {
    return prisma.testResult.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        test: true,
      },
    });
  }
  static async getTestWithQuestions(testId: string, includeCorrect: boolean = false) {
    return prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                text: true,
                order: true,
                ...(includeCorrect ? { isCorrect: true } : {}),
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async calculateScore(test: any, answers: Record<string, string[]>) {
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of test.questions) {
      totalPoints += question.points;
      const userAnswers = answers[question.id] || [];
      const correctOptions = question.options
        .filter((opt: any) => opt.isCorrect)
        .map((opt: any) => opt.id);
      const isCorrect =
        userAnswers.length === correctOptions.length &&
        userAnswers.every((ans: string) => correctOptions.includes(ans));
      if (isCorrect) {
        earnedPoints += question.points;
      }
    }
    const score = (earnedPoints / totalPoints) * 100;
    const passed = score >= test.passingScore;
    return { score, passed, totalPoints, earnedPoints };
  }

  static async saveResult({ userId, testId, score, passed, answers }: {
    userId: string;
    testId: string;
    score: number;
    passed: boolean;
    answers: Record<string, string[]>;
  }) {
    return prisma.testResult.create({
      data: { userId, testId, score, passed, answers },
    });
  }

  static async getUserResults(userId: string, testId: string) {
    return prisma.testResult.findMany({
      where: { userId, testId },
      orderBy: { id: 'desc' },
      include: {
        test: true,
      },
    });
  }
}
