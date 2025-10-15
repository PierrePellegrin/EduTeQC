import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('ADMIN'));

// ========== COURSES ==========

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  category: z.string(),
  imageUrl: z.string().optional(),
  content: z.string(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});

// Get all courses (including unpublished)
router.get('/courses', async (req, res, next) => {
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
});

// Create course
router.post('/courses', async (req, res, next) => {
  try {
    const data = courseSchema.parse(req.body);

    const course = await prisma.course.create({
      data,
    });

    res.status(201).json({ course });
  } catch (error) {
    next(error);
  }
});

// Update course
router.put('/courses/:id', async (req, res, next) => {
  try {
    const data = courseSchema.partial().parse(req.body);

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ course });
  } catch (error) {
    next(error);
  }
});

// Delete course
router.delete('/courses/:id', async (req, res, next) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ========== TESTS ==========

const testSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  courseId: z.string(),
  duration: z.number().min(1),
  passingScore: z.number().min(0).max(100),
  isPublished: z.boolean().optional(),
});

// Get all tests
router.get('/tests', async (req, res, next) => {
  try {
    const tests = await prisma.test.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    res.json({ tests });
  } catch (error) {
    next(error);
  }
});

// Create test
router.post('/tests', async (req, res, next) => {
  try {
    const data = testSchema.parse(req.body);

    const test = await prisma.test.create({
      data,
    });

    res.status(201).json({ test });
  } catch (error) {
    next(error);
  }
});

// Update test
router.put('/tests/:id', async (req, res, next) => {
  try {
    const data = testSchema.partial().parse(req.body);

    const test = await prisma.test.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ test });
  } catch (error) {
    next(error);
  }
});

// Delete test
router.delete('/tests/:id', async (req, res, next) => {
  try {
    await prisma.test.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ========== QUESTIONS ==========

const questionSchema = z.object({
  testId: z.string(),
  question: z.string().min(3),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
  points: z.number().min(1),
  order: z.number().optional(),
  options: z.array(
    z.object({
      text: z.string(),
      isCorrect: z.boolean(),
      order: z.number().optional(),
    })
  ),
});

// Create question with options
router.post('/questions', async (req, res, next) => {
  try {
    const data = questionSchema.parse(req.body);

    const question = await prisma.question.create({
      data: {
        testId: data.testId,
        question: data.question,
        type: data.type,
        points: data.points,
        order: data.order || 0,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });

    res.status(201).json({ question });
  } catch (error) {
    next(error);
  }
});

// Update question
router.put('/questions/:id', async (req, res, next) => {
  try {
    const { options, ...questionData } = req.body;

    const question = await prisma.question.update({
      where: { id: req.params.id },
      data: questionData,
      include: {
        options: true,
      },
    });

    res.json({ question });
  } catch (error) {
    next(error);
  }
});

// Delete question
router.delete('/questions/:id', async (req, res, next) => {
  try {
    await prisma.question.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ========== STATISTICS ==========

router.get('/stats', async (req, res, next) => {
  try {
    const [coursesCount, testsCount, usersCount, resultsCount] = await Promise.all([
      prisma.course.count(),
      prisma.test.count(),
      prisma.user.count(),
      prisma.testResult.count(),
    ]);

    res.json({
      stats: {
        courses: coursesCount,
        tests: testsCount,
        users: usersCount,
        results: resultsCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
