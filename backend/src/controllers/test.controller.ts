import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class TestController {
  // Get test by ID with questions (authenticated)
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await prisma.test.findUnique({
        where: { id: req.params.id },
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
                  // Ne pas renvoyer isCorrect au client
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

      if (!test || !test.isPublished) {
        throw new AppError(404, 'Test not found');
      }

      res.json({ test });
    } catch (error) {
      next(error);
    }
  }

  // Submit test answers (authenticated)
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { answers } = req.body;
      const testId = req.params.id;
      const userId = (req as any).user.id;

      // Get test with correct answers
      const test = await prisma.test.findUnique({
        where: { id: testId },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      if (!test) {
        throw new AppError(404, 'Test not found');
      }

      // Calculate score
      let totalPoints = 0;
      let earnedPoints = 0;

      for (const question of test.questions) {
        totalPoints += question.points;

        const userAnswers = answers[question.id] || [];
        const correctOptions = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id);

        // Check if answer is correct
        const isCorrect =
          userAnswers.length === correctOptions.length &&
          userAnswers.every((ans: string) => correctOptions.includes(ans));

        if (isCorrect) {
          earnedPoints += question.points;
        }
      }

      const score = (earnedPoints / totalPoints) * 100;
      const passed = score >= test.passingScore;

      // Save result
      const result = await prisma.testResult.create({
        data: {
          userId,
          testId,
          score,
          passed,
          answers,
        },
      });

      res.json({
        result: {
          id: result.id,
          score,
          passed,
          totalPoints,
          earnedPoints,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get test results (authenticated)
  static async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const testId = req.params.id;

      const results = await prisma.testResult.findMany({
        where: {
          userId,
          testId,
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          test: {
            select: {
              title: true,
              passingScore: true,
            },
          },
        },
      });

      res.json({ results });
    } catch (error) {
      next(error);
    }
  }

  // ========== ADMIN METHODS ==========

  // Get all tests (admin)
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const tests = await prisma.test.findMany({
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          questions: {
            include: {
              options: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      res.json({ tests });
    } catch (error) {
      next(error);
    }
  }

  // Create test (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await prisma.test.create({
        data: req.body,
      });

      res.status(201).json({ test });
    } catch (error) {
      next(error);
    }
  }

  // Update test (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await prisma.test.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({ test });
    } catch (error) {
      next(error);
    }
  }

  // Delete test (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.test.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Test deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
