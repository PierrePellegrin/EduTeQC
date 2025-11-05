import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';

const router = Router();

// Statistiques du dashboard client
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Récupérer les statistiques d'apprentissage de l'utilisateur
    const [
      totalCourses,
      userProgress,
      completedCourses,
      inProgressCourses
    ] = await Promise.all([
      // Nombre total de cours disponibles
      prisma.course.count(),
      
      // Progrès de l'utilisateur
      prisma.courseProgress.findMany({
        where: { userId },
        include: { course: true }
      }),
      
      // Cours terminés (100% de complétion)
      prisma.courseProgress.count({
        where: { 
          userId,
          completionPercent: 100
        }
      }),
      
      // Cours en cours (progression > 0 mais < 100%)
      prisma.courseProgress.count({
        where: { 
          userId,
          completionPercent: { gt: 0, lt: 100 }
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

    const stats = {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalHours: Math.round(totalStudyTime / 60), // Convertir minutes en heures
      weeklyProgress: Math.min(Math.round((weeklyProgress / 7) * 100), 100),
      streak
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

    // Récupérer les activités récentes de l'utilisateur
    const recentProgress = await prisma.courseProgress.findMany({
      where: { userId },
      include: { 
        course: { select: { title: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });

    // Transformer en format d'activité
    const activities = recentProgress.map((progress) => ({
      id: progress.id.toString(),
      type: progress.completionPercent === 100 ? 'course_completed' : 'lesson_started' as const,
      title: progress.course.title,
      subtitle: progress.completionPercent === 100
        ? 'Cours terminé avec succès' 
        : `Progression: ${Math.round(progress.completionPercent)}%`,
      timestamp: getRelativeTime(progress.updatedAt),
      icon: progress.completionPercent === 100 ? 'check-circle' : 'play-circle'
    }));

    res.json(activities);
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