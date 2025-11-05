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

  // Get Admin user client statistics
  static async getAdminClientStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getAdminClientStats();
      res.json({ 
        success: true,
        data: stats 
      });
    } catch (error) {
      next(error);
    }
  }

  // Clean Admin user client data (purchases, progress, test results)
  static async cleanAdminClientData(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.cleanAdminClientData();
      res.json({
        success: true,
        message: 'Admin client data cleaned successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
