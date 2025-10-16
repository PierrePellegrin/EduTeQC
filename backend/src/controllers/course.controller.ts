import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';
import { AppError } from '../middleware/error.middleware';

export class CourseController {
  // Get all published courses (public)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAll();
      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // Get course by ID (public)
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.getById(req.params.id);
      if (!course || !course.isPublished) {
        throw new (require('../middleware/error.middleware').AppError)(404, 'Course not found');
      }
      res.json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Get courses by category (public)
  static async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getByCategory(req.params.category);
      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // ========== ADMIN METHODS ==========

  // Get all courses including unpublished (admin)
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAllAdmin();
      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // Create course (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.create(req.body);
      res.status(201).json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Update course (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await CourseService.update(req.params.id, req.body);
      res.json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Delete course (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CourseService.delete(req.params.id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
