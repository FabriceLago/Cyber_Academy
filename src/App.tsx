import React, { useState } from 'react';
import { Navbar, TabKey } from './shared/components/Navbar';
import { Footer } from './shared/components/Footer';
import { CyberBackground } from './shared/components/CyberBackground';
import { SupabaseModal } from './shared/components/SupabaseModal';
import { DashboardView } from './features/dashboard/DashboardView';
import { LearningPathsView } from './features/learning-paths/LearningPathsView';
import { LessonsCatalogView } from './features/lessons/LessonsCatalogView';
import { LessonReaderView } from './features/lessons/LessonReaderView';
import { CyberLabView } from './features/labs/CyberLabView';
import { QuizzesView } from './features/quizzes/QuizzesView';
import { FlashcardsView } from './features/flashcards/FlashcardsView';
import { SkillsView } from './features/skills/SkillsView';
import { INITIAL_LESSONS } from './core/data/cyberData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentTab('lessons');
  };

  const handleGoToLab = (_labType: 'terminal' | 'phishing' | 'network') => {
    setCurrentTab('labs');
  };

  const handleSelectTab = (tab: TabKey) => {
    setCurrentTab(tab);
    if (tab === 'lessons' && !activeLessonId) {
      // By default when opening lessons, we can show catalog or the first lesson
      setActiveLessonId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
      {/* Ambient Interactive Cyber Constellation Background */}
      <CyberBackground />

      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {currentTab === 'dashboard' && (
          <DashboardView
            onStartLesson={handleStartLesson}
            onGoToLab={handleGoToLab}
            onGoToTab={handleSelectTab}
          />
        )}

        {currentTab === 'paths' && (
          <LearningPathsView
            onSelectPathLesson={handleStartLesson}
            onGoToLab={handleGoToLab}
          />
        )}

        {currentTab === 'lessons' && (
          <>
            {activeLessonId ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <button
                    onClick={() => setActiveLessonId(null)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    ← Revenir au catalogue des leçons
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    Mode lecture & pratique
                  </span>
                </div>
                <LessonReaderView
                  lessonId={activeLessonId}
                  onSelectLesson={(id) => setActiveLessonId(id)}
                  onGoToLab={handleGoToLab}
                />
              </div>
            ) : (
              <LessonsCatalogView onSelectLesson={(id) => setActiveLessonId(id)} />
            )}
          </>
        )}

        {currentTab === 'labs' && <CyberLabView />}

        {currentTab === 'quizzes' && <QuizzesView />}

        {currentTab === 'flashcards' && <FlashcardsView />}

        {currentTab === 'skills' && <SkillsView />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Supabase connection configuration modal */}
      <SupabaseModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
}
