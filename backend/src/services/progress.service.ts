import { prisma } from '../lib/prisma';

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

    // Mettre à jour la dernière section visitée et la date d'accès du cours
    await prisma.courseProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId: sectionProgress.section.courseId,
        },
      },
      data: {
        lastSectionId: visited ? sectionId : null,
        lastAccessedAt: new Date(),
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
    // Récupérer tous les tests du cours (globaux et des sections)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tests: true,
        sections: {
          include: {
            tests: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error('Cours non trouvé');
    }

    // Collecter tous les tests (globaux + sections)
    const allTests: string[] = [];
    course.tests.forEach((test) => allTests.push(test.id));
    course.sections.forEach((section) => {
      section.tests.forEach((test) => allTests.push(test.id));
    });

    if (allTests.length === 0) {
      // Pas de tests, la complétion est basée sur les sections visitées
      const totalSections = course.sections.length;
      if (totalSections === 0) {
        return;
      }

      const visitedSections = await prisma.sectionProgress.count({
        where: {
          userId,
          sectionId: {
            in: course.sections.map((s) => s.id),
          },
          visited: true,
        },
      });

      const completionPercent = (visitedSections / totalSections) * 100;

      await prisma.courseProgress.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completionPercent: Math.round(completionPercent),
        },
      });

      return;
    }

    // Récupérer les résultats des tests réussis
    const passedTests = await prisma.testResult.count({
      where: {
        userId,
        testId: {
          in: allTests,
        },
        passed: true,
      },
    });

    // Calculer le pourcentage
    const completionPercent = (passedTests / allTests.length) * 100;

    // Mettre à jour la progression du cours
    await prisma.courseProgress.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        completionPercent: Math.round(completionPercent),
      },
    });

    return completionPercent;
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
