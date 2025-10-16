import { Request, Response, NextFunction } from 'express';
import { QuestionService } from '../services/question.service';

export class QuestionController {
  // Create question with options (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newQuestion = await QuestionService.create(req.body);
      res.status(201).json({ question: newQuestion });
    } catch (error) {
      next(error);
    }
  }

  // Update question (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await QuestionService.update(req.params.id, req.body);
      res.json({ question });
    } catch (error) {
      next(error);
    }
  }

  // Delete question (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await QuestionService.delete(req.params.id);
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
