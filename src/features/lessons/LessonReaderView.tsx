import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Terminal,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Cpu,
  Mail,
  Award
} from 'lucide-react';
import { Lesson, Quiz } from '../../core/types/cyber.types';
import { INITIAL_LESSONS, INITIAL_QUIZZES } from '../../core/data/cyberData';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';
import { NetworkPacketAnimation } from '../simulations/NetworkPacketAnimation';
import { QuizRunner } from '../quizzes/QuizRunner';

interface LessonReaderViewProps {
  lessonId: string;
  onSelectLesson: (id: string) => void;
  onGoToLab: (labType: 'terminal' | 'phishing' | 'network') => void;
}

export const LessonReaderView: React.FC<LessonReaderViewProps> = ({
  lessonId,
  onSelectLesson,
  onGoToLab
}) => {
  const progress = useProgress();
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  const lesson: Lesson = INITIAL_LESSONS.find((l) => l.id === lessonId) || INITIAL_LESSONS[0];
  const associatedQuiz: Quiz | undefined = INITIAL_QUIZZES.find((q) => q.id === lesson.quizId);

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const quizScore = associatedQuiz ? progress.quizScores[associatedQuiz.id] : undefined;

  const currentIndex = INITIAL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? INITIAL_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < INITIAL_LESSONS.length - 1 ? INITIAL_LESSONS[currentIndex + 1] : null;

  const handleMarkAsCompleted = () => {
    StorageService.markLessonComplete(lesson.id);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1 & 2: Header & Clean Unboxed Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mb-3">
          <span className="text-cyan-400 font-semibold">{lesson.level}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.durationMinutes} minutes</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Leçon {lesson.order} sur {INITIAL_LESSONS.length}</span>
          {isCompleted && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validée</span>
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
          {lesson.title}
        </h1>

        {/* 3: Prérequis */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span className="text-slate-500 font-semibold">Prérequis :</span>
          {lesson.prerequisites.map((p, i) => (
            <span key={i} className="text-slate-300">
              {p}{i < lesson.prerequisites.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* 4: Objectifs Pédagogiques Mesurables */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Objectifs pédagogiques mesurables</span>
        </h2>
        <ul className="space-y-2">
          {lesson.measurableObjectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5: Explication Accessible & Métaphore */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Introduction au concept</h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {lesson.simplifiedExplanation.introduction}
          </p>
        </div>

        {/* Analogie concrète */}
        <div className="bg-cyan-950/20 border border-cyan-900/60 rounded-xl p-5 text-xs sm:text-sm text-cyan-100">
          <div className="font-bold text-cyan-300 mb-1 flex items-center gap-2 font-mono">
            <span>MÉTAPHORE DU MONDE RÉEL</span>
          </div>
          <p className="leading-relaxed text-slate-200">{lesson.simplifiedExplanation.analogy}</p>
        </div>

        {/* Notions Clés Développées */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-white">Fondements techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.simplifiedExplanation.coreConcepts.map((concept, i) => (
              <div key={i} className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
                <h4 className="text-sm font-semibold text-cyan-300 mb-1.5">{concept.heading}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{concept.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6: Glossaire Interactif des Nouveaux Termes */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Glossaire interactif des termes clés</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.glossary.map((term, i) => {
            const isOpened = activeGlossaryTerm === term.term;
            return (
              <div
                key={i}
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs transition-colors hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{term.term}</span>
                  <button
                    onClick={() => setActiveGlossaryTerm(isOpened ? null : term.term)}
                    className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono"
                  >
                    {isOpened ? 'Réduire' : 'Exemple'}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed mb-2">{term.definition}</p>
                {isOpened && (
                  <div className="pt-2 border-t border-slate-800 font-mono text-[11px] text-cyan-300">
                    <span className="text-slate-500 font-semibold">Exemple : </span>
                    {term.example}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7: Cas Pratique / Exemple Concret */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono mb-3">
          Cas concret d'entreprise
        </h2>
        <div className="space-y-3 text-xs sm:text-sm">
          <div>
            <strong className="text-white block mb-1">Scénario :</strong>
            <p className="text-slate-300 leading-relaxed">{lesson.concreteExample.scenario}</p>
          </div>
          <div>
            <strong className="text-white block mb-1">Analyse de sécurité :</strong>
            <p className="text-slate-300 leading-relaxed">{lesson.concreteExample.explanation}</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 text-xs">
            <strong>Règle de l'analyste :</strong> {lesson.concreteExample.takeaway}
          </div>
        </div>
      </section>

      {/* 8: Animation Interactive ou Démonstration Visuelle */}
      {lesson.visualDemoType === 'network-packet' && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
            Démonstration interactive intégrée
          </h2>
          <NetworkPacketAnimation />
        </section>
      )}

      {/* 9: Exercice Guidé */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
          Exercice pratique guidé
        </h2>
        <h3 className="text-base font-bold text-white">{lesson.guidedExercise.title}</h3>
        <ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-300">
          {lesson.guidedExercise.instructions.map((inst, i) => (
            <li key={i} className="leading-relaxed">{inst}</li>
          ))}
        </ol>

        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-amber-300">
          <strong>Conseil :</strong> {lesson.guidedExercise.hint}
        </div>

        <div>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{showSolution ? 'Masquer la solution' : 'Afficher la solution expliquée'}</span>
            {showSolution ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showSolution && (
            <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300">
              {lesson.guidedExercise.solution}
            </div>
          )}
        </div>
      </section>

      {/* 10: Laboratoire Pratique Associé (Bouton d'accès direct) */}
      {lesson.associatedLabId && (
        <section className="bg-cyan-950/20 border border-cyan-800/80 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Pratiquez cette leçon dans le Cyber Lab</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Accédez au simulateur pour tester ces commandes sur des données réelles
            </p>
          </div>
          <button
            onClick={() => onGoToLab(lesson.associatedLabId === 'lab-terminal' ? 'terminal' : 'phishing')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Lancer la simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 11 & 12: Quiz de Validation Intégré */}
      {associatedQuiz && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Quiz de validation de la leçon</span>
            </h2>
            {quizScore?.passed && (
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Note actuelle : {quizScore.score}%
              </span>
            )}
          </div>
          <QuizRunner
            quiz={associatedQuiz}
            onFinish={() => {
              if (quizScore?.passed || !isCompleted) {
                handleMarkAsCompleted();
              }
            }}
          />
        </section>
      )}

      {/* 13: Résumé Clé */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3">
          Points clés à retenir
        </h2>
        <ul className="space-y-2">
          {lesson.summaryPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
              <span className="text-cyan-400 font-bold">·</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 14: Critères de Réussite */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3">
          Critères de réussite de la leçon
        </h2>
        <ul className="space-y-2">
          {lesson.successCriteria.map((crit, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{crit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 15 & 16: Barre d'action finale (Recommencer & Suivant) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-950 border border-slate-800 rounded-xl">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leçon précédente : {prevLesson.title}</span>
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {!isCompleted ? (
            <button
              onClick={handleMarkAsCompleted}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Marquer comme terminée
            </button>
          ) : (
            <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Complétée</span>
            </span>
          )}

          {nextLesson && (
            <button
              onClick={() => onSelectLesson(nextLesson.id)}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Leçon suivante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
