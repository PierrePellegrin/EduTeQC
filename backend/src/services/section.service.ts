import { prisma } from '../lib/prisma';

export class SectionService {
  // Récupérer toutes les sections d'un cours avec leur hiérarchie
  async getCourseSections(courseId: string) {
    const sections = await prisma.courseSection.findMany({
      where: { courseId },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true, // 3 niveaux de profondeur
              },
            },
          },
        },
        tests: {
          where: { isPublished: true },
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return sections;
  }

  // Récupérer une section par son ID avec tous ses détails
  async getSectionById(sectionId: string) {
    const section = await prisma.courseSection.findUnique({
      where: { id: sectionId },
      include: {
        course: true,
        parent: true,
        children: {
          orderBy: { order: 'asc' },
        },
        tests: {
          where: { isPublished: true },
          include: {
            questions: {
              include: {
                options: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!section) {
      throw new Error('Section non trouvée');
    }

    return section;
  }

  // Récupérer l'arborescence complète (sections racines uniquement)
  async getRootSections(courseId: string) {
    const rootSections = await prisma.courseSection.findMany({
      where: {
        courseId,
        parentId: null, // Seulement les sections racines
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        tests: {
          where: { isPublished: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return rootSections;
  }

  // Créer une nouvelle section
  async createSection(data: {
    courseId: string;
    parentId?: string;
    title: string;
    content?: string;
    order?: number;
  }) {
    // Si l'ordre n'est pas spécifié, mettre la section à la fin
    let order = data.order;
    if (order === undefined) {
      const lastSection = await prisma.courseSection.findFirst({
        where: {
          courseId: data.courseId,
          parentId: data.parentId || null,
        },
        orderBy: { order: 'desc' },
      });
      order = lastSection ? lastSection.order + 1 : 0;
    }

    const section = await prisma.courseSection.create({
      data: {
        courseId: data.courseId,
        parentId: data.parentId || null,
        title: data.title,
        content: data.content,
        order,
      },
      include: {
        course: true,
        parent: true,
        children: true,
      },
    });

    return section;
  }

  // Mettre à jour une section
  async updateSection(
    sectionId: string,
    data: {
      title?: string;
      content?: string;
      order?: number;
    }
  ) {
    const section = await prisma.courseSection.update({
      where: { id: sectionId },
      data,
      include: {
        course: true,
        parent: true,
        children: true,
      },
    });

    return section;
  }

  // Déplacer une section (changer son parent et/ou son ordre)
  async moveSection(
    sectionId: string,
    data: {
      parentId?: string | null;
      order?: number;
    }
  ) {
    const section = await prisma.courseSection.update({
      where: { id: sectionId },
      data: {
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        order: data.order !== undefined ? data.order : undefined,
      },
      include: {
        course: true,
        parent: true,
        children: true,
      },
    });

    return section;
  }

  // Supprimer une section (et toutes ses sous-sections)
  async deleteSection(sectionId: string) {
    // Prisma s'occupe de la suppression en cascade grâce au onDelete: Cascade
    await prisma.courseSection.delete({
      where: { id: sectionId },
    });

    return { message: 'Section supprimée avec succès' };
  }

  // Réorganiser les sections (batch update)
  async reorderSections(
    updates: Array<{
      id: string;
      order: number;
      parentId?: string | null;
    }>
  ) {
    // Utiliser une transaction pour garantir la cohérence
    const results = await prisma.$transaction(
      updates.map((update) =>
        prisma.courseSection.update({
          where: { id: update.id },
          data: {
            order: update.order,
            parentId: update.parentId !== undefined ? update.parentId : undefined,
          },
        })
      )
    );

    return results;
  }

  // Récupérer le fil d'Ariane (breadcrumb) d'une section
  async getSectionBreadcrumb(sectionId: string) {
    const breadcrumb: Array<{ id: string; title: string }> = [];
    let currentSection = await prisma.courseSection.findUnique({
      where: { id: sectionId },
      include: { parent: true },
    });

    while (currentSection) {
      breadcrumb.unshift({
        id: currentSection.id,
        title: currentSection.title,
      });

      if (currentSection.parentId) {
        currentSection = await prisma.courseSection.findUnique({
          where: { id: currentSection.parentId },
          include: { parent: true },
        });
      } else {
        currentSection = null;
      }
    }

    return breadcrumb;
  }

  // Récupérer la section suivante (pour la navigation)
  async getNextSection(currentSectionId: string): Promise<any> {
    const currentSection = await prisma.courseSection.findUnique({
      where: { id: currentSectionId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: {
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!currentSection) {
      throw new Error('Section non trouvée');
    }

    // 1. Si la section a des enfants, retourner le premier enfant
    if (currentSection.children.length > 0) {
      return currentSection.children[0];
    }

    // 2. Sinon, chercher le prochain frère (sibling)
    if (currentSection.parent) {
      const siblings = currentSection.parent.children;
      const currentIndex = siblings.findIndex((s) => s.id === currentSectionId);
      if (currentIndex < siblings.length - 1) {
        return siblings[currentIndex + 1];
      }

      // 3. Si pas de prochain frère, remonter au parent et chercher son prochain frère
      return this.getNextSection(currentSection.parentId!);
    }

    // 4. Si pas de parent, chercher le prochain frère racine
    const rootSiblings = await prisma.courseSection.findMany({
      where: {
        courseId: currentSection.courseId,
        parentId: null,
      },
      orderBy: { order: 'asc' },
    });

    const currentIndex = rootSiblings.findIndex((s) => s.id === currentSectionId);
    if (currentIndex < rootSiblings.length - 1) {
      return rootSiblings[currentIndex + 1];
    }

    // Pas de section suivante
    return null;
  }

  // Récupérer la section précédente (pour la navigation)
  async getPreviousSection(currentSectionId: string) {
    const currentSection = await prisma.courseSection.findUnique({
      where: { id: currentSectionId },
      include: {
        parent: {
          include: {
            children: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!currentSection) {
      throw new Error('Section non trouvée');
    }

    // 1. Chercher le frère précédent
    if (currentSection.parent) {
      const siblings = currentSection.parent.children;
      const currentIndex = siblings.findIndex((s) => s.id === currentSectionId);
      if (currentIndex > 0) {
        // Retourner le dernier descendant du frère précédent
        return this.getLastDescendant(siblings[currentIndex - 1].id);
      }

      // 2. Si pas de frère précédent, retourner le parent
      return currentSection.parent;
    }

    // 3. Si pas de parent, chercher le frère racine précédent
    const rootSiblings = await prisma.courseSection.findMany({
      where: {
        courseId: currentSection.courseId,
        parentId: null,
      },
      orderBy: { order: 'asc' },
    });

    const currentIndex = rootSiblings.findIndex((s) => s.id === currentSectionId);
    if (currentIndex > 0) {
      return this.getLastDescendant(rootSiblings[currentIndex - 1].id);
    }

    // Pas de section précédente
    return null;
  }

  // Récupérer le dernier descendant d'une section (pour la navigation)
  private async getLastDescendant(sectionId: string): Promise<any> {
    const section = await prisma.courseSection.findUnique({
      where: { id: sectionId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!section) {
      return null;
    }

    if (section.children.length === 0) {
      return section;
    }

    // Récursion pour trouver le dernier enfant du dernier enfant
    return this.getLastDescendant(section.children[section.children.length - 1].id);
  }
}

export const sectionService = new SectionService();
