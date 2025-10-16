import { prisma } from '../lib/prisma';

export class CourseService {
  static async getAll() {
    return prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        imageUrl: true,
        order: true,
      },
    });
  }

  static async getById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        tests: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            passingScore: true,
          },
        },
      },
    });
  }

  static async getByCategory(category: string) {
    return prisma.course.findMany({
      where: { category, isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  static async getAllAdmin() {
    return prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        tests: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
        },
      },
    });
  }

  static async create(data: any) {
    return prisma.course.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.course.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.course.delete({ where: { id } });
  }
}
