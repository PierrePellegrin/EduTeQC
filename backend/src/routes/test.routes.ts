import { Router } from 'express';
import { TestController } from '../controllers/test.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { submitTestSchema } from '../validators/schemas';

const router = Router();

// Get test by ID with questions
router.get('/:id', authenticate, TestController.getById);

// Submit test answers
router.post('/:id/submit', authenticate, validate(submitTestSchema), TestController.submit);

// Get user's test results
router.get('/:id/results', authenticate, TestController.getResults);

export default router;
