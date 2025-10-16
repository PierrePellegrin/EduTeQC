import { prisma } from '../lib/prisma';

export class QuestionService {
  static async create(data: any) {
    const { testId, question, type, points, order, options } = data;
    return prisma.question.create({
      data: {
        testId,
        question,
        type,
        points,
        order: order || 0,
        options: {
          create: options,
        },
      },
      include: {
        options: true,
      },
    });
  }

  static async update(id: string, data: any) {
    const { options, ...questionData } = data;
    return prisma.question.update({
      where: { id },
      data: questionData,
      include: {
        options: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.question.delete({ where: { id } });
  }
}
