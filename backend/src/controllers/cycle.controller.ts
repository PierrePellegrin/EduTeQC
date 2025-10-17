import { Request, Response, NextFunction } from 'express';
import { CycleService, NiveauService } from '../services/cycle.service';

export class CycleController {
  static async getAllCycles(req: Request, res: Response, next: NextFunction) {
    try {
      const cycles = await CycleService.getAll();
      res.json({ cycles });
    } catch (error) {
      next(error);
    }
  }

  static async getCycleById(req: Request, res: Response, next: NextFunction) {
    try {
      const cycle = await CycleService.getById(req.params.id);
      if (!cycle) {
        return res.status(404).json({ error: 'Cycle non trouvé' });
      }
      res.json({ cycle });
    } catch (error) {
      next(error);
    }
  }

  static async getAllNiveaux(req: Request, res: Response, next: NextFunction) {
    try {
      const niveaux = await NiveauService.getAll();
      res.json({ niveaux });
    } catch (error) {
      next(error);
    }
  }

  static async getNiveauById(req: Request, res: Response, next: NextFunction) {
    try {
      const niveau = await NiveauService.getById(req.params.id);
      if (!niveau) {
        return res.status(404).json({ error: 'Niveau non trouvé' });
      }
      res.json({ niveau });
    } catch (error) {
      next(error);
    }
  }

  static async getNiveauxByCycle(req: Request, res: Response, next: NextFunction) {
    try {
      const niveaux = await NiveauService.getByCycle(req.params.cycleId);
      res.json({ niveaux });
    } catch (error) {
      next(error);
    }
  }
}
