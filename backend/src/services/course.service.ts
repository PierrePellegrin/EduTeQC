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
        niveau: {
          select: {
            id: true,
            name: true,
            cycle: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        niveau: {
          include: {
            cycle: true,
          },
        },
        sections: {
          where: { parentId: null }, // Seulement les sections racines
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
        },
        tests: {
          where: { 
            isPublished: true,
            // Tests globaux du cours uniquement (pas liés à une section)
          },
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
      include: {
        niveau: {
          include: {
            cycle: true,
          },
        },
      },
    });
  }

  static async getAllAdmin() {
    return prisma.course.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        imageUrl: true,
        isPublished: true,
        order: true,
        niveauId: true,
        niveau: {
          select: {
            id: true,
            name: true,
            cycle: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            tests: true,
            sections: true,
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
