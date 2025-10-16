import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'La catégorie est requise'),
  imageUrl: z.string().url('URL invalide').optional(),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  order: z.number().int().nonnegative().optional(),
  isPublished: z.boolean().optional(),
});

export const testSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  courseId: z.string().uuid('ID de cours invalide'),
  duration: z.number().int().min(1, 'La durée doit être d\'au moins 1 minute'),
  passingScore: z.number().min(0).max(100, 'Le score doit être entre 0 et 100'),
  imageUrl: z.string().url('URL invalide').optional(),
  isPublished: z.boolean().optional(),
});

export const questionSchema = z.object({
  testId: z.string().uuid('ID de test invalide'),
  question: z.string().min(3, 'La question doit contenir au moins 3 caractères'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE'], {
    errorMap: () => ({ message: 'Type invalide' }),
  }),
  points: z.number().int().min(1, 'Les points doivent être au moins 1'),
  order: z.number().int().nonnegative().optional(),
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'Le texte de l\'option est requis'),
        isCorrect: z.boolean(),
        order: z.number().int().nonnegative().optional(),
      })
    )
    .min(2, 'Au moins 2 options sont requises'),
});

export const packageSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.number().min(0, 'Le prix doit être positif'),
  imageUrl: z.string().url('URL invalide').optional(),
  isActive: z.boolean().optional(),
  courseIds: z.array(z.string().uuid('ID de cours invalide')).optional(),
});

export const submitTestSchema = z.object({
  answers: z.record(z.array(z.string().uuid('ID d\'option invalide'))),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});
