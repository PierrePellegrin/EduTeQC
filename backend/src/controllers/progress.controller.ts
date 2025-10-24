import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProgressController {
  // GET /api/progress/courses/:courseId
  async getCourseProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      const progress = await progressService.getCourseProgress(userId, courseId);

      res.json({ progress });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/progress
  async getUserProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const progress = await progressService.getUserProgress(userId);

      res.json({ progress });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/progress/stats
  async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const stats = await progressService.getUserStats(userId);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/progress/courses/:courseId/sections
  async getCourseSectionProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      const sectionProgress = await progressService.getCourseSectionProgress(userId, courseId);

      res.json({ sections: sectionProgress });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/progress/sections/:sectionId/visit
  async markSectionVisited(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const { visited = true } = req.body; // Permet de passer visited: true ou false
      const userId = req.user!.id;

      const sectionProgress = await progressService.toggleSectionVisited(userId, sectionId, visited);

      res.json({ sectionProgress });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/progress/courses/:courseId
  async resetCourseProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      const result = await progressService.resetCourseProgress(userId, courseId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const progressController = new ProgressController();
