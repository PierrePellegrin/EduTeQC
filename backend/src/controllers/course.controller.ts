import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';

export class CourseController {
  // Get all published courses (public)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          imageUrl: true,
          order: true,
        },
      });

      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // Get course by ID (public)
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: {
          tests: {
            where: { isPublished: true },
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
              passingScore: true,
            },
          },
        },
      });

      if (!course || !course.isPublished) {
        throw new AppError(404, 'Course not found');
      }

      res.json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Get courses by category (public)
  static async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await prisma.course.findMany({
        where: {
          category: req.params.category,
          isPublished: true,
        },
        orderBy: { order: 'asc' },
      });

      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // ========== ADMIN METHODS ==========

  // Get all courses including unpublished (admin)
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await prisma.course.findMany({
        orderBy: { order: 'asc' },
        include: {
          tests: {
            select: {
              id: true,
              title: true,
              isPublished: true,
            },
          },
        },
      });

      res.json({ courses });
    } catch (error) {
      next(error);
    }
  }

  // Create course (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await prisma.course.create({
        data: req.body,
      });

      res.status(201).json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Update course (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await prisma.course.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({ course });
    } catch (error) {
      next(error);
    }
  }

  // Delete course (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.course.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
