import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, AlertCircle } from 'lucide-react';
import { Quiz } from '../../core/types/cyber.types';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';
import { AudioService } from '../../core/services/audioService';

interface QuizRunnerProps {
  quiz: Quiz;
  onFinish?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onFinish }) => {
  const progress = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
    AudioService.playBlip();
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOptionId
    }));

    const chosen = currentQuestion.options.find((opt) => opt.id === selectedOptionId);
    if (chosen?.isCorrect) {
      AudioService.playSuccess();
    } else {
      AudioService.playAlert();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let correctCount = 0;
      quiz.questions.forEach((q) => {
        const userChoice = userAnswers[q.id] || selectedOptionId;
        const correctOpt = q.options.find((opt) => opt.isCorrect);
        if (correctOpt && userChoice === correctOpt.id) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / totalQuestions) * 100);
      const passed = finalScore >= quiz.passingScore;

      StorageService.recordQuizScore(quiz.id, finalScore, passed);
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  // If completed, show scorecard
  if (isQuizCompleted) {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const userChoice = userAnswers[q.id];
      const correctOpt = q.options.find((opt) => opt.isCorrect);
      if (correctOpt && userChoice === correctOpt.id) correctCount++;
    });
    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = finalScore >= quiz.passingScore;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 text-slate-100 max-w-2xl mx-auto shadow-2xl">
        <div className="text-center space-y-4">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {passed ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">
              {passed ? 'Quiz Validé avec Succès !' : 'Score insuffisant pour validation'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {passed
                ? 'Félicitations, vous avez démontré la maîtrise des objectifs pédagogiques.'
                : `Le seuil requis est de ${quiz.passingScore}%. Révisez la leçon et réessayez !`}
            </p>
          </div>

          {/* Score display */}
          <div className="py-4 px-6 bg-slate-950 rounded-xl border border-slate-800 inline-block font-mono">
            <div className="text-3xl font-extrabold text-cyan-400 tabular-nums">{finalScore}%</div>
            <div className="text-xs text-slate-400 mt-1">
              {correctCount} sur {totalQuestions} réponses correctes
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer le quiz</span>
            </button>

            {onFinish && (
              <button
                onClick={onFinish}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors"
              >
                <span>Retour à la leçon</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const selectedOptObj = currentQuestion.options.find((opt) => opt.id === selectedOptionId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 text-slate-100 shadow-xl max-w-3xl mx-auto">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
        <span className="text-xs font-mono text-cyan-400">
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </span>
        <span className="text-xs text-slate-400 font-mono">
          Objectif de validation : {quiz.passingScore}%
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base sm:text-lg font-semibold text-white leading-snug mb-5">
        {currentQuestion.question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          let optionStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

          if (isAnswerSubmitted) {
            if (option.isCorrect) {
              optionStyle = 'bg-emerald-950/30 border-emerald-600 text-emerald-200';
            } else if (isSelected && !option.isCorrect) {
              optionStyle = 'bg-rose-950/30 border-rose-600 text-rose-200';
            } else {
              optionStyle = 'bg-slate-950/40 border-slate-900 opacity-50 text-slate-400';
            }
          } else if (isSelected) {
            optionStyle = 'bg-cyan-950/40 border-cyan-400 text-white';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 focus:outline-none ${optionStyle}`}
            >
              <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-xs mt-0.5">
                {isAnswerSubmitted && option.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isAnswerSubmitted && isSelected && !option.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                {!isAnswerSubmitted && isSelected && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
              </span>
              <span className="leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Explanation upon submission */}
      {isAnswerSubmitted && selectedOptObj && (
        <div
          className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed transition-colors ${
            selectedOptObj.isCorrect
              ? 'bg-emerald-950/20 border-emerald-800/80 text-emerald-200'
              : 'bg-rose-950/20 border-rose-800/80 text-rose-200'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
            {selectedOptObj.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Excellente réponse !</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Ce n'est pas tout à fait cela</span>
              </>
            )}
          </div>
          <p className="text-slate-300 mb-2">{selectedOptObj.explanation}</p>
          <div className="text-slate-400 pt-2 border-t border-slate-800/60 font-sans text-[11px]">
            <strong className="text-slate-300">Point clé :</strong> {currentQuestion.explanation}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-[11px] text-slate-500 font-mono">
          Pas de pénalité en cas d'erreur · Apprentissage guidé
        </span>

        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOptionId}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmer ma réponse
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors"
          >
            <span>{currentQuestionIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir les résultats'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
