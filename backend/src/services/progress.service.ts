import { prisma } from '../lib/prisma';

// Service de gestion de la progression
export class ProgressService {
  // Récupérer la progression d'un utilisateur sur un cours
  async getCourseProgress(userId: string, courseId: string) {
    let progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Créer la progression si elle n'existe pas
    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          completionPercent: 0,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }

    // Recalculer la progression pour s'assurer qu'elle est à jour
    await this.updateCourseCompletion(userId, courseId);

    // Récupérer la progression mise à jour
    progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return progress;
  }

  // Récupérer toutes les progressions d'un utilisateur
  async getUserProgress(userId: string) {
    const progress = await prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    return progress;
  }

  // Marquer une section comme visitée ou non visitée
  async toggleSectionVisited(userId: string, sectionId: string, visited: boolean) {

    // 1. Dévalider tous les parents si visited === false
    let parentIds: string[] = [];
    if (!visited) {
      // On récupère la hiérarchie des parents
      let currentSection = await prisma.courseSection.findUnique({ where: { id: sectionId }, select: { parentId: true } });
      while (currentSection && currentSection.parentId) {
        parentIds.push(currentSection.parentId);
        currentSection = await prisma.courseSection.findUnique({ where: { id: currentSection.parentId }, select: { parentId: true } });
      }
    }

    // 2. Upsert la section cliquée
    const sectionProgress = await prisma.sectionProgress.upsert({
      where: {
        userId_sectionId: {
          userId,
          sectionId,
        },
      },
      update: {
        visited,
        visitedAt: visited ? new Date() : null,
      },
      create: {
        userId,
        sectionId,
        visited,
        visitedAt: visited ? new Date() : null,
      },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });

    // 3. Dévalider tous les parents trouvés
    if (!visited && parentIds.length > 0) {
      await prisma.sectionProgress.updateMany({
        where: {
          userId,
          sectionId: { in: parentIds },
        },
        data: {
          visited: false,
          visitedAt: null,
        },
      });
    }

    // Mettre à jour ou créer la progression du cours
    await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: sectionProgress.section.courseId,
        },
      },
      update: {
        lastSectionId: visited ? sectionId : null,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        courseId: sectionProgress.section.courseId,
        lastSectionId: visited ? sectionId : null,
        lastAccessedAt: new Date(),
        completionPercent: 0,
      },
    });

    // Recalculer le pourcentage de complétion
    await this.updateCourseCompletion(userId, sectionProgress.section.courseId);

    return sectionProgress;
  }

  // Marquer une section comme visitée (rétrocompatibilité)
  async markSectionVisited(userId: string, sectionId: string) {
    return this.toggleSectionVisited(userId, sectionId, true);
  }

  // Récupérer la progression sur toutes les sections d'un cours
  async getCourseSectionProgress(userId: string, courseId: string) {
    // Récupérer toutes les sections du cours
    const sections = await prisma.courseSection.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    });

    // Récupérer la progression de l'utilisateur sur ces sections
    const sectionProgress = await prisma.sectionProgress.findMany({
      where: {
        userId,
        sectionId: {
          in: sections.map((s) => s.id),
        },
      },
    });

    // Créer un map pour un accès rapide
    const progressMap = new Map(
      sectionProgress.map((p) => [p.sectionId, p])
    );

    // Enrichir les sections avec leur progression
    const sectionsWithProgress = sections.map((section) => ({
      ...section,
      progress: progressMap.get(section.id) || {
        visited: false,
        visitedAt: null,
      },
    }));

    return sectionsWithProgress;
  }

  // Mettre à jour le pourcentage de complétion d'un cours
  async updateCourseCompletion(userId: string, courseId: string) {
    console.log(`[updateCourseCompletion] userId: ${userId}, courseId: ${courseId}`);
    
    // Récupérer les sections exactement comme l'API /courses/:id (3 niveaux de profondeur)
    // + le champ isValidatable pour savoir lesquelles compter
    const rootSections = await prisma.courseSection.findMany({
      where: { 
        courseId,
        parentId: null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        parentId: true,
        isValidatable: true,
        children: {
          select: {
            id: true,
            title: true,
            content: true,
            parentId: true,
            isValidatable: true,
            children: {
              select: {
                id: true,
                title: true,
                content: true,
                parentId: true,
                isValidatable: true,
                children: {
                  select: {
                    id: true,
                    title: true,
                    content: true,
                    parentId: true,
                    isValidatable: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Aplatir la hiérarchie pour obtenir toutes les sections visibles
    const flattenSections = (sections: any[]): any[] => {
      const result: any[] = [];
      sections.forEach((s) => {
        result.push(s);
        if (s.children && s.children.length > 0) {
          result.push(...flattenSections(s.children));
        }
      });
      return result;
    };

    const allSections = flattenSections(rootSections);
    
    // Filtrer uniquement les sections validables (avec le flag isValidatable = true)
    // Plus besoin de la logique complexe feuilles/parents ou hasMeaningfulContent
    const validatableSections = allSections.filter((s: any) => s.isValidatable === true);

    console.log(`[updateCourseCompletion] Total sections: ${allSections.length}`);
    console.log(`[updateCourseCompletion] Sections validables: ${validatableSections.length}`);
    console.log(`[updateCourseCompletion] IDs des sections validables:`);
    validatableSections.forEach((s: any) => {
      const depth = s.parentId ? '→' : '';
      console.log(`  ${depth} ${s.title} (ID: ${s.id.substring(0, 8)}...)`);
    });

    // Collecter tous les tests (globaux + sections)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tests: true,
      },
    });

    if (!course) {
      throw new Error('Cours non trouvé');
    }

    const allTests: string[] = [];
    course.tests.forEach((test) => allTests.push(test.id));
    // Note: les sections de l'arbre n'incluent pas les tests, on ignore donc cette partie

    console.log(`[updateCourseCompletion] Total tests: ${allTests.length}`);

  // Stratégie: si des sections avec contenu existent, base sur sections visitées; sinon, fallback sur tests
  const totalSections = validatableSections.length;
    if (totalSections === 0) {
      // Aucun contenu de section: on retombe sur la progression à partir des tests
      const passedTests = await prisma.testResult.count({
        where: {
          userId,
          testId: {
            in: allTests,
          },
          passed: true,
        },
      });

      const completionPercentFromTests = allTests.length > 0 ? (passedTests / allTests.length) * 100 : 0;

      await prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {
          completionPercent: Math.round(completionPercentFromTests),
        },
        create: {
          userId,
          courseId,
          completionPercent: Math.round(completionPercentFromTests),
        },
      });

      console.log(`[updateCourseCompletion] Aucune section avec contenu. Progression basée sur tests: ${Math.round(completionPercentFromTests)}%`);
      return;
    }

    const visitedSections = await prisma.sectionProgress.count({
      where: {
        userId,
          sectionId: {
            in: validatableSections.map((s: any) => s.id),
          },
        visited: true,
      },
    });

    console.log(`[updateCourseCompletion] Sections visitées: ${visitedSections}/${totalSections}`);

    const completionPercent = (visitedSections / totalSections) * 100;

    console.log(`[updateCourseCompletion] Pourcentage calculé: ${completionPercent}%`);

    await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        completionPercent: Math.round(completionPercent),
      },
      create: {
        userId,
        courseId,
        completionPercent: Math.round(completionPercent),
      },
    });

    console.log(`[updateCourseCompletion] Progression mise à jour: ${Math.round(completionPercent)}%`);
  }

  // Réinitialiser la progression d'un cours
  async resetCourseProgress(userId: string, courseId: string) {
    // Supprimer toutes les progressions de sections
    const sections = await prisma.courseSection.findMany({
      where: { courseId },
      select: { id: true },
    });

    await prisma.sectionProgress.deleteMany({
      where: {
        userId,
        sectionId: {
          in: sections.map((s) => s.id),
        },
      },
    });

    // Réinitialiser la progression du cours
    await prisma.courseProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        lastSectionId: null,
        completionPercent: 0,
        lastAccessedAt: new Date(),
      },
    });

    return { message: 'Progression réinitialisée avec succès' };
  }

  // Obtenir les statistiques de progression d'un utilisateur
  async getUserStats(userId: string) {
    const progress = await prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    const totalCourses = progress.length;
    const completedCourses = progress.filter((p) => p.completionPercent === 100).length;
    const inProgressCourses = progress.filter((p) => p.completionPercent > 0 && p.completionPercent < 100).length;
    const averageCompletion = totalCourses > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.completionPercent, 0) / totalCourses)
      : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageCompletion,
      courses: progress,
    };
  }
}

export const progressService = new ProgressService();
