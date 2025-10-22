import { Request, Response, NextFunction } from 'express';
import { sectionService } from '../services/section.service';

export class SectionController {
  // GET /api/courses/:courseId/sections
  async getCourseSections(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { rootOnly } = req.query;

      let sections;
      if (rootOnly === 'true') {
        sections = await sectionService.getRootSections(courseId);
      } else {
        sections = await sectionService.getCourseSections(courseId);
      }

      res.json({ sections });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sections/:sectionId
  async getSectionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const section = await sectionService.getSectionById(sectionId);

      res.json({ section });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sections/:sectionId/breadcrumb
  async getSectionBreadcrumb(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const breadcrumb = await sectionService.getSectionBreadcrumb(sectionId);

      res.json({ breadcrumb });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sections/:sectionId/next
  async getNextSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const nextSection = await sectionService.getNextSection(sectionId);

      res.json({ nextSection });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/sections/:sectionId/previous
  async getPreviousSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const previousSection = await sectionService.getPreviousSection(sectionId);

      res.json({ previousSection });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/courses/:courseId/sections
  async createSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const { parentId, title, content, order } = req.body;

      const section = await sectionService.createSection({
        courseId,
        parentId,
        title,
        content,
        order,
      });

      res.status(201).json({ section });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/sections/:sectionId
  async updateSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const { title, content, order } = req.body;

      const section = await sectionService.updateSection(sectionId, {
        title,
        content,
        order,
      });

      res.json({ section });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/sections/:sectionId/move
  async moveSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const { parentId, order } = req.body;

      const section = await sectionService.moveSection(sectionId, {
        parentId,
        order,
      });

      res.json({ section });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/sections/reorder
  async reorderSections(req: Request, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;

      const sections = await sectionService.reorderSections(updates);

      res.json({ sections });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/sections/:sectionId
  async deleteSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { sectionId } = req.params;
      const result = await sectionService.deleteSection(sectionId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const sectionController = new SectionController();
