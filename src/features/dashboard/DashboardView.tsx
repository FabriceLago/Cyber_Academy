import React from 'react';
import {
  Shield,
  BookOpen,
  Terminal,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Flame,
  Target,
  Zap,
  BarChart3,
  Cpu
} from 'lucide-react';
import { useProgress } from '../../shared/hooks/useProgress';
import { INITIAL_LESSONS, LEARNING_PATHS } from '../../core/data/cyberData';

interface DashboardViewProps {
  onStartLesson: (lessonId: string) => void;
  onGoToLab: (labType: 'terminal' | 'phishing' | 'network') => void;
  onGoToTab: (tab: 'paths' | 'lessons' | 'labs' | 'quizzes' | 'skills') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartLesson,
  onGoToLab,
  onGoToTab
}) => {
  const progress = useProgress();

  // Find next recommended lesson (first uncompleted lesson)
  const nextLesson = INITIAL_LESSONS.find((l) => !progress.completedLessons.includes(l.id)) || INITIAL_LESSONS[0];

  const totalLessons = INITIAL_LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const completionPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  const skillsList = [
    { name: 'Système & OS', value: progress.skills.systeme, color: 'bg-cyan-500' },
    { name: 'Réseau TCP/IP', value: progress.skills.reseau, color: 'bg-sky-500' },
    { name: 'Terminal & CLI', value: progress.skills.terminal, color: 'bg-emerald-500' },
    { name: 'Défense & Hygiène', value: progress.skills.defense, color: 'bg-amber-500' },
    { name: 'Analyse de Menaces', value: progress.skills.analyseMenaces, color: 'bg-rose-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>PARCOURS ACTIF : NIVEAU 1 — CULTURE INFORMATIQUE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
            Bienvenue dans votre académie de cybersécurité
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Développez des compétences pratiques réelles grâce à des cours vulgarisés, des simulations pas-à-pas et des laboratoires interactifs sécurisés.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartLesson(nextLesson.id)}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Continuer : {nextLesson.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onGoToLab('terminal')}
              className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Ouvrir le Cyber Lab</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative geometric background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Shield className="w-64 h-64 text-cyan-400" />
        </div>
      </div>

      {/* 4 KPIs Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Progression globale */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Progression MVP</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums font-mono">{completionPercentage}%</div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${completionPercentage}%` }} />
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            {completedLessonsCount} sur {totalLessons} leçons
          </div>
        </div>

        {/* KPI 2: Laboratoires validés */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Labs & Simulations</span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums font-mono">
            {progress.completedLabTasks.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Missions pratiques réussies
          </div>
          <button
            onClick={() => onGoToTab('labs')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold mt-1 block"
          >
            Accéder aux ateliers →
          </button>
        </div>

        {/* KPI 3: Temps d'apprentissage */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Temps d'apprentissage</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums font-mono">
            {progress.learningTimeMinutes} min
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Objectif hebdo : {progress.weeklyGoalCompletedMinutes}/{progress.weeklyGoalTargetMinutes} min
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Rythme régulier conseillé
          </div>
        </div>

        {/* KPI 4: Points d'expérience */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Compétences & XP</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums font-mono">
            {progress.xp} XP
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {progress.badges.length} badges débloqués
          </div>
          <button
            onClick={() => onGoToTab('skills')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold mt-1 block"
          >
            Voir la cartographie →
          </button>
        </div>
      </div>

      {/* Split Section: Next Lesson Card & Skills Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Lesson Spotlight (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">Étape Recommandée</span>
              <span>{nextLesson.durationMinutes} min de lecture</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {nextLesson.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {nextLesson.simplifiedExplanation.introduction}
            </p>

            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300 mb-4">
              <strong className="text-cyan-300 block mb-1">Objectif principal :</strong>
              <span>{nextLesson.measurableObjectives[0]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              Quiz et atelier guidé inclus
            </span>
            <button
              onClick={() => onStartLesson(nextLesson.id)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors"
            >
              <span>Lancer la leçon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skills Radar / Progress Bars (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Matrice de Compétences</span>
              </h3>
              <button
                onClick={() => onGoToTab('skills')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Détail
              </button>
            </div>

            <div className="space-y-3.5">
              {skillsList.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{skill.name}</span>
                    <span className="text-slate-400 tabular-nums">{skill.value}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/60">
                    <div
                      className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-400">
            Points validés par des quiz techniques et des manipulations réelles en laboratoire.
          </div>
        </div>
      </div>

      {/* Recent Badges Row */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Badges Pédagogiques Débloqués</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {progress.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{badge.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{badge.description}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1">Obtenu le {badge.earnedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
