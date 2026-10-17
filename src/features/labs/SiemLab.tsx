import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../../core/services/storageService';
import { AudioService } from '../../core/services/audioService';
import { useProgress } from '../../shared/hooks/useProgress';

export interface SiemLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  service: 'sshd' | 'firewall' | 'nginx' | 'sudo' | 'dns';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'success' | 'failure' | 'blocked' | 'alert';
}

export interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  isEnabled: boolean;
  alertSeverity: 'medium' | 'high' | 'critical';
  mitreTechnique: string;
}

export interface SecurityIncident {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  matchedLogsCount: number;
  attackerIp: string;
  targetHost: string;
  mitreId: string;
  correctAction: 'block-ip' | 'isolate-host' | 'revoke-user';
  explanation: string;
}

const INITIAL_LOGS: SiemLog[] = [
  {
    id: 'log-101',
    timestamp: '10:14:02',
    sourceIp: '198.51.100.23',
    destIp: '192.168.1.10',
    service: 'sshd',
    severity: 'medium',
    message: 'Failed password for invalid user admin from 198.51.100.23 port 45120 ssh2',
    status: 'failure'
  },
  {
    id: 'log-102',
    timestamp: '10:14:04',
    sourceIp: '198.51.100.23',
    destIp: '192.168.1.10',
    service: 'sshd',
    severity: 'medium',
    message: 'Failed password for invalid user root from 198.51.100.23 port 45124 ssh2',
    status: 'failure'
  },
  {
    id: 'log-103',
    timestamp: '10:14:06',
    sourceIp: '198.51.100.23',
    destIp: '192.168.1.10',
    service: 'sshd',
    severity: 'medium',
    message: 'Failed password for user support from 198.51.100.23 port 45128 ssh2',
    status: 'failure'
  },
  {
    id: 'log-104',
    timestamp: '10:14:08',
    sourceIp: '198.51.100.23',
    destIp: '192.168.1.10',
    service: 'sshd',
    severity: 'high',
    message: 'Failed password for user support from 198.51.100.23 port 45132 ssh2',
    status: 'failure'
  },
  {
    id: 'log-105',
    timestamp: '10:15:30',
    sourceIp: '192.168.1.105',
    destIp: '203.0.113.88',
    service: 'firewall',
    severity: 'critical',
    message: 'OUTBOUND TCP connection to 203.0.113.88:4444 established (possible reverse shell)',
    status: 'alert'
  },
  {
    id: 'log-106',
    timestamp: '10:16:12',
    sourceIp: '192.168.1.50',
    destIp: '192.168.1.1',
    service: 'dns',
    severity: 'low',
    message: 'DNS query A cyberacademy.fr resolved to 198.51.100.42',
    status: 'success'
  },
  {
    id: 'log-107',
    timestamp: '10:17:45',
    sourceIp: '185.220.101.5',
    destIp: '192.168.1.20',
    service: 'nginx',
    severity: 'medium',
    message: 'GET /.env HTTP/1.1 404 File not found (Web vulnerability scanner probe)',
    status: 'blocked'
  },
  {
    id: 'log-108',
    timestamp: '10:17:48',
    sourceIp: '185.220.101.5',
    destIp: '192.168.1.20',
    service: 'nginx',
    severity: 'medium',
    message: 'GET /wp-config.php.bak HTTP/1.1 404 (Sensible file leak scan)',
    status: 'blocked'
  },
  {
    id: 'log-109',
    timestamp: '10:19:00',
    sourceIp: '192.168.1.105',
    destIp: '192.168.1.105',
    service: 'sudo',
    severity: 'high',
    message: 'apprenant : TTY=pts/1 ; PWD=/tmp ; USER=root ; COMMAND=/bin/bash (Suspicious root shell)',
    status: 'alert'
  }
];

const INCIDENTS_DATA: SecurityIncident[] = [
  {
    id: 'inc-1',
    ruleId: 'rule-ssh-bruteforce',
    title: 'Alerte SIEM #4102 : Attaque par Force Brute SSH Détectée',
    description: 'Une adresse IP externe inconnue (198.51.100.23) a généré 4 échecs d\'authentification en moins de 10 secondes ciblant les comptes privilégiés root, admin et support.',
    matchedLogsCount: 4,
    attackerIp: '198.51.100.23',
    targetHost: 'srv-ssh-prod (192.168.1.10)',
    mitreId: 'T1110.001 (Password Guessing)',
    correctAction: 'block-ip',
    explanation: 'La réponse immédiate du SOC consiste à bannir l\'adresse IP source 198.51.100.23 au niveau du pare-feu périmétrique (règle DROP) et activer Fail2ban pour neutraliser le balayage automatisé.'
  },
  {
    id: 'inc-2',
    ruleId: 'rule-c2-beacon',
    title: 'Alerte SIEM #4105 : Connexion Sortante vers Port Non-Standard 4444 (Reverse Shell)',
    description: 'L\'hôte interne 192.168.1.105 a ouvert un tunnel TCP sortant vers 203.0.113.88 sur le port 4444, caractéristique d\'une balise de Command & Control (C2) Metasploit.',
    matchedLogsCount: 1,
    attackerIp: '203.0.113.88',
    targetHost: 'workstation-105 (192.168.1.105)',
    mitreId: 'T1071.001 (Application Layer Protocol: C2)',
    correctAction: 'isolate-host',
    explanation: 'Lorsqu\'un poste interne a établi un reverse shell avec un attaquant, l\'urgence absolue est d\'isoler immédiatement la machine du réseau local (quarantaine VLAN) pour bloquer les mouvements latéraux vers le reste de l\'entreprise.'
  }
];

export const SiemLab: React.FC = () => {
  const progress = useProgress();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident>(INCIDENTS_DATA[0]);
  const [selectedRemediation, setSelectedRemediation] = useState<'block-ip' | 'isolate-host' | 'revoke-user' | null>(null);
  const [remediationFeedback, setRemediationFeedback] = useState<{ submitted: boolean; isSuccess: boolean; text: string } | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return INITIAL_LOGS.filter((log) => {
      const matchService = selectedService === 'all' || log.service === selectedService;
      const matchSearch =
        searchQuery === '' ||
        log.sourceIp.includes(searchQuery) ||
        log.destIp.includes(searchQuery) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchService && matchSearch;
    });
  }, [searchQuery, selectedService]);

  const handleResolveIncident = () => {
    if (!selectedRemediation) return;

    const isSuccess = selectedRemediation === selectedIncident.correctAction;
    if (isSuccess) {
      AudioService.playSuccess();
      StorageService.recordLabTaskComplete(`siem-${selectedIncident.id}`, 'analyseMenaces');
      setRemediationFeedback({
        submitted: true,
        isSuccess: true,
        text: `Remédiation validée avec succès ! ${selectedIncident.explanation}`
      });
    } else {
      AudioService.playAlert();
      setRemediationFeedback({
        submitted: true,
        isSuccess: false,
        text: 'Action non appropriée pour ce type d\'incident. Analysez la menace et réévaluez la priorité.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Console SIEM Pédagogique (Security Operations Center)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Surveillez le flux d'événements, corrélez les anomalies et appliquez les contre-mesures de remédiation en direct.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Flux de télémétrie actif</span>
          </div>
        </div>
      </div>

      {/* Incident Triage Alert Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-rose-400 font-bold block uppercase tracking-wider">
                Alerte Corrélation SOC
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white">{selectedIncident.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {INCIDENTS_DATA.map((inc) => (
              <button
                key={inc.id}
                onClick={() => {
                  setSelectedIncident(inc);
                  setSelectedRemediation(null);
                  setRemediationFeedback(null);
                  AudioService.playBlip();
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  selectedIncident.id === inc.id
                    ? 'bg-rose-950/40 border-rose-600 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {inc.id === 'inc-1' ? 'Incident #1 (SSH)' : 'Incident #2 (C2)'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
          {selectedIncident.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs font-mono mb-4">
          <div>
            <span className="text-slate-500 block text-[10px]">IP ATTAQUANT</span>
            <span className="text-rose-400 font-bold">{selectedIncident.attackerIp}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CIBLE</span>
            <span className="text-slate-200">{selectedIncident.targetHost}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CADRE MITRE ATT&CK</span>
            <span className="text-amber-300 font-bold">{selectedIncident.mitreId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ÉVÉNEMENTS CORRÉLÉS</span>
            <span className="text-cyan-400 font-bold">{selectedIncident.matchedLogsCount} journaux</span>
          </div>
        </div>

        {/* Remediation Selector & Decision Deck */}
        <div className="pt-2">
          {remediationFeedback?.submitted ? (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                remediationFeedback.isSuccess
                  ? 'bg-emerald-950/30 border-emerald-700/80 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/80 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {remediationFeedback.isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Incident Contenu & Neutralisé (+100 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Action Incomplète</span>
                  </>
                )}
              </div>
              <p className="text-slate-300">{remediationFeedback.text}</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-300">
                <strong className="text-white block mb-0.5">Décision d'analyste SOC :</strong>
                <span>Sélectionnez la procédure de remédiation prioritaire à ordonner :</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedRemediation('block-ip')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedRemediation === 'block-ip'
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Bannir l'IP au Pare-feu
                </button>

                <button
                  onClick={() => setSelectedRemediation('isolate-host')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedRemediation === 'isolate-host'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Isoler la machine du réseau
                </button>

                <button
                  onClick={() => setSelectedRemediation('revoke-user')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedRemediation === 'revoke-user'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Révoquer la session utilisateur
                </button>

                <button
                  onClick={handleResolveIncident}
                  disabled={!selectedRemediation}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Appliquer la remédiation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIEM Log Stream View */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl font-mono text-xs">
        {/* Search & Service Filter Toolbar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Query input */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par IP, service (ex: sshd, 198.51.100.23)..."
              className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
            />
          </div>

          {/* Quick service segmented filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['all', 'sshd', 'firewall', 'nginx', 'sudo'].map((svc) => (
              <button
                key={svc}
                onClick={() => setSelectedService(svc)}
                className={`px-2.5 py-1 text-[11px] rounded transition-colors uppercase ${
                  selectedService === svc
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {svc === 'all' ? 'Tous' : svc}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto max-h-80 select-text">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 sticky top-0 uppercase tracking-wider">
              <tr>
                <th className="p-2.5">Heure</th>
                <th className="p-2.5">Service</th>
                <th className="p-2.5">IP Source</th>
                <th className="p-2.5">IP Dest</th>
                <th className="p-2.5">Gravité</th>
                <th className="p-2.5">Message Journalisé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredLogs.map((log) => {
                let badgeColor = 'bg-slate-800 text-slate-300';
                if (log.severity === 'critical') badgeColor = 'bg-rose-950 text-rose-300 border border-rose-800';
                else if (log.severity === 'high') badgeColor = 'bg-amber-950 text-amber-300 border border-amber-800';
                else if (log.severity === 'medium') badgeColor = 'bg-sky-950 text-sky-300 border border-sky-800';

                return (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-2.5 text-slate-400 tabular-nums">{log.timestamp}</td>
                    <td className="p-2.5 font-bold text-cyan-300">{log.service}</td>
                    <td className="p-2.5 text-slate-200 tabular-nums">{log.sourceIp}</td>
                    <td className="p-2.5 text-slate-400 tabular-nums">{log.destIp}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${badgeColor}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 font-sans text-xs truncate max-w-md">
                      {log.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
