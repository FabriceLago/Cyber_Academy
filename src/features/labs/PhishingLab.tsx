import React, { useState } from 'react';
import { Mail, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Search, FileText, Send, Eye } from 'lucide-react';
import { PHISHING_EMAILS } from '../../core/data/cyberData';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';

export const PhishingLab: React.FC = () => {
  const progress = useProgress();
  const [selectedMailId, setSelectedMailId] = useState<string>(PHISHING_EMAILS[0].id);
  const [viewMode, setViewMode] = useState<'message' | 'headers'>('message');
  const [verdicts, setVerdicts] = useState<Record<string, { choice: boolean; submitted: boolean; isSuccess: boolean }>>({});
  const [selectedVerdict, setSelectedVerdict] = useState<'legit' | 'phish' | null>(null);

  const currentEmail = PHISHING_EMAILS.find((m) => m.id === selectedMailId) || PHISHING_EMAILS[0];
  const verdictState = verdicts[currentEmail.id];

  const handleSubmitVerdict = () => {
    if (!selectedVerdict) return;

    const isPhishChoice = selectedVerdict === 'phish';
    const isSuccess = isPhishChoice === currentEmail.isPhishing;

    setVerdicts((prev) => ({
      ...prev,
      [currentEmail.id]: {
        choice: isPhishChoice,
        submitted: true,
        isSuccess
      }
    }));

    if (isSuccess) {
      StorageService.recordLabTaskComplete(`phish-${currentEmail.id}`, 'analyseMenaces');
    }
  };

  const completedCount = Object.values(verdicts).filter((v) => v.submitted && v.isSuccess).length;

  return (
    <div className="space-y-6">
      {/* Lab Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Laboratoire d'Investigation : Triage & Détection d'Hameçonnage</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Analysez les courriels suspects, examinez leurs en-têtes techniques (SPF/DKIM) et portez un verdict motivé.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-300">
            <span>Analyses validées : {completedCount}/{PHISHING_EMAILS.length}</span>
          </div>
        </div>
      </div>

      {/* Mail Client Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-[520px]">
        {/* Email Sidebar List */}
        <div className="lg:col-span-4 border-r border-slate-800 bg-slate-900/60 divide-y divide-slate-800/80">
          <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Boîte de réception (4 messages)</span>
            <Search className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {PHISHING_EMAILS.map((mail) => {
            const isSelected = mail.id === currentEmail.id;
            const res = verdicts[mail.id];

            return (
              <button
                key={mail.id}
                onClick={() => {
                  setSelectedMailId(mail.id);
                  setViewMode('message');
                  setSelectedVerdict(null);
                }}
                className={`w-full text-left p-3.5 transition-colors focus:outline-none ${
                  isSelected ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200 truncate max-w-[170px]">{mail.senderName}</span>
                  <span className="text-[10px] text-slate-500">{mail.date}</span>
                </div>
                <div className="text-xs font-medium text-slate-300 truncate mb-1">{mail.subject}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[180px]">{mail.senderEmail}</span>
                  {res?.submitted && (
                    <span className="shrink-0">
                      {res.isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Email Content Viewer */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
          <div>
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">{currentEmail.subject}</h4>
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                  <span>De : <strong className="text-slate-200">{currentEmail.senderName}</strong> &lt;{currentEmail.senderEmail}&gt;</span>
                  <span className="text-slate-600">·</span>
                  <span>À : {currentEmail.recipient}</span>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('message')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                    viewMode === 'message' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu</span>
                </button>
                <button
                  onClick={() => setViewMode('headers')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                    viewMode === 'headers' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>En-têtes bruts</span>
                </button>
              </div>
            </div>

            {/* Content view switch */}
            {viewMode === 'message' ? (
              <div className="py-4 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-900 mt-4">
                {currentEmail.body}
              </div>
            ) : (
              <div className="py-4 font-mono text-xs text-slate-300 bg-slate-900/80 p-4 rounded-lg border border-slate-800 mt-4 space-y-2">
                <div className="text-cyan-400 font-semibold border-b border-slate-800 pb-1 mb-2">
                  EN-TÊTES DE TRANSPORT SMTP
                </div>
                <div><span className="text-slate-500">Return-Path:</span> <span className="text-amber-300">{currentEmail.headers.returnPath}</span></div>
                <div><span className="text-slate-500">Received-From:</span> {currentEmail.headers.receivedFrom}</div>
                <div>
                  <span className="text-slate-500">SPF Validation:</span>{' '}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentEmail.headers.spf === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentEmail.headers.spf}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">DKIM Signature:</span>{' '}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentEmail.headers.dkim === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentEmail.headers.dkim}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">DMARC Policy:</span>{' '}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentEmail.headers.dmarc === 'PASS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {currentEmail.headers.dmarc}
                  </span>
                </div>
                {currentEmail.headers.replyTo && (
                  <div><span className="text-slate-500">Reply-To (Détourné):</span> <span className="text-rose-400">{currentEmail.headers.replyTo}</span></div>
                )}
              </div>
            )}
          </div>

          {/* Verdict Submission Panel */}
          <div className="pt-4 border-t border-slate-800">
            {verdictState?.submitted ? (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  verdictState.isSuccess
                    ? 'bg-emerald-950/30 border-emerald-700/80'
                    : 'bg-rose-950/30 border-rose-800/80'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1.5">
                  {verdictState.isSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 text-sm">Verdict Correct ! (+75 XP attribués)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-300 text-sm">Erreur d'analyse</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">{currentEmail.explanation}</p>
                {currentEmail.indicators.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-semibold block text-[11px]">Indices de compromission décelés :</span>
                    {currentEmail.indicators.map((ind, i) => (
                      <div key={i} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                        <span className="text-cyan-400 font-mono">·</span>
                        <span>{ind.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block mb-0.5">Votre verdict d'analyste de sécurité :</span>
                  <span>Ce message est-il légitime ou constitue-t-il une menace de phishing ?</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedVerdict('legit')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                      selectedVerdict === 'legit'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Légitime</span>
                  </button>

                  <button
                    onClick={() => setSelectedVerdict('phish')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                      selectedVerdict === 'phish'
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Hameçonnage</span>
                  </button>

                  <button
                    onClick={handleSubmitVerdict}
                    disabled={!selectedVerdict}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Valider le diagnostic
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
