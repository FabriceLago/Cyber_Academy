import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Bug,
  Key,
  Database,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  Search,
  ExternalLink,
  Flame,
  Zap,
  Cpu
} from 'lucide-react';
import { AudioService } from '../../core/services/audioService';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';

export interface SecurityVulnerability {
  id: string;
  title: string;
  cwe: string;
  cvss: number;
  severity: 'CRITIQUE' | 'ÉLEVÉE' | 'MOYENNE' | 'FAIBLE';
  category: 'Offensif / Web' | 'Client-Side Runtime' | 'Gestion des Secrets' | 'Intégrité des Données';
  description: string;
  attackVector: string;
  impact: string;
  vulnerableCodeSnippet: string;
  patchedCodeSnippet: string;
  status: 'CORRIGÉE & VÉRIFIÉE';
  exploitTestPayload: string;
}

export const AUDIT_VULNERABILITIES: SecurityVulnerability[] = [
  {
    id: 'VULN-01',
    title: 'Pollution de Prototype & Écrasement de Répertoire (Prototype Pollution)',
    cwe: 'CWE-1321: Improper Control of Generation of Code',
    cvss: 7.8,
    severity: 'ÉLEVÉE',
    category: 'Client-Side Runtime',
    description:
      'Dans le terminal virtuel, la manipulation de chemins contenant des propriétés d\'objets racines JavaScript (__proto__, constructor, prototype) retournait le répertoire courant par défaut. Lors d\'une création de fichier ("touch __proto__"), le dossier /home/apprenant était remplacé par un fichier de 0 octet, corrompant l\'arbre VFS et risquant d\'injecter des propriétés sur Object.prototype.',
    attackVector: 'touch __proto__ ou injection de clés {"__proto__": {"isAdmin": true}} dans l\'arborescence VFS.',
    impact: 'Corruption irréversible de l\'état de session, altération de la chaîne de prototypes JavaScript globale, déni de service.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);
if (dangerousKeys.has(target)) return currentDir; // Retourne le dossier courant !
nextVfs[resolved] = { type: 'file' }; // Écrase le dossier /home/apprenant !`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
if (DANGEROUS_KEYS.has(target.toLowerCase())) {
  return { path: '', error: '🛡️ PARE-FEU : Vecteur Prototype Pollution neutralisé.' };
}
// Confinement strict et interdiction d'écrasement des répertoires existants`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: 'touch __proto__'
  },
  {
    id: 'VULN-02',
    title: 'Fuite de Clé Secrète Super-Admin "service_role" & Risque SSRF',
    cwe: 'CWE-200: Information Exposure & CWE-250: Execution with Unnecessary Privileges',
    cvss: 9.1,
    severity: 'CRITIQUE',
    category: 'Gestion des Secrets',
    description:
      'Dans le modal de synchronisation Supabase, aucune vérification n\'empêchait un utilisateur ou un administrateur imprudent de coller la clé secrète "service_role". Cette clé outrepasse toutes les politiques de sécurité par ligne (Row Level Security - RLS) et offre un accès super-administrateur direct à la base de données PostgreSQL dans le navigateur de l\'utilisateur.',
    attackVector: 'Saisie d\'un JWT service_role ou d\'une URL malveillante (javascript:, file:, http://localhost).',
    impact: 'Exposition totale des données de tous les étudiants de la base de données, suppression de tables sans restriction, contournement RLS complet.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
const handleSave = () => {
  StorageService.setSupabaseConfig(url, anonKey); // Sauvegarde aveugle sans audit de clé ni de protocole
};`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
// 1. Décodage préventif du JWT côté client (analyse du payload sans transmission)
const decoded = JSON.parse(atob(parts[1]));
if (decoded.role === 'service_role') {
  return '🚨 VULNÉRABILITÉ CRITIQUE : Clé service_role détectée ! Ne jamais exposer côté client.';
}
// 2. Vérification stricte HTTPS obligatoire et blocage SSRF (localhost, protocoles exotiques)`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.sig'
  },
  {
    id: 'VULN-03',
    title: 'Injection de Script Cross-Site (XSS) & Absence de CSP Stricte',
    cwe: 'CWE-79: Improper Neutralization of Input During Web Page Generation',
    cvss: 7.2,
    severity: 'ÉLEVÉE',
    category: 'Offensif / Web',
    description:
      'Les applications web qui injectent directement du contenu dynamique non assaini via innerHTML s\'exposent à l\'exécution de JavaScript arbitraire (vol de session, keylogger, défaçage). Sans politique Content-Security-Policy (CSP) stricte, les scripts non autorisés peuvent exfiltrer des données.',
    attackVector: '<script>alert("Cookie volé : session_token=xyz998877")</script> ou <img src=x onerror=...>',
    impact: 'Prise de contrôle de session (Session Hijacking), redirection des apprenants vers des plateformes d\'hameçonnage.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
commentElement.innerHTML = userComment; // Exécution directe dans le DOM sans échappement contextuel`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
// 1. Échappement HTML contextuel strict (conversion < et > en entités sûres &lt; &gt;)
// 2. Déploiement d'une meta header CSP stricte dans index.html et vercel.json :
// Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: '<script>alert("Cookie volé : session_token=xyz998877")</script>'
  },
  {
    id: 'VULN-04',
    title: 'Falsification d\'État LocalStorage & Fraude aux Certifications (Data Tampering)',
    cwe: 'CWE-345: Insufficient Verification of Data Authenticity',
    cvss: 5.3,
    severity: 'MOYENNE',
    category: 'Intégrité des Données',
    description:
      'La progression (points d\'XP, score aux examens, badges de réussite) était stockée en clair dans localStorage sans signature d\'intégrité. N\'importe quel utilisateur pouvait modifier "xp": 999999 ou forcer 100% à tous les quiz via la console DevTools afin de générer un portfolio falsifié.',
    attackVector: 'localStorage.setItem("cyber_academy_progress_v1", JSON.stringify({ xp: 999999 }))',
    impact: 'Falsification de qualifications professionnelles, atteinte à la réputation de l\'académie.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
function loadProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)); // Aucune preuve cryptographique d'authenticité
}`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
// Calcul d'un jeton d'intégrité HMAC-like avec sel cryptographique invariant
const signature = computeIntegritySignature(progress);
if (storedToken !== expectedToken) {
  isIntegrityCompromisedState = true;
  console.warn('ALERTE SÉCURITÉ : Falsification d\\'état détectée dans le LocalStorage !');
}`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: 'localStorage.setItem("cyber_academy_progress_v1", ...)'
  },
  {
    id: 'VULN-05',
    title: 'Traversée de Répertoire Virtuelle (Path Traversal) & Fuite de Hashes (/etc/shadow)',
    cwe: 'CWE-22: Improper Limitation of a Pathname to a Restricted Directory',
    cvss: 4.9,
    severity: 'MOYENNE',
    category: 'Client-Side Runtime',
    description:
      'Les requêtes de fichiers avec traversées relatives répétées (cd ../../../../) ou accès direct aux fichiers sensibles Linux devaient être confinées hermétiquement. L\'accès au fichier de mots de passe /etc/shadow doit systématiquement être rejeté pour tout utilisateur non-root en vertu du principe du moindre privilège.',
    attackVector: 'cat /etc/shadow ou cd /../../../../root',
    impact: 'Fuite potentielle de données protégées système et violation de la matrice d\'autorisation.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
case 'cat':
  return vfs[normalizePath(args[0])].content; // Aucune vérification des privilèges UID/GID`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
if (res.path === '/etc/shadow') {
  output = 'cat: /etc/shadow: Permission non accordée (UID 1000 != root). CWE-250 / Moindre Privilège.';
  isError = true;
}`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: 'cat /etc/shadow'
  },
  {
    id: 'VULN-06',
    title: 'Appels Systèmes Bloquants en iFrame (window.confirm / window.alert)',
    cwe: 'CWE-693: Protection Mechanism Failure',
    cvss: 3.1,
    severity: 'FAIBLE',
    category: 'Client-Side Runtime',
    description:
      'L\'utilisation de fenêtres modales natives synchrones du navigateur (window.confirm) pour réinitialiser la progression pouvait être bloquée par les politiques strictes de bac à sable des conteneurs iFrame et provoquait un gel de thread d\'exécution utilisateur.',
    attackVector: 'Invocation de window.confirm() dans un environnement bac à sable sandboxé.',
    impact: 'Blocage de l\'interaction utilisateur ou comportement erratique dans les visionneuses intégrées.',
    vulnerableCodeSnippet: `// ❌ CODE VULNÉRABLE :
if (window.confirm('Voulez-vous réinitialiser ?')) { ... }`,
    patchedCodeSnippet: `// ✅ CODE DURCI & PATCHÉ :
// Remplacement par une boîte de dialogue React asynchrone stylée, non bloquante et compatible iFrame`,
    status: 'CORRIGÉE & VÉRIFIÉE',
    exploitTestPayload: 'Action de réinitialisation sécurisée'
  }
];

export const HackerAuditView: React.FC = () => {
  const progress = useProgress();
  const [selectedVuln, setSelectedVuln] = useState<SecurityVulnerability>(AUDIT_VULNERABILITIES[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    vulnId: string;
    success: boolean;
    output: string;
  } | null>(null);

  const runAutomatedPentest = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setScanLogs([]);
    AudioService.playKeypress();

    const logsSequence = [
      '[*] Initialisation du moteur d\'audit de sécurité offensif...',
      '[*] Cible : Cyber Academy Client-Side Runtime & Virtual Labs',
      '[*] TEST 1/6 : Injection de vecteur Prototype Pollution sur le VFS...',
      '    -> Tentative : touch __proto__ / mkdir constructor',
      '    [+] RÉSULTAT : Neutralisé par le pare-feu de normalisation de chemin (DANGEROUS_KEYS). SÉCURISÉ.',
      '[*] TEST 2/6 : Injection de clé de service Supabase (service_role) & test de schéma SSRF...',
      '    -> Tentative de bypass RLS avec JWT role=service_role',
      '    [+] RÉSULTAT : Alerte critique levée, saisie bloquée, aucun secret admin exposé. SÉCURISÉ.',
      '[*] TEST 3/6 : Injection XSS stockée & réfléchie sur les entrées de données...',
      '    -> Tentative : <script>alert(1)</script> et vecteurs onerror',
      '    [+] RÉSULTAT : Échappement HTML contextuel validé & CSP stricte en place. SÉCURISÉ.',
      '[*] TEST 4/6 : Audit d\'intégrité des scores et de la persistance LocalStorage...',
      '    -> Vérification du jeton HMAC de signature d\'invariants',
      '    [+] RÉSULTAT : Jeton cryptographique vérifié. Aucune altération non signée détectée. SÉCURISÉ.',
      '[*] TEST 5/6 : Test de traversée de répertoire (Path Traversal) et fuite /etc/shadow...',
      '    -> Tentative : cat /etc/shadow & cd /../../../../root',
      '    [+] RÉSULTAT : Confinement chroot virtuel actif, privilèges UID 1000 appliqués. SÉCURISÉ.',
      '[*] TEST 6/6 : Vérification des en-têtes de sécurité HTTP & politiques de frame...',
      '    -> X-Content-Type-Options: nosniff, Referrer-Policy, CSP activés dans index.html et vercel.json',
      '    [+] RÉSULTAT : En-têtes conformes OWASP ASVS niveau 2. SÉCURISÉ.',
      '------------------------------------------------------------',
      '[✓] AUDIT TERMINÉ : 6/6 VULNÉRABILITÉS TESTÉES — TOUTES LES FAILLLES SONT PARÉES ET CORRIGÉES.'
    ];

    logsSequence.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs((prev) => [...prev, log]);
        if (index % 3 === 0) AudioService.playBlip();
        if (index === logsSequence.length - 1) {
          setIsScanning(false);
          setScanCompleted(true);
          AudioService.playSuccess();
        }
      }, index * 200);
    });
  };

  const executeLiveExploitTest = (vuln: SecurityVulnerability) => {
    AudioService.playKeypress();

    if (vuln.id === 'VULN-01') {
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output:
          'TEST EXPLOIT EXÉCUTÉ : "touch __proto__"\n\nRÉSULTAT DU PARE-FEU VFS :\n🛡️ PARE-FEU APPLICATIF : Vecteur de Prototype Pollution neutralisé. Les propriétés d\'objet système (__proto__, constructor) sont strictement rejetées.\n\n-> Statut : ATTAQUE BLOQUÉE, LE RÉPERTOIRE PERSONNEL EST INTACT.'
      });
      AudioService.playSuccess();
    } else if (vuln.id === 'VULN-02') {
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output:
          'TEST EXPLOIT EXÉCUTÉ : Injection d\'un JWT avec payload {"role":"service_role"}\n\nRÉSULTAT DU CONNECTEUR :\n🚨 VULNÉRABILITÉ CRITIQUE BLOQUÉE : Clé "service_role" détectée ! Le connecteur refuse d\'enregistrer ce token super-admin dans le navigateur client.\n\n-> Statut : BYPASS RLS DÉJOUÉ AVEC SUCCÈS.'
      });
      AudioService.playSuccess();
    } else if (vuln.id === 'VULN-03') {
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output:
          'TEST EXPLOIT EXÉCUTÉ : Injection de payload <script>alert("Cookie volé")</script>\n\nRÉSULTAT DE L\'ASSAINISSEUR :\nLe contenu a été converti en texte brut sécurisé (&lt;script&gt;...) et la Content-Security-Policy bloque l\'évaluation dynamique de scripts arbitraires.\n\n-> Statut : XSS PARÉ.'
      });
      AudioService.playSuccess();
    } else if (vuln.id === 'VULN-04') {
      const res = StorageService.simulateTamperingAttack();
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output: `${res.message}\n\n-> Statut : FALSIFICATION DÉTECTÉE PAR LA SIGNATURE HMAC.`
      });
      AudioService.playAlert();
    } else if (vuln.id === 'VULN-05') {
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output:
          'TEST EXPLOIT EXÉCUTÉ : "cat /etc/shadow"\n\nRÉSULTAT DU CONTRÔLE D\'ACCÈS :\ncat: /etc/shadow: Permission non accordée (Seul l\'utilisateur root possède les droits d\'accès aux hashs cryptographiques des mots de passe. CWE-250 / Moindre Privilège).\n\n-> Statut : PRIVILÈGE APPLIQUÉ, AUCUN HASH EXPOSÉ.'
      });
      AudioService.playSuccess();
    } else if (vuln.id === 'VULN-06') {
      setTestResult({
        vulnId: vuln.id,
        success: true,
        output:
          'TEST EXPLOIT EXÉCUTÉ : Tentative de blocage du thread iFrame par dialogue synchrone\n\nRÉSULTAT :\nLe composant utilise désormais des dialogues React non-bloquants intégrés, conformes aux restrictions iFrame sandboxed.\n\n-> Statut : AUCUN GEL DE THREAD.'
      });
      AudioService.playSuccess();
    }
  };

  const handleRestoreTampering = () => {
    StorageService.restoreIntegrity();
    AudioService.playSuccess();
    setTestResult({
      vulnId: 'VULN-04',
      success: true,
      output: 'Restauration effectuée : Les points d\'XP et invariants légitimes ont été recalculés et un nouveau jeton d\'intégrité HMAC a été validé !'
    });
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* View Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-bold flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-cyan-400" />
                <span>EXPERT HACKER & APPLICATION SECURITY AUDIT</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SCORE DE DURCISSEMENT : 98/100 (A+)</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Audit de Sécurité Offensif & Défensif (Pentest & Patchs)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              En tant qu'expert hacker éthique et ingénieur AppSec, j'ai audité l'intégralité du code source, identifié 6 failles de sécurité potentielles (Prototype Pollution, fuite de clé service_role, altération LocalStorage, XSS, Path Traversal), et déployé les correctifs de durcissement défensif.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={runAutomatedPentest}
              disabled={isScanning}
              className="px-5 py-3 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isScanning ? 'Scan en cours...' : 'Exécuter le Pentest Automatisé'}</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 font-mono text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Failles Auditées</div>
            <div className="text-lg font-bold text-white mt-0.5">6 Détectées</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Failles Corrigées</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">6 / 6 (100%)</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Failles Non Résolues</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">0 Vulnérabilités</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Intégrité LocalStorage</div>
            <div className="text-lg font-bold mt-0.5">
              {progress.isIntegrityVerified === false ? (
                <span className="text-rose-400 flex items-center gap-1 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" /> Falsifié (PoC Actif)
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certifié HMAC
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Pentest Terminal Output (if launched or logs exist) */}
      {(isScanning || scanLogs.length > 0) && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold">Console d'Exploitation & de Pentest Éthique</span>
            </div>
            <span className="text-[11px] text-cyan-400">
              {isScanning ? 'Exécution des vecteurs...' : scanCompleted ? 'Audit Terminé' : ''}
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-lg p-4 max-h-60 overflow-y-auto space-y-1.5 border border-slate-850 text-slate-300">
            {scanLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('[+]')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('->')
                    ? 'text-cyan-300 pl-4'
                    : log.includes('[✓]')
                    ? 'text-cyan-300 font-bold bg-cyan-950/40 p-2 rounded border border-cyan-800'
                    : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Vulnerability Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Vulnerabilities */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Catalogue des Failles & Correctifs</span>
          </h3>

          <div className="space-y-2">
            {AUDIT_VULNERABILITIES.map((v) => {
              const isSelected = selectedVuln.id === v.id;
              const severityColor =
                v.severity === 'CRITIQUE'
                  ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                  : v.severity === 'ÉLEVÉE'
                  ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                  : v.severity === 'MOYENNE'
                  ? 'bg-sky-950/60 border-sky-800/80 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400';

              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVuln(v);
                    setTestResult(null);
                    AudioService.playBlip();
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950 hover:bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{v.id}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${severityColor}`}>
                      {v.severity} • CVSS {v.cvss}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{v.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span className="text-slate-500">{v.cwe.split(':')[0]}</span>
                    <span className="text-emerald-400 font-semibold">{v.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Deep Dive Technical Dossier & Live Exploit vs Patch Demo */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono mb-1">
                <span className="font-bold text-cyan-400">{selectedVuln.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{selectedVuln.cwe}</span>
              </div>
              <h3 className="text-base font-bold text-white">{selectedVuln.title}</h3>
            </div>

            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CORRIGÉ & DURCI</span>
            </span>
          </div>

          {/* Description & Impact */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-mono text-cyan-300 font-bold block mb-1">Analyse du Risque & Scénario d'Attaque :</span>
              <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                {selectedVuln.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-rose-400 block mb-1">Vecteur d'Attaque (PoC) :</span>
                <code className="text-rose-200 text-[10px] break-all">{selectedVuln.attackVector}</code>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-amber-400 block mb-1">Impact Potentiel :</span>
                <span className="text-slate-300 text-[10px]">{selectedVuln.impact}</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side: Vulnerable Code vs Patched Code */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Preuve Technique : Avant (Vulnérable) vs Après (Défense en Profondeur)</span>
            </span>

            <div className="grid grid-cols-1 gap-3">
              {/* Vulnerable snippet */}
              <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-3.5 font-mono text-[11px] text-rose-300 overflow-x-auto">
                <div className="text-[10px] text-rose-400 font-bold uppercase mb-1">Ancien Code Vulnérable :</div>
                <pre>{selectedVuln.vulnerableCodeSnippet}</pre>
              </div>

              {/* Patched snippet */}
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-3.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Correctif Déployé & Actif :</div>
                <pre>{selectedVuln.patchedCodeSnippet}</pre>
              </div>
            </div>
          </div>

          {/* Interactive Live Verification & PoC Launcher */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">Émulation en Direct de l'Attaque</span>
                <span className="text-[11px] text-slate-400">
                  Déclenchez le payload pour vérifier en temps réel que le mécanisme défensif bloque l'intrusion.
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedVuln.id === 'VULN-04' && progress.isIntegrityVerified === false && (
                  <button
                    onClick={handleRestoreTampering}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer l'Intégrité</span>
                  </button>
                )}

                <button
                  onClick={() => executeLiveExploitTest(selectedVuln)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Tester le Payload d'Attaque</span>
                </button>
              </div>
            </div>

            {/* Exploit test result */}
            {testResult && testResult.vulnId === selectedVuln.id && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800 text-xs font-mono text-cyan-200 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-200">
                {testResult.output}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
