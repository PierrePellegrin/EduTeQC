import { prisma } from '../lib/prisma';

export class AdminService {
  static async getStats() {
    const [coursesCount, testsCount, usersCount, resultsCount] = await Promise.all([
      prisma.course.count(),
      prisma.test.count(),
      prisma.user.count(),
      prisma.testResult.count(),
    ]);
    return {
      courses: coursesCount,
      tests: testsCount,
      users: usersCount,
      results: resultsCount,
    };
  }

  // Get Admin user client statistics
  static async getAdminClientStats() {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { email: { contains: 'admin' } },
          { firstName: { contains: 'Admin' } },
          { lastName: { contains: 'Admin' } }
        ]
      },
      include: {
        purchasedPackages: {
          include: {
            package: {
              select: {
                name: true,
                price: true
              }
            }
          }
        },
        courseProgress: {
          include: {
            course: {
              select: {
                title: true,
                category: true
              }
            }
          }
        },
        sectionProgress: {
          include: {
            section: {
              select: {
                title: true
              }
            }
          }
        },
        testResults: {
          include: {
            test: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Calculate statistics
    const totalSpent = adminUser.purchasedPackages.reduce((sum, up) => sum + up.package.price, 0);
    const visitedSections = adminUser.sectionProgress.filter(sp => sp.visited).length;
    const avgScore = adminUser.testResults.length > 0 
      ? adminUser.testResults.reduce((sum, tr) => sum + tr.score, 0) / adminUser.testResults.length 
      : 0;

    return {
      user: {
        id: adminUser.id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role
      },
      stats: {
        purchasedPackages: adminUser.purchasedPackages.length,
        totalSpent: totalSpent,
        courseProgress: adminUser.courseProgress.length,
        sectionProgress: adminUser.sectionProgress.length,
        visitedSections: visitedSections,
        testResults: adminUser.testResults.length,
        averageScore: avgScore
      },
      details: {
        packages: adminUser.purchasedPackages.map(up => ({
          name: up.package.name,
          price: up.package.price,
          purchasedAt: up.purchasedAt
        })),
        courses: adminUser.courseProgress.map(cp => ({
          title: cp.course.title,
          category: cp.course.category,
          completion: cp.completionPercent
        })),
        recentTests: adminUser.testResults.slice(-5).map(tr => ({
          title: tr.test.title,
          score: tr.score,
          passed: tr.passed,
          completedAt: tr.completedAt
        }))
      }
    };
  }

  // Clean Admin user client data
  static async cleanAdminClientData() {
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { email: { contains: 'admin' } },
          { firstName: { contains: 'Admin' } },
          { lastName: { contains: 'Admin' } }
        ]
      }
    });

    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Delete all client data for admin user
    const [deletedPackages, deletedCourseProgress, deletedSectionProgress, deletedTestResults] = await Promise.all([
      prisma.userPackage.deleteMany({
        where: { userId: adminUser.id }
      }),
      prisma.courseProgress.deleteMany({
        where: { userId: adminUser.id }
      }),
      prisma.sectionProgress.deleteMany({
        where: { userId: adminUser.id }
      }),
      prisma.testResult.deleteMany({
        where: { userId: adminUser.id }
      })
    ]);

    return {
      userId: adminUser.id,
      userEmail: adminUser.email,
      deletedCounts: {
        packages: deletedPackages.count,
        courseProgress: deletedCourseProgress.count,
        sectionProgress: deletedSectionProgress.count,
        testResults: deletedTestResults.count
      },
      totalDeleted: deletedPackages.count + deletedCourseProgress.count + deletedSectionProgress.count + deletedTestResults.count
    };
  }
}
