import { prisma } from '../lib/prisma';

export class CycleService {
  static async getAll() {
    return prisma.cycle.findMany({
      orderBy: { order: 'asc' },
      include: {
        niveaux: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  static async getById(id: string) {
    return prisma.cycle.findUnique({
      where: { id },
      include: {
        niveaux: {
          orderBy: { order: 'asc' },
          include: {
            courses: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }
}

export class NiveauService {
  static async getAll() {
    return prisma.niveau.findMany({
      orderBy: { order: 'asc' },
      include: {
        cycle: true,
      },
    });
  }

  static async getById(id: string) {
    return prisma.niveau.findUnique({
      where: { id },
      include: {
        cycle: true,
        courses: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  static async getByCycle(cycleId: string) {
    return prisma.niveau.findMany({
      where: { cycleId },
      orderBy: { order: 'asc' },
      include: {
        cycle: true,
      },
    });
  }
}
