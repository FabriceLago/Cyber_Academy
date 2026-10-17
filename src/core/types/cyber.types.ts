export type DifficultyLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';

export interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // e.g. 80
}

export interface GuidedExercise {
  title: string;
  instructions: string[];
  hint: string;
  solution: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  pathId: string;
  title: string;
  level: DifficultyLevel;
  durationMinutes: number;
  prerequisites: string[];
  measurableObjectives: string[];
  simplifiedExplanation: {
    introduction: string;
    analogy: string;
    coreConcepts: {
      heading: string;
      body: string;
    }[];
  };
  glossary: GlossaryTerm[];
  concreteExample: {
    scenario: string;
    explanation: string;
    takeaway: string;
  };
  visualDemoType?: 'network-packet' | 'file-permissions' | 'phishing-inspection' | 'terminal-flow';
  guidedExercise: GuidedExercise;
  associatedLabId?: string;
  quizId: string;
  summaryPoints: string[];
  successCriteria: string[];
  order: number;
}

export interface Module {
  id: string;
  pathId: string;
  title: string;
  description: string;
  durationMinutes: number;
  lessons: Lesson[];
  order: number;
}

export interface LearningPath {
  id: string;
  levelNumber: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  durationHours: number;
  modulesCount: number;
  labsCount: number;
  isAvailable: boolean; // MVP focuses on 1 & 2 fully available, with 3-9 documented
  modules: Module[];
}

export interface TerminalTask {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  verificationCommand: string; // or check function logic
  verify: (vfs: Record<string, any>, commandHistory: string[]) => boolean;
  explanation: string;
}

export interface PhishingEmail {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  recipient: string;
  date: string;
  body: string;
  headers: {
    returnPath: string;
    receivedFrom: string;
    spf: 'PASS' | 'FAIL' | 'NEUTRAL';
    dkim: 'PASS' | 'FAIL' | 'NONE';
    dmarc: 'PASS' | 'FAIL' | 'NONE';
    replyTo?: string;
  };
  isPhishing: boolean;
  indicators: {
    type: 'sender' | 'urgency' | 'link' | 'attachment' | 'header';
    description: string;
  }[];
  explanation: string;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  quizScores: Record<string, { score: number; passed: boolean; attempts: number; lastAttemptDate: string }>;
  completedLabTasks: string[];
  xp: number;
  learningTimeMinutes: number;
  streakDays: number;
  weeklyGoalCompletedMinutes: number;
  weeklyGoalTargetMinutes: number;
  skills: {
    systeme: number; // 0 - 100
    reseau: number;
    terminal: number;
    defense: number;
    analyseMenaces: number;
  };
  badges: {
    id: string;
    title: string;
    description: string;
    earnedAt?: string;
    icon: string;
  }[];
  supabaseConfig?: {
    url: string;
    anonKey: string;
    isConnected: boolean;
  };
  isIntegrityVerified?: boolean;
  lastAuditDate?: string;
}
