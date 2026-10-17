import React from 'react';
import { Shield, BookOpen, Terminal, Award } from 'lucide-react';
import { TabKey } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: TabKey) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight mb-1">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Cyber Academy</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Plateforme francophone d'apprentissage pratique de la cybersécurité. De l'initiation sans prérequis jusqu'à la préparation des métiers juniors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400">
          <button onClick={() => onSelectTab('dashboard')} className="hover:text-white transition-colors">
            Tableau de bord
          </button>
          <button onClick={() => onSelectTab('paths')} className="hover:text-white transition-colors">
            Parcours
          </button>
          <button onClick={() => onSelectTab('lessons')} className="hover:text-white transition-colors">
            Leçons
          </button>
          <button onClick={() => onSelectTab('labs')} className="hover:text-white transition-colors">
            Cyber Lab
          </button>
          <button onClick={() => onSelectTab('skills')} className="hover:text-white transition-colors">
            Portfolio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 font-mono">
        <div>
          © 2026 Cyber Academy. Tous les environnements d'exercice sont strictement isolés et simulés.
        </div>
        <div>
          Conforme aux standards pédagogiques EdTech & WCAG AA
        </div>
      </div>
    </footer>
  );
};
