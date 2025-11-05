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

    // Temps d'étude total et série de jours (simulés pour l'instant)
    const totalStudyTime = 24; 
    const streak = 7; 

    const stats = {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalHours: totalStudyTime,
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

export default router;