import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, HelpCircle, ShieldAlert, Award, RotateCcw, Monitor, Sparkles } from 'lucide-react';
import { INITIAL_TERMINAL_VFS } from '../../core/data/cyberData';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';
import { AudioService } from '../../core/services/audioService';

interface HistoryItem {
  command: string;
  output: string;
  isError?: boolean;
}

export const TerminalLab: React.FC = () => {
  const progress = useProgress();
  const [vfs, setVfs] = useState(JSON.parse(JSON.stringify(INITIAL_TERMINAL_VFS)));
  const [cwd, setCwd] = useState<string>('/home/apprenant');
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: '',
      output: 'Cyber Academy — Terminal Linux Émulé v1.2 (Pédagogique)\nTapez "help" pour voir la liste des commandes autorisées ou suivez les missions ci-dessous.'
    }
  ]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [isCrtMode, setIsCrtMode] = useState<boolean>(true);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Active missions
  const missions = [
    {
      id: 'task-pwd',
      title: 'Mission 1 : Localisation dans l\'arborescence',
      description: 'Affichez le chemin absolu de votre répertoire de travail actuel en utilisant la commande appropriée.',
      commandHint: 'pwd',
      isCompleted: progress.completedLabTasks.includes('task-pwd'),
      validate: (lastCmd: string) => lastCmd.trim() === 'pwd'
    },
    {
      id: 'task-hidden-file',
      title: 'Mission 2 : Démasquer un fichier caché',
      description: 'Rendez-vous dans le dossier documents et débusquez le fichier caché contenant le flag avec "ls -la".',
      commandHint: 'cd documents puis ls -la',
      isCompleted: progress.completedLabTasks.includes('task-hidden-file'),
      validate: (lastCmd: string, curPath: string) =>
        lastCmd.includes('ls -la') || lastCmd.includes('ls -a') || lastCmd.includes('.secret_flag.txt')
    },
    {
      id: 'task-chmod',
      title: 'Mission 3 : Sécurisation d\'un fichier de configuration exposé',
      description: 'Le fichier "/home/apprenant/config_exposee.env" a des permissions dangereuses (777). Restreignez son accès à 600 pour protéger les secrets.',
      commandHint: 'chmod 600 config_exposee.env',
      isCompleted: progress.completedLabTasks.includes('task-chmod'),
      validate: (_: string, __: string, currentVfs: any) => {
        const item = currentVfs['/home/apprenant/config_exposee.env'];
        return item && (item.permissions === 'rw-------' || item.permissions === '600');
      }
    },
    {
      id: 'task-auth-log',
      title: 'Mission 4 : Investigation dans les journaux système',
      description: 'Consultez le fichier d\'audit de sécurité "/var/log/auth.log" avec "cat" pour analyser les tentatives d\'intrusion.',
      commandHint: 'cat /var/log/auth.log',
      isCompleted: progress.completedLabTasks.includes('task-auth-log'),
      validate: (lastCmd: string) => lastCmd.includes('cat') && lastCmd.includes('auth.log')
    }
  ];

  const DANGEROUS_KEYS = new Set([
    '__proto__',
    'constructor',
    'prototype',
    'toString',
    'valueOf',
    '__defineGetter__',
    '__defineSetter__',
    'hasOwnProperty'
  ]);

  const normalizePath = (target: string, currentDir: string): { path: string; error?: string } => {
    if (target === '~' || target === '') return { path: '/home/apprenant' };

    // Strict prototype pollution prevention
    if (DANGEROUS_KEYS.has(target.toLowerCase())) {
      return {
        path: '',
        error: '🛡️ PARE-FEU APPLICATIF : Vecteur de Prototype Pollution neutralisé. Les propriétés d\'objet système sont strictement interdites.'
      };
    }

    let pathCandidate = target;
    if (target.startsWith('/')) {
      pathCandidate = target.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    } else {
      pathCandidate = `${currentDir}/${target}`;
    }

    const parts = pathCandidate.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const part of parts) {
      if (DANGEROUS_KEYS.has(part.toLowerCase())) {
        return {
          path: '',
          error: '🛡️ PARE-FEU APPLICATIF : Segment de chemin malveillant (__proto__/constructor) détecté et rejeté.'
        };
      }
      if (part === '.') continue;
      if (part === '..') {
        if (stack.length > 0) {
          stack.pop();
        }
      } else {
        stack.push(part);
      }
    }
    return { path: '/' + stack.join('/') };
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    setCmdHistory((prev) => [...prev, rawCmd]);
    setCmdIndex(-1);
    setInputVal('');

    const [cmd, ...args] = rawCmd.split(/\s+/);
    let output = '';
    let isError = false;
    let nextVfs = { ...vfs };
    let nextCwd = cwd;

    switch (cmd.toLowerCase()) {
      case 'help':
        output = `Commandes disponibles :
  pwd              : Affiche le répertoire courant
  ls [-la]         : Liste les fichiers et dossiers
  cd <répertoire>  : Change de répertoire (ex: cd documents, cd ..)
  cat <fichier>    : Affiche le contenu d'un fichier texte
  grep <motif> <f> : Recherche une chaîne de caractères dans un fichier
  touch <fichier>  : Crée un nouveau fichier vide
  mkdir <dossier>  : Crée un nouveau répertoire
  chmod <mode> <f> : Modifie les permissions (ex: chmod 600 config.env)
  whoami / id      : Affiche votre identité utilisateur
  clear            : Efface l'écran du terminal
  reset            : Réinitialise l'environnement virtuel`;
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'reset':
        setVfs(JSON.parse(JSON.stringify(INITIAL_TERMINAL_VFS)));
        setCwd('/home/apprenant');
        output = 'Système de fichiers réinitialisé à son état d\'origine.';
        break;

      case 'pwd':
        output = cwd;
        break;

      case 'whoami':
        output = 'apprenant';
        break;

      case 'id':
        output = 'uid=1000(apprenant) gid=1000(apprenant) groups=1000(apprenant),27(sudo),4(adm)';
        break;

      case 'ls': {
        const showAll = args.includes('-la') || args.includes('-a') || args.includes('-al');
        const showLong = args.includes('-la') || args.includes('-l') || args.includes('-al');

        // Find items in cwd
        const prefix = cwd === '/' ? '/' : cwd + '/';
        const entries: string[] = [];

        Object.keys(vfs).forEach((fullPath) => {
          if (fullPath === cwd) return;
          if (fullPath.startsWith(prefix)) {
            const relative = fullPath.substring(prefix.length);
            if (!relative.includes('/')) {
              if (relative.startsWith('.') && !showAll) return;
              entries.push(relative);
            }
          }
        });

        if (entries.length === 0) {
          output = '';
        } else if (showLong) {
          const lines = entries.map((name) => {
            const item = vfs[prefix + name];
            const isDir = item.type === 'dir';
            const perm = isDir ? 'd' + item.permissions : '-' + item.permissions;
            return `${perm}  ${item.owner}  ${item.owner}  4096  Oct 17 08:30  ${name}${isDir ? '/' : ''}`;
          });
          output = lines.join('\n');
        } else {
          output = entries.join('   ');
        }
        break;
      }

      case 'cd': {
        const target = args[0] || '~';
        const res = normalizePath(target, cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }
        if (vfs[res.path] && vfs[res.path].type === 'dir') {
          nextCwd = res.path;
          setCwd(res.path);
        } else {
          output = `cd: aucun fichier ou dossier de ce type : ${target}`;
          isError = true;
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output = 'cat: argument de fichier manquant (ex: cat readme.txt)';
          isError = true;
          break;
        }
        const res = normalizePath(args[0], cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }
        if (res.path === '/etc/shadow') {
          output = 'cat: /etc/shadow: Permission non accordée (Seul l\'utilisateur root possède les droits d\'accès aux hashs cryptographiques des mots de passe. CWE-250 / Principe du moindre privilège).';
          isError = true;
          break;
        }
        const item = vfs[res.path];
        if (!item) {
          output = `cat: ${args[0]}: Aucun fichier ou dossier de ce type`;
          isError = true;
        } else if (item.type === 'dir') {
          output = `cat: ${args[0]}: Est un dossier`;
          isError = true;
        } else {
          output = item.content || '';
        }
        break;
      }

      case 'grep': {
        if (args.length < 2) {
          output = 'grep: utilisation : grep <motif> <fichier>';
          isError = true;
          break;
        }
        const pattern = args[0];
        const targetFile = args[1];
        const res = normalizePath(targetFile, cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }
        const item = vfs[res.path];
        if (!item || item.type === 'dir') {
          output = `grep: ${targetFile}: Aucun fichier de ce type`;
          isError = true;
        } else {
          const lines = (item.content || '').split('\n');
          const matched = lines.filter((l: string) => l.toLowerCase().includes(pattern.toLowerCase()));
          output = matched.length > 0 ? matched.join('\n') : '';
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          output = 'touch: nom de fichier manquant';
          isError = true;
          break;
        }
        const res = normalizePath(args[0], cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }
        if (nextVfs[res.path] && nextVfs[res.path].type === 'dir') {
          output = `touch: impossible de modifier '${args[0]}': est un répertoire existant`;
          isError = true;
          break;
        }
        nextVfs[res.path] = {
          type: 'file',
          content: nextVfs[res.path]?.content || '',
          permissions: 'rw-r--r--',
          owner: 'apprenant'
        };
        setVfs(nextVfs);
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          output = 'mkdir: nom de dossier manquant';
          isError = true;
          break;
        }
        const res = normalizePath(args[0], cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }
        if (nextVfs[res.path]) {
          output = `mkdir: impossible de créer le dossier '${args[0]}': Le fichier ou dossier existe déjà`;
          isError = true;
          break;
        }
        nextVfs[res.path] = {
          type: 'dir',
          permissions: 'rwxr-xr-x',
          owner: 'apprenant'
        };
        setVfs(nextVfs);
        break;
      }

      case 'chmod': {
        if (args.length < 2) {
          output = 'chmod: utilisation : chmod <mode_octal> <fichier> (ex: chmod 600 mon_fichier)';
          isError = true;
          break;
        }
        const mode = args[0];
        const targetFile = args[1];
        const res = normalizePath(targetFile, cwd);
        if (res.error) {
          output = res.error;
          isError = true;
          break;
        }

        if (!nextVfs[res.path]) {
          output = `chmod: impossible d'accéder à '${targetFile}': Aucun fichier ou dossier de ce type`;
          isError = true;
        } else {
          let convertedPerm = 'rw-------';
          if (mode === '600') convertedPerm = 'rw-------';
          else if (mode === '644') convertedPerm = 'rw-r--r--';
          else if (mode === '755') convertedPerm = 'rwxr-xr-x';
          else if (mode === '700') convertedPerm = 'rwx------';
          else if (mode === '777') convertedPerm = 'rwxrwxrwx';

          nextVfs[res.path] = {
            ...nextVfs[res.path],
            permissions: convertedPerm
          };
          setVfs(nextVfs);
          output = `Permissions modifiées pour ${targetFile} : mode ${mode} (${convertedPerm})`;
        }
        break;
      }

      default:
        output = `bash: ${cmd}: commande introuvable. Tapez "help" pour afficher les commandes autorisées.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: rawCmd, output, isError }]);

    // Check missions completion
    missions.forEach((m) => {
      if (!m.isCompleted && m.validate(rawCmd, nextCwd, nextVfs)) {
        StorageService.recordLabTaskComplete(m.id, 'terminal');
        AudioService.playSuccess();
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex === -1) return;
      if (cmdIndex < cmdHistory.length - 1) {
        setCmdIndex(cmdIndex + 1);
        setInputVal(cmdHistory[cmdIndex + 1]);
      } else {
        setCmdIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro & Missions Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Laboratoire Linux Pédagogique (Sandbox Sécurisé)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Manipulez un système de fichiers virtuel réel. Vos commandes modifient l'état en mémoire.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Missions : {missions.filter((m) => m.isCompleted).length}/{missions.length} réussies</span>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-3.5 rounded-lg border text-xs transition-colors ${
                mission.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  {mission.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                  <span>{mission.title}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {mission.isCompleted ? '+75 XP' : 'À valider'}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-2">{mission.description}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 font-mono text-[11px]">
                <span className="text-slate-500">Indice :</span>
                <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {mission.commandHint}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Screen Console with Immersive CRT mode */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Subtle CRT Scanline Overlay */}
        {isCrtMode && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-30 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)'
            }}
          />
        )}

        {/* Terminal Title Bar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between relative z-30">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-400 text-[11px]">apprenant@cyber-box: {cwd}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCrtMode(!isCrtMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                isCrtMode ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/60' : 'text-slate-400 hover:text-white'
              }`}
              title="Activer/Désactiver l'effet écran cathodique"
            >
              <Monitor className="w-3 h-3" />
              <span>CRT {isCrtMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                setVfs(JSON.parse(JSON.stringify(INITIAL_TERMINAL_VFS)));
                setCwd('/home/apprenant');
                setHistory((prev) => [...prev, { command: 'reset', output: 'Environnement réinitialisé.' }]);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="Réinitialiser le lab"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className={`p-4 h-80 overflow-y-auto space-y-2 select-text relative z-10 ${isCrtMode ? 'text-cyan-200' : 'text-slate-300'}`}>
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-cyan-400 font-semibold">apprenant@cyber-box:{cwd}$</span>
                  <span className="text-white font-bold">{item.command}</span>
                </div>
              )}
              {item.output && (
                <pre
                  className={`whitespace-pre-wrap leading-relaxed ${
                    item.isError ? 'text-rose-400' : isCrtMode ? 'text-cyan-300/90 [text-shadow:0_0_8px_rgba(6,182,212,0.3)]' : 'text-slate-300'
                  }`}
                >
                  {item.output}
                </pre>
              )}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-900 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 relative z-30">
          <span className="shrink-0 text-slate-400">Commandes rapides :</span>
          {['pwd', 'ls -la', 'cd documents', 'cat readme.txt', 'chmod 600 config_exposee.env', 'cat /var/log/auth.log', 'help'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setInputVal(cmd);
                AudioService.playKeypress();
              }}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors shrink-0"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input prompt line */}
        <form onSubmit={handleCommandSubmit} className="bg-slate-900/80 px-4 py-2.5 border-t border-slate-800 flex items-center gap-2 relative z-30">
          <span className="text-cyan-400 font-semibold whitespace-nowrap">apprenant@cyber-box:{cwd}$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              AudioService.playKeypress();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tapez une commande (ex: pwd, ls -la, help)..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded text-xs transition-colors shrink-0"
          >
            Exécuter
          </button>
        </form>
      </div>
    </div>
  );
};
