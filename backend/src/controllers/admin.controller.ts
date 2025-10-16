import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  // Get dashboard statistics
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getStats();
      res.json({ stats });
    } catch (error) {
      next(error);
    }
  }
}
