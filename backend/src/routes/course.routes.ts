import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';

const router = Router();

// Get all published courses
router.get('/', CourseController.getAll);

// Get course by ID
router.get('/:id', CourseController.getById);

// Get courses by category
router.get('/category/:category', CourseController.getByCategory);

export default router;
