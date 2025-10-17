import { Router } from 'express';
import { CycleController } from '../controllers/cycle.controller';

const router = Router();

// Routes pour les cycles
router.get('/cycles', CycleController.getAllCycles);
router.get('/cycles/:id', CycleController.getCycleById);

// Routes pour les niveaux
router.get('/niveaux', CycleController.getAllNiveaux);
router.get('/niveaux/:id', CycleController.getNiveauById);
router.get('/cycles/:cycleId/niveaux', CycleController.getNiveauxByCycle);

export default router;
