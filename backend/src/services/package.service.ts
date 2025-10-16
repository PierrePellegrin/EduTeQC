import { prisma } from '../lib/prisma';

export class PackageService {
  static async getAllAdmin() {
    return prisma.package.findMany({
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            userPackages: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  static async create(data: any) {
    const { courseIds, name, description, price, imageUrl, isActive } = data;
    const packageData: any = {
      name,
      description,
      price,
      imageUrl,
      isActive: isActive ?? true,
    };
    if (courseIds && courseIds.length > 0) {
      packageData.courses = {
        create: courseIds.map((courseId: string) => ({ courseId })),
      };
    }
    return prisma.package.create({
      data: packageData,
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: any) {
    const { courseIds, name, description, price, imageUrl, isActive } = data;
    // Update package basic info
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
        isActive,
      },
    });
    // Update courses if provided
    if (courseIds !== undefined) {
      await prisma.packageCourse.deleteMany({ where: { packageId: id } });
      if (courseIds.length > 0) {
        await prisma.packageCourse.createMany({
          data: courseIds.map((courseId: string) => ({ packageId: id, courseId })),
        });
      }
    }
    // Fetch updated package with courses
    return prisma.package.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return prisma.package.delete({ where: { id } });
  }

  static async getUserPackages(userId: string) {
    return prisma.userPackage.findMany({
      where: { userId },
      include: {
        package: {
          include: {
            courses: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    category: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  static async buyPackage(userId: string, packageId: string) {
    // Check if already purchased
    const existing = await prisma.userPackage.findFirst({ where: { userId, packageId } });
    if (existing) {
      throw new Error('Package already purchased');
    }
    return prisma.userPackage.create({
      data: { userId, packageId },
      include: {
        package: {
          include: {
            courses: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }
}
