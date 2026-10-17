import React, { useState } from 'react';
import {
  Globe,
  Code2,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Key
} from 'lucide-react';
import { AudioService } from '../../core/services/audioService';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';

export const OwaspLab: React.FC = () => {
  const progress = useProgress();
  const [activeModule, setActiveModule] = useState<'sqli' | 'xss'>('sqli');

  // SQL Injection Sandbox State
  const [sqlUsername, setSqlUsername] = useState<string>('admin\' OR \'1\'=\'1');
  const [sqlPassword, setSqlPassword] = useState<string>('password123');
  const [isSqlSecureMode, setIsSqlSecureMode] = useState<boolean>(false);
  const [sqlLoginResult, setSqlLoginResult] = useState<{
    attempted: boolean;
    success: boolean;
    userLoggedIn?: string;
    role?: string;
    message: string;
  } | null>(null);

  // XSS Sandbox State
  const [xssAuthor, setXssAuthor] = useState<string>('Alice');
  const [xssComment, setXssComment] = useState<string>('<script>alert("Cookie volé : session_token=xyz998877")</script>');
  const [isXssSecureMode, setIsXssSecureMode] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<
    { id: string; author: string; content: string; isExecuted: boolean; date: string }[]
  >([
    {
      id: 'c-1',
      author: 'Support',
      content: 'Bienvenue sur le livre d\'or des retours clients de Cyber Academy !',
      isExecuted: false,
      date: '10:00'
    }
  ]);
  const [xssAlertTriggered, setXssAlertTriggered] = useState<string | null>(null);

  // Compute live SQL query
  const rawSqlQuery = `SELECT id, username, email, role \nFROM users \nWHERE username = '${sqlUsername}' AND password = '${sqlPassword}';`;
  const preparedSqlQuery = `PREPARE stmt FROM \n  'SELECT id, username, email, role FROM users WHERE username = ? AND password = ?';\nEXECUTE stmt USING ('${sqlUsername.replace(/'/g, "\\'")}', '***');`;

  const handleSqlLogin = (e: React.FormEvent) => {
    e.preventDefault();
    AudioService.playKeypress();

    if (isSqlSecureMode) {
      // In secure mode, username is compared literally
      if (sqlUsername === 'admin' && sqlPassword === 'AdminPass2026!') {
        AudioService.playSuccess();
        setSqlLoginResult({
          attempted: true,
          success: true,
          userLoggedIn: 'admin',
          role: 'Administrateur',
          message: 'Connexion légitime réussie.'
        });
      } else {
        AudioService.playAlert();
        setSqlLoginResult({
          attempted: true,
          success: false,
          message: 'Identifiants invalides : la requête préparée a neutralisé l\'injection. Le payload est traité comme une simple chaîne littérale.'
        });
        StorageService.recordLabTaskComplete('task-sqli-defense', 'defense');
      }
    } else {
      // Vulnerable mode logic
      const isBypassed =
        sqlUsername.includes("' OR '1'='1") ||
        sqlUsername.includes("' OR 1=1") ||
        sqlUsername.includes("' or '1'='1") ||
        sqlUsername.includes("' or 1=1") ||
        sqlUsername.includes("admin'--");

      if (isBypassed) {
        AudioService.playSuccess();
        setSqlLoginResult({
          attempted: true,
          success: true,
          userLoggedIn: 'admin',
          role: 'Super Administrateur (Privilèges Max)',
          message: 'INJECTION RÉUSSIE : L\'expression logique "OR \'1\'=\'1\'" a forcé la condition à VRAI pour la première ligne de la table !'
        });
        StorageService.recordLabTaskComplete('task-sqli-exploit', 'defense');
      } else {
        AudioService.playAlert();
        setSqlLoginResult({
          attempted: true,
          success: false,
          message: 'Échec de connexion : nom d\'utilisateur ou mot de passe erroné.'
        });
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xssComment.trim()) return;
    AudioService.playKeypress();

    const hasMaliciousScript =
      xssComment.includes('<script>') ||
      xssComment.includes('onerror=') ||
      xssComment.includes('onload=') ||
      xssComment.includes('javascript:');

    if (hasMaliciousScript && !isXssSecureMode) {
      AudioService.playAlert();
      setXssAlertTriggered('ALERTE XSS : Un script JavaScript injecté vient de s\'exécuter dans le contexte du navigateur !');
      StorageService.recordLabTaskComplete('task-xss-exploit', 'defense');
    } else if (hasMaliciousScript && isXssSecureMode) {
      AudioService.playSuccess();
      setXssAlertTriggered(null);
      StorageService.recordLabTaskComplete('task-xss-defense', 'defense');
    } else {
      setXssAlertTriggered(null);
    }

    setCommentsList((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: xssAuthor || 'Anonyme',
        content: xssComment,
        isExecuted: hasMaliciousScript && !isXssSecureMode,
        date: new Date().toLocaleTimeString().substring(0, 5)
      }
    ]);

    setXssComment('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Bac à Sable OWASP Top 10 — Sécurité Web & Vulnérabilités Logiques</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Testez et observez en direct le mécanisme d'exploitation et la remédiation du Top 10 OWASP.
            </p>
          </div>

          {/* Module Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => {
                setActiveModule('sqli');
                AudioService.playBlip();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeModule === 'sqli'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Injection SQL (SQLi)
            </button>
            <button
              onClick={() => {
                setActiveModule('xss');
                AudioService.playBlip();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeModule === 'xss'
                  ? 'bg-cyan-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Cross-Site Scripting (XSS)
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 1: SQL INJECTION (SQLi) */}
      {activeModule === 'sqli' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Simulated Web Login Form */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Portail Web Simulé
                </span>
                {/* Security Mode Toggle */}
                <button
                  onClick={() => {
                    setIsSqlSecureMode(!isSqlSecureMode);
                    setSqlLoginResult(null);
                    AudioService.playBlip();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                    isSqlSecureMode
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-600 text-rose-300'
                  }`}
                >
                  {isSqlSecureMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isSqlSecureMode ? 'Mode Sécurisé (PDO)' : 'Mode Vulnérable'}</span>
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">Authentification Portail Entreprise</h4>
              <p className="text-xs text-slate-400 mb-4">
                Tentez de vous connecter en tant qu'administrateur sans connaître son mot de passe.
              </p>

              <form onSubmit={handleSqlLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom d'utilisateur (Identifiant)
                  </label>
                  <input
                    type="text"
                    value={sqlUsername}
                    onChange={(e) => setSqlUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    placeholder="ex: admin"
                  />
                  {/* Quick payloads */}
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="text-slate-500">Payloads :</span>
                    {[
                      "admin' OR '1'='1",
                      "' OR 1=1 --",
                      "admin'--",
                      "guest"
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setSqlUsername(p);
                          AudioService.playKeypress();
                        }}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-mono text-[10px]"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={sqlPassword}
                    onChange={(e) => setSqlPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-xs"
                >
                  Tester la connexion
                </button>
              </form>
            </div>

            {/* Login Attempt Result Box */}
            {sqlLoginResult && (
              <div
                className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed transition-colors ${
                  sqlLoginResult.success
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                  {sqlLoginResult.success ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Bypass d'Authentification Réussi !</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Accès Refusé</span>
                    </>
                  )}
                </div>
                {sqlLoginResult.userLoggedIn && (
                  <div className="mb-1 text-cyan-300 font-mono">
                    Session active : <strong>{sqlLoginResult.userLoggedIn}</strong> ({sqlLoginResult.role})
                  </div>
                )}
                <p className="text-slate-300 text-xs">{sqlLoginResult.message}</p>
              </div>
            )}
          </div>

          {/* Right: Live Database Query Inspector */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs text-cyan-400 font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  <span>Moteur de Requête SQL (Côté Serveur)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSqlSecureMode ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  {isSqlSecureMode ? 'REQUÊTE PRÉPARÉE SÉCURISÉE' : 'CONCATÉNATION VULNÉRABLE'}
                </span>
              </div>

              {/* Code viewer */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mb-4 overflow-x-auto text-slate-200 leading-relaxed">
                <pre className="text-xs">
                  {isSqlSecureMode ? preparedSqlQuery : rawSqlQuery}
                </pre>
              </div>

              {/* Step-by-Step Security Explanation */}
              <div className="space-y-3 font-sans text-xs">
                <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
                  Analyse de la faille par l'analyste :
                </h5>

                {!isSqlSecureMode ? (
                  <div className="p-3.5 bg-rose-950/20 border border-rose-800/60 rounded-lg text-slate-300 space-y-2">
                    <p>
                      <strong>Pourquoi l'attaque fonctionne :</strong> L'apostrophe fermante <code className="text-rose-400">'</code> dans votre saisie clôt prématurément la valeur du champ <code className="text-cyan-300">username</code>. Le mot-clé <code className="text-rose-400 font-bold">OR</code> ajoute ensuite une condition qui est toujours vraie (<code className="text-rose-400">'1'='1'</code>).
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Le moteur SQL exécute l'instruction sans savoir où s'arrêtait le champ d'entrée de l'utilisateur, ce qui contourne intégralement la vérification du mot de passe !
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-lg text-slate-300 space-y-2">
                    <p>
                      <strong>Comment la requête préparée neutralise la faille :</strong> Le moteur SQL sépare l'analyse syntaxique de la requête (le code SQL pur) des données utilisateur transmises via des paramètres réservés <code className="text-emerald-400 font-bold">?</code>.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Même si l'attaquant tape des apostrophes et des commandes <code className="text-cyan-300">OR '1'='1'</code>, le serveur les interprète comme de simples caractères textuels inoffensifs.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>OWASP Top 10 : A03:2021-Injection</span>
              <span className="text-cyan-400">Pratique 100% isolée</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CROSS-SITE SCRIPTING (XSS) */}
      {activeModule === 'xss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Comment Form */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Livre d'Or Vulnérable
                </span>
                {/* Security Mode Toggle */}
                <button
                  onClick={() => {
                    setIsXssSecureMode(!isXssSecureMode);
                    setXssAlertTriggered(null);
                    AudioService.playBlip();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                    isXssSecureMode
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                      : 'bg-rose-950/60 border-rose-600 text-rose-300'
                  }`}
                >
                  {isXssSecureMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isXssSecureMode ? 'Échappement Actif' : 'Rendu Brut (innerHTML)'}</span>
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">Publier un message public</h4>
              <p className="text-xs text-slate-400 mb-4">
                Injectez une balise de script pour tester si le navigateur l'exécute ou s'il l'échappe.
              </p>

              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Votre Nom / Pseudo</label>
                  <input
                    type="text"
                    value={xssAuthor}
                    onChange={(e) => setXssAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={xssComment}
                    onChange={(e) => setXssComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  {/* Quick payloads */}
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="text-slate-500">Payloads :</span>
                    {[
                      '<script>alert("Cookie volé")</script>',
                      '<img src=x onerror="alert(1)">',
                      '<b onmouseover="alert(\'XSS\')">Survol</b>'
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setXssComment(p);
                          AudioService.playKeypress();
                        }}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-mono text-[10px]"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-xs"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* XSS Alert Notification */}
            {xssAlertTriggered && (
              <div className="mt-4 p-4 rounded-xl border border-rose-500 bg-rose-950/40 text-xs text-rose-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-sm text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>XSS Déclenché dans le Navigateur !</span>
                </div>
                <p>{xssAlertTriggered}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  En situation réelle, un attaquant pourrait dérober le cookie de session (session hijacking) ou rediriger les internautes vers un faux portail.
                </p>
              </div>
            )}
          </div>

          {/* Right: Rendered Comments Feed & Sanitization Inspector */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs text-cyan-400 font-bold flex items-center gap-2 font-mono">
                  <MessageSquare className="w-4 h-4" />
                  <span>Affichage des Messages Publics</span>
                </span>
                <button
                  onClick={() => {
                    setCommentsList([
                      {
                        id: 'c-1',
                        author: 'Support',
                        content: 'Bienvenue sur le livre d\'or des retours clients de Cyber Academy !',
                        isExecuted: false,
                        date: '10:00'
                      }
                    ]);
                    setXssAlertTriggered(null);
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Vider les messages</span>
                </button>
              </div>

              {/* Feed of comments */}
              <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
                {commentsList.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-lg border text-xs ${
                      c.isExecuted
                        ? 'bg-rose-950/20 border-rose-800/80 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <strong className="text-white">{c.author}</strong>
                      <span className="font-mono">{c.date}</span>
                    </div>

                    {/* How content is rendered based on mode */}
                    <div className="pt-1 font-mono text-xs">
                      {isXssSecureMode ? (
                        <div className="text-emerald-300">
                          {c.content}
                          <span className="block text-[10px] text-slate-500 font-sans mt-1">
                            (Texte brut sécurisé : les caractères &lt; et &gt; ont été convertis en &amp;lt; et &amp;gt;)
                          </span>
                        </div>
                      ) : (
                        <div className={c.isExecuted ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                          {c.content}
                          {c.isExecuted && (
                            <span className="block text-[10px] text-rose-400 font-sans mt-1">
                              [ATTENTION : Balise interprétée par le DOM comme du code JavaScript exécutable !]
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Remediation lesson */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1.5">
                <span className="text-cyan-300 font-semibold block font-mono text-[11px]">
                  Règle d'or de protection anti-XSS :
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Ne jamais insérer des entrées utilisateurs non fiables directement avec <code className="text-rose-300">innerHTML</code>. Toujours utiliser des mécanismes d'échappement HTML contextuel (<code className="text-emerald-300">textContent</code>, bibliothèques comme DOMPurify) et configurer un en-tête HTTP <code className="text-cyan-300">Content-Security-Policy (CSP)</code>.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>OWASP Top 10 : A03:2021-Injection (Cross-Site Scripting)</span>
              <span className="text-cyan-400">Simulation client sécurisée</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
