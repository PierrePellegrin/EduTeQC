import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export class AdminController {
  // Get dashboard statistics
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [coursesCount, testsCount, usersCount, resultsCount] = await Promise.all([
        prisma.course.count(),
        prisma.test.count(),
        prisma.user.count(),
        prisma.testResult.count(),
      ]);

      res.json({
        stats: {
          courses: coursesCount,
          tests: testsCount,
          users: usersCount,
          results: resultsCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
