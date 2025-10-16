import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { PackageController } from '../controllers/package.controller';

const router = Router();

// Buy a package (client)
router.post('/buy', authenticate, PackageController.buyPackage);

// Get all packages purchased by the authenticated user
router.get('/mine', authenticate, PackageController.getUserPackages);

export default router;
