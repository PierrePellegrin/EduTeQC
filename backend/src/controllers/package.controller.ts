import { Request, Response, NextFunction } from 'express';
import { PackageService } from '../services/package.service';

export class PackageController {
  // Get all packages (admin)
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const packages = await PackageService.getAllAdmin();
      res.json({ packages });
    } catch (error) {
      next(error);
    }
  }

  // Create package (admin)
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pkg = await PackageService.create(req.body);
      res.status(201).json({ package: pkg });
    } catch (error) {
      next(error);
    }
  }

  // Update package (admin)
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPkg = await PackageService.update(req.params.id, req.body);
      res.json({ package: updatedPkg });
    } catch (error) {
      next(error);
    }
  }

  // Delete package (admin)
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PackageService.delete(req.params.id);
      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get user's purchased packages
  static async getUserPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const userPackages = await PackageService.getUserPackages(userId);
      res.json({ userPackages });
    } catch (error) {
      next(error);
    }
  }

  // Buy package
  static async buyPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { packageId } = req.body;
      try {
        const userPackage = await PackageService.buyPackage(userId, packageId);
        res.json(userPackage);
      } catch (err: any) {
        if (err.message === 'Package already purchased') {
          return res.status(400).json({ message: 'Package already purchased' });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  }
}
