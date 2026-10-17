import React from 'react';
import { Shield, CheckCircle2, Lock, ArrowRight, Clock, BookOpen, Terminal } from 'lucide-react';
import { LEARNING_PATHS } from '../../core/data/cyberData';
import { useProgress } from '../../shared/hooks/useProgress';

interface LearningPathsViewProps {
  onSelectPathLesson: (lessonId: string) => void;
  onGoToLab: (labType: 'terminal' | 'phishing' | 'network') => void;
}

export const LearningPathsView: React.FC<LearningPathsViewProps> = ({
  onSelectPathLesson,
  onGoToLab
}) => {
  const progress = useProgress();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Parcours Pédagogique : De Zéro à Professionnel
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Un cursus structuré en 9 étapes pour franchir progressivement le cap, depuis la découverte du terminal
          jusqu'aux compétences attendues pour des postes juniors de la filière cybersécurité.
        </p>
      </div>

      <div className="space-y-4">
        {LEARNING_PATHS.map((path) => {
          const isAvailable = path.isAvailable;
          const hasCompletedSome = path.modules.some((m) =>
            m.lessons.some((l) => progress.completedLessons.includes(l.id))
          );

          return (
            <div
              key={path.id}
              className={`p-6 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Path Info */}
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-cyan-400 font-bold">Niveau {path.levelNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{path.durationHours}h estimées</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{path.modulesCount} modules</span>
                    <span aria-hidden="true">·</span>
                    <span>{path.labsCount} lab{path.labsCount > 1 ? 's' : ''}</span>
                    <span aria-hidden="true">·</span>
                    <span className={isAvailable ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {isAvailable ? 'Parcours actif (MVP)' : 'Programme documenté'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{path.title}</span>
                    {!isAvailable && <Lock className="w-4 h-4 text-slate-600 shrink-0" />}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {path.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {path.description}
                  </p>

                  {/* Lessons list if available */}
                  {isAvailable && path.modules.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                      {path.modules[0].lessons.map((lesson) => {
                        const isDone = progress.completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectPathLesson(lesson.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                              isDone
                                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/40'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500 hover:text-white'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                            <span className="truncate max-w-[220px]">{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {isAvailable ? (
                    <button
                      onClick={() => {
                        if (path.modules[0]?.lessons[0]) {
                          onSelectPathLesson(path.modules[0].lessons[0].id);
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <span>{hasCompletedSome ? 'Reprendre le parcours' : 'Commencer le parcours'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : path.id === 'path-5' ? (
                    <button
                      onClick={() => onGoToLab('siem' as any)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <span>Accéder au Lab SIEM</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : path.id === 'path-6' ? (
                    <button
                      onClick={() => onGoToLab('owasp' as any)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <span>Accéder au Bac à Sable OWASP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Niveaux suivants</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
