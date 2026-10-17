import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { INITIAL_QUIZZES, INITIAL_LESSONS } from '../../core/data/cyberData';
import { QuizRunner } from './QuizRunner';
import { useProgress } from '../../shared/hooks/useProgress';

export const QuizzesView: React.FC = () => {
  const progress = useProgress();
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const activeQuiz = INITIAL_QUIZZES.find((q) => q.id === activeQuizId);

  if (activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveQuizId(null)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            ← Retour à la liste des évaluations
          </button>
          <span className="text-xs text-slate-400 font-mono">{activeQuiz.title}</span>
        </div>
        <QuizRunner quiz={activeQuiz} onFinish={() => setActiveQuizId(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Quiz & Examens de Validation</h2>
        <p className="text-sm text-slate-400 mt-1">
          Évaluez vos acquis après chaque leçon pour ancrer les concepts et débloquer des points de compétence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_QUIZZES.map((quiz) => {
          const associatedLesson = INITIAL_LESSONS.find((l) => l.id === quiz.lessonId);
          const scoreData = progress.quizScores[quiz.id];
          const hasPassed = scoreData?.passed;

          return (
            <div
              key={quiz.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                hasPassed
                  ? 'bg-emerald-950/20 border-emerald-800/60 shadow-xs'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>{associatedLesson?.level || 'Débutant'}</span>
                  <span>{quiz.questions.length} questions</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{quiz.title}</h3>

                {associatedLesson && (
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    Validation liée à la leçon : "{associatedLesson.title}"
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-slate-400">Statut :</span>
                  {hasPassed ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Validé ({scoreData.score}%)</span>
                    </span>
                  ) : scoreData ? (
                    <span className="text-amber-400 font-semibold font-mono">
                      Échec ({scoreData.score}%)
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono">Non tenté</span>
                  )}
                </div>

                <button
                  onClick={() => setActiveQuizId(quiz.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    hasPassed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  }`}
                >
                  {hasPassed ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refaire l'évaluation</span>
                    </>
                  ) : (
                    <>
                      <span>Commencer le quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
