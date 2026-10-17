import React, { useState } from 'react';
import {
  Award,
  Download,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useProgress } from '../../shared/hooks/useProgress';
import { StorageService } from '../../core/services/storageService';

export const SkillsView: React.FC = () => {
  const progress = useProgress();
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(StorageService.exportPortfolioJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'cyber_academy_portfolio_cert.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const careerRoles = [
    {
      title: 'Analyste SOC Junior (Security Operations Center)',
      description: 'Surveillance des alertes SIEM, détection des anomalies de trafic et premier niveau de réponse à incident.',
      requiredSkills: [
        { label: 'Analyse de Menaces & Phishing', current: progress.skills.analyseMenaces, target: 70 },
        { label: 'Réseau TCP/IP & Protocoles', current: progress.skills.reseau, target: 65 },
        { label: 'Journaux Système Linux', current: progress.skills.terminal, target: 60 }
      ],
      certifications: 'CompTIA Security+, SC-200, BJT (Blue Team Junior)'
    },
    {
      title: 'Administrateur Système & Sécurité Junior',
      description: 'Durcissement des configurations, gestion rigoureuse des permissions et protection des accès.',
      requiredSkills: [
        { label: 'Système & OS', current: progress.skills.systeme, target: 80 },
        { label: 'Terminal & Administration Linux', current: progress.skills.terminal, target: 75 },
        { label: 'Défense & Politiques d\'accès', current: progress.skills.defense, target: 70 }
      ],
      certifications: 'Linux Professional Institute LPIC-1, RHCSA'
    },
    {
      title: 'Pentester Éthique Junior (Apprenti Auditeur)',
      description: 'Identification méthodique des vulnérabilités logiques et rédaction de rapports d\'évaluation autorisés.',
      requiredSkills: [
        { label: 'Réseaux & Inspection de paquets', current: progress.skills.reseau, target: 80 },
        { label: 'Maîtrise du Shell & Scripts', current: progress.skills.terminal, target: 75 },
        { label: 'Défense & Risques', current: progress.skills.defense, target: 70 }
      ],
      certifications: 'eJPTv2 (Junior Penetration Tester), CEH v13'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Compétences Démontrées & Portfolio Junior
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Relevé officiel des compétences validées lors des quiz et simulations pratiques
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Portfolio Téléchargé !' : 'Exporter mon Portfolio (JSON)'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Réinitialiser l'apprentissage"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-app Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-800/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-700 flex items-center justify-center text-rose-400 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-2">
              Confirmer la réinitialisation complète ?
            </h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
              Cette action remettra à zéro vos points d'XP, leçons validées, scores de quiz et badges. Cette opération est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  StorageService.resetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Oui, tout réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Detail Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
          Niveau d'aptitude technique par domaine
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-200 font-semibold">1. Architecture des Systèmes & OS</span>
              <span className="text-cyan-400 tabular-nums">{progress.skills.systeme}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${progress.skills.systeme}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Compréhension CPU, RAM, noyau OS et isolation mémoire des processus.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-200 font-semibold">2. Réseaux & Protocoles TCP/IP</span>
              <span className="text-sky-400 tabular-nums">{progress.skills.reseau}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${progress.skills.reseau}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Trajet d'un paquet, rôle des routeurs, ports de communication et filtrage pare-feu.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-200 font-semibold">3. Ligne de commande & Terminal Linux</span>
              <span className="text-emerald-400 tabular-nums">{progress.skills.terminal}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress.skills.terminal}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Navigation dans l'arborescence, manipulation de fichiers et droits octaux (chmod 600).
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-200 font-semibold">4. Défense & Sécurité Opérationnelle</span>
              <span className="text-amber-400 tabular-nums">{progress.skills.defense}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${progress.skills.defense}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Principe du moindre privilège, hygiène des mots de passe et sécurisation des configurations.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-200 font-semibold">5. Détection de Menaces & Phishing</span>
              <span className="text-rose-400 tabular-nums">{progress.skills.analyseMenaces}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${progress.skills.analyseMenaces}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Inspection des en-têtes SPF/DKIM, détection de faux domaines et ingénierie sociale.
            </p>
          </div>
        </div>
      </div>

      {/* Junior Career Path Matchmaker */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <span>Correspondance avec les Métiers Juniors du Secteur</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {careerRoles.map((role, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug">{role.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{role.description}</p>

                <div className="space-y-2 mb-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300">Compétences cibles :</div>
                  {role.requiredSkills.map((req, rIdx) => {
                    const isReached = req.current >= req.target;
                    return (
                      <div key={rIdx} className="text-xs">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-0.5">
                          <span className="truncate">{req.label}</span>
                          <span>{req.current}/{req.target}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isReached ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                            style={{ width: `${Math.min(100, (req.current / req.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400">Certifications repères : </span>
                {role.certifications}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Realistic Ethics & Pedagogy Note */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Engagement de transparence :</strong> Les pourcentages indiqués reflètent l'assimilation pédagogique des cours et ateliers pratiques de la Cyber Academy. Ils ne remplacent pas les années d'expérience en production ni les examens sous surveillance professionnelle.
        </p>
      </div>
    </div>
  );
};
