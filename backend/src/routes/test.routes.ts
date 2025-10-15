import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Get test by ID with questions
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const test = await prisma.test.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                text: true,
                order: true,
                // Ne pas renvoyer isCorrect au client
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!test || !test.isPublished) {
      throw new AppError(404, 'Test not found');
    }

    res.json({ test });
  } catch (error) {
    next(error);
  }
});

const submitTestSchema = z.object({
  answers: z.record(z.array(z.string())), // questionId -> optionIds[]
});

// Submit test answers
router.post('/:id/submit', authenticate, async (req, res, next) => {
  try {
    const { answers } = submitTestSchema.parse(req.body);
    const testId = req.params.id;
    const userId = (req as any).user.id;

    // Get test with correct answers
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!test) {
      throw new AppError(404, 'Test not found');
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of test.questions) {
      totalPoints += question.points;

      const userAnswers = answers[question.id] || [];
      const correctOptions = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id);

      // Check if answer is correct
      const isCorrect =
        userAnswers.length === correctOptions.length &&
        userAnswers.every((ans) => correctOptions.includes(ans));

      if (isCorrect) {
        earnedPoints += question.points;
      }
    }

    const score = (earnedPoints / totalPoints) * 100;
    const passed = score >= test.passingScore;

    // Save result
    const result = await prisma.testResult.create({
      data: {
        userId,
        testId,
        score,
        answers,
        passed,
      },
    });

    res.json({
      result: {
        id: result.id,
        score: result.score,
        passed: result.passed,
        completedAt: result.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get user's test results
router.get('/:id/results', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const testId = req.params.id;

    const results = await prisma.testResult.findMany({
      where: {
        userId,
        testId,
      },
      orderBy: { completedAt: 'desc' },
      select: {
        id: true,
        score: true,
        passed: true,
        completedAt: true,
      },
    });

    res.json({ results });
  } catch (error) {
    next(error);
  }
});

export default router;
