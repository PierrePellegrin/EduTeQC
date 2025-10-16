import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class TestController {
  // Get all test results for the authenticated user
  static async getAllResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { TestService } = require('../services/test.service');
      const userId = (req as any).user.id;
      const results = await TestService.getAllUserResults(userId);
      res.json({ results });
    } catch (error) {
      next(error);
    }
  }
  // Get test by ID with questions (authenticated)
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { TestService } = require('../services/test.service');
      const test = await TestService.getTestWithQuestions(req.params.id);
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
      const { TestService } = require('../services/test.service');
      const { answers } = req.body;
      const testId = req.params.id;
      const userId = (req as any).user.id;
      const test = await TestService.getTestWithQuestions(testId);
      if (!test) {
        throw new AppError(404, 'Test not found');
      }
      const { score, passed, totalPoints, earnedPoints } = await TestService.calculateScore(test, answers);
      const result = await TestService.saveResult({ userId, testId, score, passed, answers });
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
      const { TestService } = require('../services/test.service');
      const userId = (req as any).user.id;
      const testId = req.params.id;
      const results = await TestService.getUserResults(userId, testId);
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
