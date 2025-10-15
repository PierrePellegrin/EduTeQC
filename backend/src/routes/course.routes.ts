import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all published courses
router.get('/', async (req, res, next) => {
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
});

// Get course by ID
router.get('/:id', async (req, res, next) => {
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
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    next(error);
  }
});

// Get courses by category
router.get('/category/:category', async (req, res, next) => {
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
});

export default router;
