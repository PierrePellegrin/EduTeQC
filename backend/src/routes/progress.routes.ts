import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes de progression nécessitent une authentification
router.use(authenticate);

// Routes pour la progression des cours (prefix /api/progress now in server.ts)
router.get('/', progressController.getUserProgress.bind(progressController));
router.get('/stats', progressController.getUserStats.bind(progressController));
router.get('/courses/:courseId', progressController.getCourseProgress.bind(progressController));
router.get('/courses/:courseId/sections', progressController.getCourseSectionProgress.bind(progressController));
router.delete('/courses/:courseId', progressController.resetCourseProgress.bind(progressController));

// Routes pour la progression des sections
router.post('/sections/:sectionId/visit', progressController.markSectionVisited.bind(progressController));

export default router;
