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
}
