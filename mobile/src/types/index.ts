export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface Cycle {
  id: string;
  name: string;
  order: number;
}

export interface Niveau {
  id: string;
  name: string;
  cycleId: string;
  order: number;
  cycle?: Cycle;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  niveauId: string;
  niveau?: Niveau;
  sections?: CourseSection[];
  tests?: Test[];
}

export interface CourseSection {
  id: string;
  courseId: string;
  parentId?: string | null;
  title: string;
  content?: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
  parent?: CourseSection | null;
  children?: CourseSection[];
  tests?: Test[];
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  lastSectionId?: string | null;
  completionPercent: number;
  startedAt: Date;
  lastAccessedAt: Date;
  course?: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    category: string;
  };
}

export interface SectionProgress {
  id: string;
  userId: string;
  sectionId: string;
  visited: boolean;
  visitedAt?: Date | null;
  section?: {
    id: string;
    title: string;
    courseId: string;
  };
}

export interface Test {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number;
  passingScore: number;
  isPublished: boolean;
  questions?: Question[];
  course?: {
    id: string;
    title: string;
  };
}

export interface Question {
  id: string;
  testId: string;
  question: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  points: number;
  order: number;
  options: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect?: boolean;
  order: number;
}

export interface TestResult {
  id: string;
  score: number;
  passed: boolean;
  completedAt: Date;
}
