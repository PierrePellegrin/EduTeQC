import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export class QuestionController {
  // Create question with options (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId, question, type, points, order, options } = req.body;

      const newQuestion = await prisma.question.create({
        data: {
          testId,
          question,
          type,
          points,
          order: order || 0,
          options: {
            create: options,
          },
        },
        include: {
          options: true,
        },
      });

      res.status(201).json({ question: newQuestion });
    } catch (error) {
      next(error);
    }
  }

  // Update question (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { options, ...questionData } = req.body;

      const question = await prisma.question.update({
        where: { id: req.params.id },
        data: questionData,
        include: {
          options: true,
        },
      });

      res.json({ question });
    } catch (error) {
      next(error);
    }
  }

  // Delete question (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.question.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
