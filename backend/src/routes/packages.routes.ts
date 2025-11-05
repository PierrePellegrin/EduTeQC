import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/packages - Liste tous les forfaits disponibles
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: {
        courses: {
          include: {
            course: {
              include: {
                niveau: {
                  include: {
                    cycle: true
                  }
                },
                sections: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Transformer les données pour l'API
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      imageUrl: pkg.imageUrl,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
      coursesCount: pkg.courses.length,
      courses: pkg.courses.map(pc => ({
        id: pc.course.id,
        title: pc.course.title,
        category: pc.course.category,
        niveau: {
          id: pc.course.niveau.id,
          name: pc.course.niveau.name,
          order: pc.course.niveau.order,
          cycle: {
            id: pc.course.niveau.cycle.id,
            name: pc.course.niveau.cycle.name,
            order: pc.course.niveau.cycle.order
          }
        },
        sectionsCount: pc.course.sections.length
      }))
    }));

    res.json({
      success: true,
      data: formattedPackages,
      count: formattedPackages.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des forfaits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// GET /api/packages/:id - Récupère un forfait spécifique
router.get('/:id', async (req, res) => {
  try {
    const packageId = req.params.id;

    const package_ = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        courses: {
          include: {
            course: {
              include: {
                niveau: {
                  include: {
                    cycle: true
                  }
                },
                sections: {
                  select: {
                    id: true,
                    title: true,
                    order: true
                  },
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    if (!package_) {
      return res.status(404).json({
        success: false,
        message: 'Forfait non trouvé'
      });
    }

    // Transformer les données pour l'API
    const formattedPackage = {
      id: package_.id,
      name: package_.name,
      description: package_.description,
      price: package_.price,
      imageUrl: package_.imageUrl,
      createdAt: package_.createdAt,
      updatedAt: package_.updatedAt,
      coursesCount: package_.courses.length,
      courses: package_.courses.map(pc => ({
        id: pc.course.id,
        title: pc.course.title,
        category: pc.course.category,
        niveau: {
          id: pc.course.niveau.id,
          name: pc.course.niveau.name,
          order: pc.course.niveau.order,
          cycle: {
            id: pc.course.niveau.cycle.id,
            name: pc.course.niveau.cycle.name,
            order: pc.course.niveau.cycle.order
          }
        },
        sectionsCount: pc.course.sections.length,
        sections: pc.course.sections
      }))
    };

    res.json({
      success: true,
      data: formattedPackage
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du forfait:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

// GET /api/packages/by-cycle/:cycleId - Récupère les forfaits d'un cycle
router.get('/by-cycle/:cycleId', async (req, res) => {
  try {
    const cycleId = req.params.cycleId;

    const packages = await prisma.package.findMany({
      where: {
        courses: {
          some: {
            course: {
              niveau: {
                cycleId: cycleId
              }
            }
          }
        }
      },
      include: {
        courses: {
          include: {
            course: {
              include: {
                niveau: {
                  include: {
                    cycle: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      imageUrl: pkg.imageUrl,
      coursesCount: pkg.courses.length
    }));

    res.json({
      success: true,
      data: formattedPackages,
      count: formattedPackages.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des forfaits par cycle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default router;