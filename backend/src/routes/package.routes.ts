import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { z } from 'zod';

const router = Router();

// Buy a package (client)
router.post('/buy', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({ packageId: z.string().uuid() });
    const { packageId } = schema.parse(req.body);
    const userId = (req as any).user.id;

    // Check if package exists and is active
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      select: { id: true, isActive: true }
    });
    if (!pkg || !pkg.isActive) {
      throw new AppError(404, 'Package not found or inactive');
    }

    // Check if user already owns the package
    const alreadyPurchased = await prisma.userPackage.findUnique({
      where: { userId_packageId: { userId, packageId } }
    });
    if (alreadyPurchased) {
      throw new AppError(400, 'Package already purchased');
    }

    // Create UserPackage
    const userPackage = await prisma.userPackage.create({
      data: { userId, packageId }
    });

    res.status(201).json({ userPackage });
  } catch (error) {
    next(error);
  }
});

// Get all packages purchased by the authenticated user
router.get('/mine', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const userPackages = await prisma.userPackage.findMany({
      where: { userId },
      include: {
        package: {
          include: {
            courses: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });
    res.json({ userPackages });
  } catch (error) {
    next(error);
  }
});

export default router;
