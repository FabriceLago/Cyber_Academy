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
  const [securityError, setSecurityError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateSupabaseConfig = (inputUrl: string, inputKey: string): string | null => {
    const trimmedUrl = inputUrl.trim();
    const trimmedKey = inputKey.trim();

    if (!trimmedUrl && !trimmedKey) return null; // Allowing empty to clear config

    // Check URL scheme
    if (trimmedUrl) {
      if (!trimmedUrl.startsWith('https://')) {
        return 'Vulnérabilité de transport : L\'URL doit impérativement utiliser le protocole HTTPS sécurisé (https://). Les protocoles non chiffrés ou pseudo-protocoles sont bloqués.';
      }
      try {
        const parsed = new URL(trimmedUrl);
        if (parsed.protocol !== 'https:') {
          return 'Protocole non sécurisé détecté.';
        }
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
          return 'Avertissement SSRF : L\'accès aux interfaces de bouclage local (localhost/127.0.0.1) est restreint.';
        }
      } catch {
        return 'Format d\'URL invalide. Exemple attendu : https://votre-projet.supabase.co';
      }
    }

    // Inspect JWT Key for critical Service Role leakage (CWE-200 / CWE-250)
    if (trimmedKey) {
      const parts = trimmedKey.split('.');
      if (parts.length === 3) {
        try {
          const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
          const decoded = JSON.parse(payloadJson);
          if (decoded.role === 'service_role') {
            return '🚨 VULNÉRABILITÉ CRITIQUE (CWE-200 / CWE-250) : Vous avez fourni une clé "service_role" ! Cette clé secrète outrepasse le Row Level Security (RLS) et confère les droits administrateur racine. Ne fournissez JAMAIS une clé service_role dans un navigateur client. Utilisez exclusivement la clé "anon" (publique).';
          }
        } catch {
          // If not standard JWT format, continue
        }
      }
    }

    return null;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    const error = validateSupabaseConfig(url, anonKey);
    if (error) {
      setSecurityError(error);
      return;
    }

    StorageService.setSupabaseConfig(url.trim(), anonKey.trim());
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

          {securityError && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-500/80 rounded-lg text-xs text-rose-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{securityError}</div>
            </div>
          )}

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
