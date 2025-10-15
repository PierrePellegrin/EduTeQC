export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  content: string;
  order: number;
  isPublished: boolean;
  tests?: Test[];
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
