import { UserProgress } from '../types/cyber.types';

const STORAGE_KEY = 'cyber_academy_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  userId: 'usr_apprenant_01',
  completedLessons: ['lesson-1-1'], // Start with first lesson marked as previewed/in progress or ready
  quizScores: {
    'quiz-1-1': { score: 100, passed: true, attempts: 1, lastAttemptDate: '2026-10-17' }
  },
  completedLabTasks: ['task-pwd'],
  xp: 150,
  learningTimeMinutes: 45,
  streakDays: 3,
  weeklyGoalCompletedMinutes: 45,
  weeklyGoalTargetMinutes: 120,
  skills: {
    systeme: 45,
    reseau: 20,
    terminal: 35,
    defense: 30,
    analyseMenaces: 25
  },
  badges: [
    {
      id: 'badge-first-step',
      title: 'Premier pas dans la matrice',
      description: 'A validé avec succès sa première leçon sur l\'architecture d\'un ordinateur.',
      earnedAt: '2026-10-17',
      icon: 'ShieldCheck'
    },
    {
      id: 'badge-first-terminal',
      title: 'Apprenti du Shell',
      description: 'A exécuté avec brio ses premières commandes dans le terminal simulé.',
      earnedAt: '2026-10-17',
      icon: 'Terminal'
    }
  ],
  supabaseConfig: {
    url: '',
    anonKey: '',
    isConnected: false
  }
};

type Listener = (progress: UserProgress) => void;
const listeners = new Set<Listener>();

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (err) {
    console.error('Erreur lors du chargement de la progression', err);
    return DEFAULT_PROGRESS;
  }
}

let currentProgress: UserProgress = loadProgress();

function saveProgress(progress: UserProgress) {
  currentProgress = progress;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Erreur lors de la sauvegarde locale', err);
  }
  listeners.forEach((listener) => listener(currentProgress));
}

export const StorageService = {
  getProgress(): UserProgress {
    return currentProgress;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener(currentProgress);
    return () => listeners.delete(listener);
  },

  markLessonComplete(lessonId: string, earnedXp = 50) {
    const completed = new Set(currentProgress.completedLessons);
    const isNew = !completed.has(lessonId);
    completed.add(lessonId);

    const updatedXp = currentProgress.xp + (isNew ? earnedXp : 10);
    const updatedTime = currentProgress.learningTimeMinutes + 20;

    // Recalculate skill updates
    const skills = { ...currentProgress.skills };
    if (lessonId.startsWith('lesson-1-')) {
      skills.systeme = Math.min(100, skills.systeme + 15);
      skills.terminal = Math.min(100, skills.terminal + 15);
    }
    if (lessonId.startsWith('lesson-2-')) {
      skills.reseau = Math.min(100, skills.reseau + 25);
    }
    if (lessonId.startsWith('lesson-4-')) {
      skills.defense = Math.min(100, skills.defense + 25);
      skills.analyseMenaces = Math.min(100, skills.analyseMenaces + 20);
    }

    saveProgress({
      ...currentProgress,
      completedLessons: Array.from(completed),
      xp: updatedXp,
      learningTimeMinutes: updatedTime,
      weeklyGoalCompletedMinutes: currentProgress.weeklyGoalCompletedMinutes + 20,
      skills
    });
  },

  recordQuizScore(quizId: string, score: number, passed: boolean) {
    const prev = currentProgress.quizScores[quizId];
    const attempts = (prev?.attempts || 0) + 1;
    const earnedXp = passed && !prev?.passed ? 100 : 25;

    const quizScores = {
      ...currentProgress.quizScores,
      [quizId]: {
        score: Math.max(score, prev?.score || 0),
        passed: passed || (prev?.passed ?? false),
        attempts,
        lastAttemptDate: new Date().toISOString().split('T')[0]
      }
    };

    // Check for badge "Sans faute"
    const badges = [...currentProgress.badges];
    if (score === 100 && !badges.find((b) => b.id === 'badge-perfect-score')) {
      badges.push({
        id: 'badge-perfect-score',
        title: 'Score Parfait (100%)',
        description: 'A obtenu un sans-faute sur un quiz de validation technique.',
        earnedAt: new Date().toISOString().split('T')[0],
        icon: 'Award'
      });
    }

    saveProgress({
      ...currentProgress,
      quizScores,
      xp: currentProgress.xp + earnedXp,
      badges
    });
  },

  recordLabTaskComplete(taskId: string, skillCategory: keyof UserProgress['skills'] = 'terminal') {
    const set = new Set(currentProgress.completedLabTasks);
    if (!set.has(taskId)) {
      set.add(taskId);
      const skills = { ...currentProgress.skills };
      skills[skillCategory] = Math.min(100, skills[skillCategory] + 20);

      // Check badge "Analyste Phishing"
      const badges = [...currentProgress.badges];
      if (taskId.startsWith('phish-') && !badges.find((b) => b.id === 'badge-phish-hunter')) {
        badges.push({
          id: 'badge-phish-hunter',
          title: 'Chasseur de Phishing',
          description: 'A démasqué avec succès les courriels malveillants lors du laboratoire.',
          earnedAt: new Date().toISOString().split('T')[0],
          icon: 'MailCheck'
        });
      }

      saveProgress({
        ...currentProgress,
        completedLabTasks: Array.from(set),
        xp: currentProgress.xp + 75,
        skills,
        badges
      });
    }
  },

  setSupabaseConfig(url: string, anonKey: string) {
    saveProgress({
      ...currentProgress,
      supabaseConfig: {
        url,
        anonKey,
        isConnected: Boolean(url && anonKey)
      }
    });
  },

  resetProgress() {
    saveProgress({ ...DEFAULT_PROGRESS });
  },

  exportPortfolioJSON(): string {
    return JSON.stringify(currentProgress, null, 2);
  }
};
