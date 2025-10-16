import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export class PackageController {
  // Get all packages (admin)
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const packages = await prisma.package.findMany({
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  imageUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              userPackages: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      res.json({ packages });
    } catch (error) {
      next(error);
    }
  }

  // Create package (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseIds, name, description, price, imageUrl, isActive } = req.body;

      const packageData: any = {
        name,
        description,
        price,
        imageUrl,
        isActive: isActive ?? true,
      };

      if (courseIds && courseIds.length > 0) {
        packageData.courses = {
          create: courseIds.map((courseId: string) => ({ courseId })),
        };
      }

      const pkg = await prisma.package.create({
        data: packageData,
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      res.status(201).json({ package: pkg });
    } catch (error) {
      next(error);
    }
  }

  // Update package (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseIds, name, description, price, imageUrl, isActive } = req.body;

      // Update package basic info
      const pkg = await prisma.package.update({
        where: { id: req.params.id },
        data: {
          name,
          description,
          price,
          imageUrl,
          isActive,
        },
      });

      // Update courses if provided
      if (courseIds !== undefined) {
        // Remove all existing courses
        await prisma.packageCourse.deleteMany({
          where: { packageId: req.params.id },
        });

        // Add new courses
        if (courseIds.length > 0) {
          await prisma.packageCourse.createMany({
            data: courseIds.map((courseId: string) => ({
              packageId: req.params.id,
              courseId,
            })),
          });
        }
      }

      // Fetch updated package with courses
      const updatedPkg = await prisma.package.findUnique({
        where: { id: req.params.id },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      res.json({ package: updatedPkg });
    } catch (error) {
      next(error);
    }
  }

  // Delete package (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.package.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get user's purchased packages
  static async getUserPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

      const userPackages = await prisma.userPackage.findMany({
        where: { userId },
        include: {
          package: {
            include: {
              courses: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      category: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      res.json(userPackages);
    } catch (error) {
      next(error);
    }
  }

  // Buy package
  static async buyPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { packageId } = req.body;

      // Check if already purchased
      const existing = await prisma.userPackage.findFirst({
        where: { userId, packageId },
      });

      if (existing) {
        return res.status(400).json({ message: 'Package already purchased' });
      }

      const userPackage = await prisma.userPackage.create({
        data: { userId, packageId },
        include: {
          package: {
            include: {
              courses: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json(userPackage);
    } catch (error) {
      next(error);
    }
  }
}
