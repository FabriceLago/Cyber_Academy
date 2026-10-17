import React, { useState } from 'react';
import { Shield, Flame, Award, Database, Terminal, Volume2, VolumeX } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { AudioService } from '../../core/services/audioService';

export type TabKey = 'dashboard' | 'paths' | 'lessons' | 'labs' | 'quizzes' | 'skills';

interface NavbarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenSyncModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenSyncModal }) => {
  const progress = useProgress();
  const [isMuted, setIsMuted] = useState<boolean>(AudioService.isMuted());

  const navLinks: { key: TabKey; label: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord' },
    { key: 'paths', label: 'Parcours' },
    { key: 'lessons', label: 'Leçons' },
    { key: 'labs', label: 'Cyber Lab' },
    { key: 'quizzes', label: 'Quiz & Examens' },
    { key: 'skills', label: 'Compétences' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block">
              Cyber Academy
            </span>
            <span className="text-[11px] text-slate-400 block -mt-1 font-mono">
              Formation interactive
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.key;
            return (
              <button
                key={link.key}
                onClick={() => onSelectTab(link.key)}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap shrink-0 transition-colors focus:outline-none ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: XP, Audio Toggle & Database / Sync action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Flame className="w-4 h-4" />
              <span>{progress.streakDays}j série</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Award className="w-4 h-4" />
              <span>{progress.xp} XP</span>
            </span>
          </div>

          {/* Immersion Audio Sound Toggle */}
          <button
            onClick={() => {
              const muted = AudioService.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? 'Activer l\'ambiance sonore immersive' : 'Désactiver les sons'}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center ${
              !isMuted
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSyncModal}
            title={progress.supabaseConfig?.isConnected ? 'Supabase connecté' : 'Configurer Supabase / Sauvegarde'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors whitespace-nowrap shrink-0"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Supabase</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-900 gap-1 bg-slate-950">
        {navLinks.map((link) => (
          <button
            key={link.key}
            onClick={() => onSelectTab(link.key)}
            className={`px-2.5 py-1 text-xs whitespace-nowrap shrink-0 rounded ${
              currentTab === link.key ? 'text-cyan-400 bg-slate-900 font-medium' : 'text-slate-400'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
