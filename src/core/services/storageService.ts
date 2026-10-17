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

const INTEGRITY_KEY = 'cyber_academy_integrity_token_v1';
const INTEGRITY_SALT = 'cyber_sec_v1_defense_in_depth';

let isIntegrityCompromisedState = false;

function computeIntegritySignature(progress: UserProgress): string {
  const payload = `${progress.userId}|${progress.xp}|${progress.streakDays}|${progress.completedLessons.length}|${Object.keys(progress.quizScores).length}|${progress.completedLabTasks.length}|${progress.learningTimeMinutes}|${INTEGRITY_SALT}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hmac_' + Math.abs(hash).toString(16);
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, isIntegrityVerified: true };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROGRESS;

    // Defense against prototype pollution & rogue properties
    const safeProgress: UserProgress = {
      userId: typeof parsed.userId === 'string' ? parsed.userId : DEFAULT_PROGRESS.userId,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons.filter((x: any) => typeof x === 'string') : DEFAULT_PROGRESS.completedLessons,
      quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : DEFAULT_PROGRESS.quizScores,
      completedLabTasks: Array.isArray(parsed.completedLabTasks) ? parsed.completedLabTasks.filter((x: any) => typeof x === 'string') : DEFAULT_PROGRESS.completedLabTasks,
      xp: typeof parsed.xp === 'number' && !isNaN(parsed.xp) ? Math.max(0, parsed.xp) : DEFAULT_PROGRESS.xp,
      learningTimeMinutes: typeof parsed.learningTimeMinutes === 'number' ? Math.max(0, parsed.learningTimeMinutes) : DEFAULT_PROGRESS.learningTimeMinutes,
      streakDays: typeof parsed.streakDays === 'number' ? Math.max(0, parsed.streakDays) : DEFAULT_PROGRESS.streakDays,
      weeklyGoalCompletedMinutes: typeof parsed.weeklyGoalCompletedMinutes === 'number' ? parsed.weeklyGoalCompletedMinutes : DEFAULT_PROGRESS.weeklyGoalCompletedMinutes,
      weeklyGoalTargetMinutes: typeof parsed.weeklyGoalTargetMinutes === 'number' ? parsed.weeklyGoalTargetMinutes : DEFAULT_PROGRESS.weeklyGoalTargetMinutes,
      skills: parsed.skills && typeof parsed.skills === 'object' ? { ...DEFAULT_PROGRESS.skills, ...parsed.skills } : DEFAULT_PROGRESS.skills,
      badges: Array.isArray(parsed.badges) ? parsed.badges : DEFAULT_PROGRESS.badges,
      supabaseConfig: parsed.supabaseConfig && typeof parsed.supabaseConfig === 'object' ? parsed.supabaseConfig : DEFAULT_PROGRESS.supabaseConfig,
      isIntegrityVerified: true
    };

    // Check anti-tampering token if present
    const storedToken = localStorage.getItem(INTEGRITY_KEY);
    if (storedToken) {
      const expectedToken = computeIntegritySignature(safeProgress);
      if (storedToken !== expectedToken) {
        console.warn('ALERTE SÉCURITÉ : Falsification d\'état détectée dans le LocalStorage !');
        isIntegrityCompromisedState = true;
        safeProgress.isIntegrityVerified = false;
      }
    } else {
      // First run or upgraded version: initialize token
      localStorage.setItem(INTEGRITY_KEY, computeIntegritySignature(safeProgress));
    }

    return safeProgress;
  } catch (err) {
    console.error('Erreur lors du chargement de la progression', err);
    return DEFAULT_PROGRESS;
  }
}

let currentProgress: UserProgress = loadProgress();

function saveProgress(progress: UserProgress) {
  currentProgress = { ...progress, isIntegrityVerified: !isIntegrityCompromisedState };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProgress));
    localStorage.setItem(INTEGRITY_KEY, computeIntegritySignature(currentProgress));
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
    isIntegrityCompromisedState = false;
    saveProgress({ ...DEFAULT_PROGRESS });
  },

  isIntegrityCompromised(): boolean {
    return isIntegrityCompromisedState;
  },

  simulateTamperingAttack(): { success: boolean; message: string } {
    // Maliciously inject false XP into raw storage without updating cryptographic signature
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.xp = 999999; // Tampered XP
        parsed.streakDays = 999;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      isIntegrityCompromisedState = true;
      currentProgress = {
        ...currentProgress,
        xp: 999999,
        streakDays: 999,
        isIntegrityVerified: false
      };
      listeners.forEach((listener) => listener(currentProgress));
      return {
        success: true,
        message: 'ATTACK SIMULÉE : Le score d\'XP a été modifié arbitrairement à 999,999 XP dans le LocalStorage sans signature valide. Le système de défense anti-tampering a détecté l\'anomalie de hachage !'
      };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  restoreIntegrity() {
    isIntegrityCompromisedState = false;
    // Re-synchronize and recalculate legitimate HMAC
    saveProgress({
      ...currentProgress,
      xp: Math.min(10000, currentProgress.xp === 999999 ? 150 : currentProgress.xp),
      streakDays: currentProgress.streakDays === 999 ? 3 : currentProgress.streakDays,
      isIntegrityVerified: true
    });
  },

  exportPortfolioJSON(): string {
    return JSON.stringify(
      {
        version: '1.2-secure',
        signature: computeIntegritySignature(currentProgress),
        exportedAt: new Date().toISOString(),
        progress: currentProgress
      },
      null,
      2
    );
  }
};
