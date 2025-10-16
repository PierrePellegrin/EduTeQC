import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { CourseController } from '../controllers/course.controller';
import { TestController } from '../controllers/test.controller';
import { QuestionController } from '../controllers/question.controller';
import { PackageController } from '../controllers/package.controller';
import { AdminController } from '../controllers/admin.controller';
import {
  courseSchema,
  testSchema,
  questionSchema,
  packageSchema,
} from '../validators/schemas';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('ADMIN'));

// ========== COURSES ==========
router.get('/courses', CourseController.getAllAdmin);
router.post('/courses', validate(courseSchema), CourseController.create);
router.put('/courses/:id', validate(courseSchema.partial()), CourseController.update);
router.delete('/courses/:id', CourseController.delete);

// ========== TESTS ==========
router.get('/tests', TestController.getAllAdmin);
router.post('/tests', validate(testSchema), TestController.create);
router.put('/tests/:id', validate(testSchema.partial()), TestController.update);
router.delete('/tests/:id', TestController.delete);

// ========== QUESTIONS ==========
router.post('/questions', validate(questionSchema), QuestionController.create);
router.put('/questions/:id', validate(questionSchema.partial()), QuestionController.update);
router.delete('/questions/:id', QuestionController.delete);

// ========== STATISTICS ==========
router.get('/stats', AdminController.getStats);

// ========== PACKAGES ==========
router.get('/packages', PackageController.getAllAdmin);
router.post('/packages', validate(packageSchema), PackageController.create);
router.put('/packages/:id', validate(packageSchema.partial()), PackageController.update);
router.delete('/packages/:id', PackageController.delete);

export default router;
