export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizLevel {
  id: string;
  levelNumber: number;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  levels: QuizLevel[];
  color: string;
  icon: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
}

export interface UserProgress {
  categoryId: string;
  levelId: string;
  completed: boolean;
  score?: number;
  percentage?: number;
  timestamp: number;
}