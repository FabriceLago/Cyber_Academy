import React, { useState } from 'react';
import { X, Database, CheckCircle2, ShieldAlert, Key, Globe } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { StorageService } from '../../core/services/storageService';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const progress = useProgress();
  const [url, setUrl] = useState<string>(progress.supabaseConfig?.url || '');
  const [anonKey, setAnonKey] = useState<string>(progress.supabaseConfig?.anonKey || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.setSupabaseConfig(url, anonKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-cyan-400 mb-2 font-mono text-xs">
          <Database className="w-4 h-4" />
          <span>SYNCHRONISATION BASE DE DONNÉES</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Connexion Supabase & PostgreSQL
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          La plateforme fonctionne actuellement en mode persistant local (<code className="text-cyan-300">localStorage</code>). Vous pouvez brancher votre instance Supabase pour synchroniser la progression multi-appareils.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>URL du Projet Supabase (VITE_SUPABASE_URL)</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzproject.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clé Publique Anonyme (anon / public)</span>
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Tables PostgreSQL prévues :</span>
            <div className="font-mono text-cyan-300/80 text-[10px]">
              profiles, learning_paths, modules, lessons, quizzes, quiz_attempts, user_lesson_progress, lab_attempts
            </div>
            <div className="text-slate-500 text-[10px]">
              Sécurité RLS (Row Level Security) activée : les données utilisateur restent strictement cloisonnées.
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              {progress.supabaseConfig?.isConnected ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connecté
                </span>
              ) : (
                'Mode local actif'
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
              >
                {saveSuccess ? 'Enregistré !' : 'Enregistrer la configuration'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
