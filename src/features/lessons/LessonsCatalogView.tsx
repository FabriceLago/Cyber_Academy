import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_LESSONS } from '../../core/data/cyberData';
import { useProgress } from '../../shared/hooks/useProgress';

interface LessonsCatalogViewProps {
  onSelectLesson: (lessonId: string) => void;
}

export const LessonsCatalogView: React.FC<LessonsCatalogViewProps> = ({ onSelectLesson }) => {
  const progress = useProgress();
  const [filterLevel, setFilterLevel] = useState<'all' | 'Débutant'>('all');

  const filteredLessons = INITIAL_LESSONS.filter((lesson) => {
    if (filterLevel === 'all') return true;
    return lesson.level === filterLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Catalogue des Leçons</h2>
          <p className="text-sm text-slate-400 mt-1">
            Cours pas-à-pas illustrés, métaphores pédagogiques, exercices guidés et quiz
          </p>
        </div>

        {/* Level filter segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'all'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes les leçons ({INITIAL_LESSONS.length})
          </button>
          <button
            onClick={() => setFilterLevel('Débutant')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterLevel === 'Débutant'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Niveau Débutant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const quizResult = progress.quizScores[lesson.quizId];

          return (
            <div
              key={lesson.id}
              className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
                isCompleted
                  ? 'bg-slate-900/90 border-slate-800 shadow-xs'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
                  <span className="text-cyan-400 font-medium">{lesson.level}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{lesson.durationMinutes} min</span>
                  </span>
                  {isCompleted && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Validé</span>
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {lesson.simplifiedExplanation.introduction}
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Analogie : {lesson.simplifiedExplanation.analogy.substring(0, 50)}...</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  {quizResult?.passed ? `Score quiz : ${quizResult.score}%` : 'Quiz inclus'}
                </span>

                <button
                  onClick={() => onSelectLesson(lesson.id)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors"
                >
                  <span>{isCompleted ? 'Revoir la leçon' : 'Commencer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
