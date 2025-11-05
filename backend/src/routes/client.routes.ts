import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Statistiques du dashboard client
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Récupérer les forfaits achetés par l'utilisateur
    const userPackages = await prisma.userPackage.findMany({
      where: { userId },
      include: {
        package: {
          include: {
            courses: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    // Courses accessibles via les forfaits achetés
    const accessibleCourses = new Set<string>();
    userPackages.forEach(up => {
      up.package.courses.forEach(pc => {
        accessibleCourses.add(pc.course.id);
      });
    });

    // Nombre de cours accessibles (uniquement ceux dans les forfaits achetés)
    const accessibleCoursesCount = accessibleCourses.size;

    // Total de tous les cours disponibles (pour découverte)
    const allCoursesCount = await prisma.course.count();

    const [
      userProgress,
      completedCourses,
      inProgressCourses
    ] = await Promise.all([
      // Progrès de l'utilisateur (uniquement sur les cours accessibles)
      prisma.courseProgress.findMany({
        where: { 
          userId,
          ...(accessibleCoursesCount > 0 ? { courseId: { in: Array.from(accessibleCourses) } } : {})
        },
        include: { course: true }
      }),
      
      // Cours terminés (100% de complétion) - uniquement cours accessibles
      prisma.courseProgress.count({
        where: { 
          userId,
          completionPercent: 100,
          ...(accessibleCoursesCount > 0 ? { courseId: { in: Array.from(accessibleCourses) } } : {})
        }
      }),
      
      // Cours en cours (progression > 0 mais < 100%) - uniquement cours accessibles
      prisma.courseProgress.count({
        where: { 
          userId,
          completionPercent: { gt: 0, lt: 100 },
          ...(accessibleCoursesCount > 0 ? { courseId: { in: Array.from(accessibleCourses) } } : {})
        }
      })
    ]);

    // Calculer la progression hebdomadaire
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - 7);
    
    const weeklyProgress = await prisma.courseProgress.count({
      where: {
        userId,
        updatedAt: { gte: currentWeek }
      }
    });

    // Calculer le temps d'étude total basé sur les tests réussis et l'activité
    const totalStudyTime = await calculateStudyTime(userId);

    // Calculer la série de jours consécutifs d'activité
    const streak = await calculateDailyStreak(userId);

    // Calculer un pourcentage de progression globale basé sur les cours accessibles
    const globalProgress = accessibleCoursesCount > 0 
      ? Math.round(((completedCourses + (inProgressCourses * 0.5)) / accessibleCoursesCount) * 100)
      : 0;

    const stats = {
      totalCourses: accessibleCoursesCount, // Cours dans les forfaits achetés
      completedCourses,
      inProgressCourses,
      availableCourses: Math.max(accessibleCoursesCount - completedCourses - inProgressCourses, 0), // Cours non commencés dans les forfaits
      allCoursesCount, // Total de tous les cours (pour découverte)
      totalHours: Math.round(totalStudyTime / 60), // Convertir minutes en heures
      weeklyProgress: Math.min(Math.round((weeklyProgress / 7) * 100), 100),
      globalProgress, // Progression globale
      streak,
      packagesCount: userPackages.length // Nombre de forfaits achetés
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques client:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Activité récente de l'utilisateur
router.get('/recent-activity', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Récupérer différents types d'activités récentes
    const [recentProgress, recentTests, recentPackages] = await Promise.all([
      // Progression des cours
      prisma.courseProgress.findMany({
        where: { userId },
        include: { 
          course: { select: { title: true, category: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 3
      }),

      // Tests récents
      prisma.testResult.findMany({
        where: { userId },
        include: {
          test: { 
            select: { 
              title: true,
              course: { select: { title: true } }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 3
      }),

      // Forfaits achetés récemment
      prisma.userPackage.findMany({
        where: { userId },
        include: {
          package: { select: { name: true } }
        },
        orderBy: { purchasedAt: 'desc' },
        take: 2
      })
    ]);

    const activities: any[] = [];

    // Ajouter les activités de progression de cours
    recentProgress.forEach((progress) => {
      activities.push({
        id: `progress-${progress.id}`,
        type: progress.completionPercent === 100 ? 'course_completed' : 'lesson_started',
        title: progress.course.title,
        subtitle: progress.completionPercent === 100
          ? 'Cours terminé avec succès' 
          : `Progression: ${Math.round(progress.completionPercent)}%`,
        timestamp: getRelativeTime(progress.updatedAt),
        icon: progress.completionPercent === 100 ? 'check-circle' : 'play-circle',
        date: progress.updatedAt
      });
    });

    // Ajouter les résultats de tests
    recentTests.forEach((result) => {
      activities.push({
        id: `test-${result.id}`,
        type: result.passed ? 'quiz_passed' : 'quiz_failed',
        title: result.test.title,
        subtitle: result.passed 
          ? `Test réussi avec ${result.score}%` 
          : `Test échoué (${result.score}%)`,
        timestamp: getRelativeTime(result.completedAt),
        icon: result.passed ? 'check-circle' : 'close-circle',
        date: result.completedAt
      });
    });

    // Ajouter les forfaits achetés
    recentPackages.forEach((userPackage) => {
      activities.push({
        id: `package-${userPackage.id}`,
        type: 'package_purchased',
        title: userPackage.package.name,
        subtitle: 'Forfait acheté',
        timestamp: getRelativeTime(userPackage.purchasedAt),
        icon: 'shopping',
        date: userPackage.purchasedAt
      });
    });

    // Trier toutes les activités par date et prendre les 10 plus récentes
    const sortedActivities = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)
      .map(activity => {
        // Supprimer la date de l'objet final
        const { date, ...activityWithoutDate } = activity;
        return activityWithoutDate;
      });

    // Si aucune activité, ajouter des suggestions
    if (sortedActivities.length === 0) {
      sortedActivities.push({
        id: 'suggestion-1',
        type: 'suggestion',
        title: 'Commencez votre apprentissage',
        subtitle: 'Explorez les cours disponibles',
        timestamp: 'maintenant',
        icon: 'lightbulb'
      });
    }

    res.json(sortedActivities);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité récente:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Fonction utilitaire pour calculer le temps relatif
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'quelques minutes';
  } else if (diffHours < 24) {
    return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }
}

// Fonction pour calculer le temps d'étude total
async function calculateStudyTime(userId: string): Promise<number> {
  try {
    // 1. Temps des tests réussis (durée réelle des tests)
    const completedTests = await prisma.testResult.findMany({
      where: { 
        userId,
        passed: true
      },
      include: {
        test: { select: { duration: true } }
      }
    });

    const testTime = completedTests.reduce((total, result) => {
      return total + (result.test.duration || 0);
    }, 0);

    // 2. Estimation du temps basé sur les sections visitées
    // On estime 10 minutes par section visitée (temps de lecture/compréhension)
    const visitedSections = await prisma.sectionProgress.count({
      where: { 
        userId,
        visited: true
      }
    });

    const estimatedSectionTime = visitedSections * 10; // 10 minutes par section

    // 3. Bonus pour les cours complétés (temps d'étude supplémentaire estimé)
    const completedCoursesProgress = await prisma.courseProgress.findMany({
      where: { 
        userId,
        completionPercent: 100
      }
    });

    const completionBonusTime = completedCoursesProgress.length * 30; // 30 minutes bonus par cours terminé

    // Total en minutes
    const totalMinutes = testTime + estimatedSectionTime + completionBonusTime;
    
    return Math.max(totalMinutes, 0); // S'assurer que le temps n'est jamais négatif
  } catch (error) {
    console.error('Erreur lors du calcul du temps d\'étude:', error);
    return 0;
  }
}

// Fonction pour calculer la série de jours consécutifs d'activité
async function calculateDailyStreak(userId: string): Promise<number> {
  try {
    // Récupérer toutes les activités de l'utilisateur (mises à jour de progression + tests réussis)
    const [progressUpdates, testResults] = await Promise.all([
      prisma.courseProgress.findMany({
        where: { userId },
        select: { lastAccessedAt: true, updatedAt: true },
        orderBy: { lastAccessedAt: 'desc' }
      }),
      prisma.testResult.findMany({
        where: { userId },
        select: { completedAt: true },
        orderBy: { completedAt: 'desc' }
      })
    ]);

    // Combiner toutes les dates d'activité
    const allActivities = [
      ...progressUpdates.map(p => p.lastAccessedAt),
      ...testResults.map(t => t.completedAt)
    ].sort((a, b) => b.getTime() - a.getTime()); // Trier par date décroissante

    if (allActivities.length === 0) {
      return 0;
    }

    // Grouper les activités par jour
    const activityDays = new Set<string>();
    allActivities.forEach(date => {
      const dayString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      activityDays.add(dayString);
    });

    const sortedDays = Array.from(activityDays).sort().reverse(); // Trier par date décroissante

    // Calculer la série à partir d'aujourd'hui
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Vérifier si l'utilisateur a été actif aujourd'hui ou hier
    let currentCheckDate = today;
    if (!sortedDays.includes(today) && sortedDays.includes(yesterday)) {
      currentCheckDate = yesterday;
    } else if (!sortedDays.includes(today) && !sortedDays.includes(yesterday)) {
      return 0; // Aucune activité récente
    }

    // Compter les jours consécutifs
    for (let i = 0; i < sortedDays.length; i++) {
      const checkDate = new Date(currentCheckDate);
      checkDate.setDate(checkDate.getDate() - i);
      const expectedDay = checkDate.toISOString().split('T')[0];

      if (sortedDays.includes(expectedDay)) {
        streak++;
      } else {
        break; // Interruption dans la série
      }
    }

    return streak;
  } catch (error) {
    console.error('Erreur lors du calcul de la série:', error);
    return 0;
  }
}

export default router;