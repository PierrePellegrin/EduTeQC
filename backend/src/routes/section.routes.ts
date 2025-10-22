import { Router } from 'express';
import { sectionController } from '../controllers/section.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques (pour les clients)
router.get('/courses/:courseId/sections', sectionController.getCourseSections.bind(sectionController));
router.get('/sections/:sectionId', sectionController.getSectionById.bind(sectionController));
router.get('/sections/:sectionId/breadcrumb', sectionController.getSectionBreadcrumb.bind(sectionController));
router.get('/sections/:sectionId/next', sectionController.getNextSection.bind(sectionController));
router.get('/sections/:sectionId/previous', sectionController.getPreviousSection.bind(sectionController));

// Routes admin (protégées)
router.post('/courses/:courseId/sections', authenticate, authorize('ADMIN'), sectionController.createSection.bind(sectionController));
router.put('/sections/:sectionId', authenticate, authorize('ADMIN'), sectionController.updateSection.bind(sectionController));
router.patch('/sections/:sectionId/move', authenticate, authorize('ADMIN'), sectionController.moveSection.bind(sectionController));
router.post('/sections/reorder', authenticate, authorize('ADMIN'), sectionController.reorderSections.bind(sectionController));
router.delete('/sections/:sectionId', authenticate, authorize('ADMIN'), sectionController.deleteSection.bind(sectionController));

export default router;
