import React, { useState } from 'react';
import {
  Radar,
  Server,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Search
} from 'lucide-react';
import { AudioService } from '../../core/services/audioService';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';

export interface ScannedPort {
  port: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'closed' | 'filtered';
  service: string;
  version: string;
  isVulnerable?: boolean;
  cve?: string;
  remediation?: string;
}

export interface NetworkHost {
  id: string;
  ip: string;
  hostname: string;
  os: string;
  role: string;
  ports: ScannedPort[];
}

const NETWORK_HOSTS: NetworkHost[] = [
  {
    id: 'host-1',
    ip: '192.168.1.1',
    hostname: 'gateway-firewall',
    os: 'Linux (OpenWrt 21.02)',
    role: 'Passerelle & Pare-feu d\'accès',
    ports: [
      { port: 53, protocol: 'tcp', state: 'open', service: 'domain', version: 'dnsmasq 2.85' },
      { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'uHTTPd' },
      { port: 443, protocol: 'tcp', state: 'open', service: 'ssl/https', version: 'uHTTPd TLS' }
    ]
  },
  {
    id: 'host-2',
    ip: '192.168.1.10',
    hostname: 'srv-web-prod',
    os: 'Linux (Ubuntu 22.04 LTS)',
    role: 'Serveur Web Public',
    ports: [
      { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu' },
      { port: 80, protocol: 'tcp', state: 'open', service: 'http', version: 'Apache httpd 2.4.52' },
      { port: 443, protocol: 'tcp', state: 'open', service: 'ssl/http', version: 'Apache SSL TLS 1.3' }
    ]
  },
  {
    id: 'host-3',
    ip: '192.168.1.25',
    hostname: 'srv-legacy-files',
    os: 'Linux (Debian 7 Wheezy - Obsolète)',
    role: 'Serveur de Partage Interne (Ancien)',
    ports: [
      {
        port: 21,
        protocol: 'tcp',
        state: 'open',
        service: 'ftp',
        version: 'vsftpd 2.3.4 (Backdoor Smileys)',
        isVulnerable: true,
        cve: 'CVE-2011-2523 (Score CVSS 9.8)',
        remediation: 'Désactiver immédiatement vsftpd 2.3.4 et basculer sur SFTP/SSH sécurisé.'
      },
      { port: 445, protocol: 'tcp', state: 'open', service: 'netbios-ssn', version: 'Samba smbd 3.6' }
    ]
  },
  {
    id: 'host-4',
    ip: '192.168.1.80',
    hostname: 'srv-database-backend',
    os: 'Linux (Debian 12 Bookworm)',
    role: 'Base de données interne',
    ports: [
      { port: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 9.2' },
      {
        port: 3306,
        protocol: 'tcp',
        state: 'open',
        service: 'mysql',
        version: 'MySQL 8.0.35 (Exposition non restreinte)',
        isVulnerable: true,
        cve: 'Mauvaise configuration réseau',
        remediation: 'Lier MySQL à 127.0.0.1 (bind-address) pour interdire tout accès direct depuis le réseau local.'
      }
    ]
  }
];

export const NmapScannerLab: React.FC = () => {
  const progress = useProgress();
  const [selectedScanType, setSelectedScanType] = useState<'-sn' | '-sT' | '-sV' | '-A'>('-sV');
  const [targetSubnet, setTargetSubnet] = useState<string>('192.168.1.0/24');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanOutput, setScanOutput] = useState<string[]>([
    'Cyber Academy — Scanner Réseau Éthique (Inspiré de Nmap v7.94)',
    'Périmètre autorisé : Réseau local de laboratoire 192.168.1.0/24.',
    'Sélectionnez une option de balayage et cliquez sur "Lancer le scan réseau".'
  ]);
  const [discoveredHosts, setDiscoveredHosts] = useState<NetworkHost[]>([]);
  const [selectedHostId, setSelectedHostId] = useState<string>(NETWORK_HOSTS[2].id);
  const [fixedVulnerabilities, setFixedVulnerabilities] = useState<string[]>([]);

  const handleLaunchScan = () => {
    setIsScanning(true);
    AudioService.playKeypress();
    setScanOutput([
      `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-17 10:20 CEST`,
      `Nmap scan report for ${targetSubnet}`,
      `Initiating ARP Ping Scan & Port Discovery...`
    ]);

    setTimeout(() => {
      setDiscoveredHosts(NETWORK_HOSTS);
      setIsScanning(false);
      AudioService.playSuccess();

      let lines: string[] = [
        `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-17 10:20 CEST`,
        `Initiating scan with arguments: nmap ${selectedScanType} ${targetSubnet}`,
        `Host discovery: 4 hosts up (latency < 0.001s).`,
        `--------------------------------------------------------------------------------`
      ];

      NETWORK_HOSTS.forEach((host) => {
        lines.push(`\nNmap scan report for ${host.hostname} (${host.ip})`);
        lines.push(`Host is up (${host.role}). OS: ${host.os}`);
        lines.push(`PORT     STATE SERVICE       VERSION`);
        host.ports.forEach((p) => {
          const vulnMark = p.isVulnerable ? ' [!] CRITIQUE : ' + p.cve : '';
          lines.push(`${String(p.port).padEnd(4)}/${p.protocol} ${p.state.padEnd(5)} ${p.service.padEnd(13)} ${p.version}${vulnMark}`);
        });
      });

      lines.push(`\nNmap done: 4 IP addresses (4 hosts up) scanned in 1.42 seconds.`);
      setScanOutput(lines);
      StorageService.recordLabTaskComplete('task-nmap-scan', 'reseau');
    }, 1200);
  };

  const handleApplyRemediation = (hostId: string, portNumber: number) => {
    const key = `${hostId}-${portNumber}`;
    if (!fixedVulnerabilities.includes(key)) {
      setFixedVulnerabilities((prev) => [...prev, key]);
      AudioService.playSuccess();
      StorageService.recordLabTaskComplete(`task-fix-${key}`, 'defense');
    }
  };

  const currentHost = discoveredHosts.find((h) => h.id === selectedHostId) || NETWORK_HOSTS[2];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-400" />
              <span>Cartographie & Scanner Réseau Simulé (Inspiré de Nmap)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Découvrez les hôtes actifs, identifiez les services ouverts et détectez les vulnérabilités de version.
            </p>
          </div>

          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Périmètre de laboratoire autorisé</span>
          </div>
        </div>
      </div>

      {/* Scanner Control Deck */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Target IP */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Cible :</span>
            <input
              type="text"
              value={targetSubnet}
              onChange={(e) => setTargetSubnet(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Scan flags */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
            {[
              { flag: '-sn', label: 'Ping Scan (-sn)' },
              { flag: '-sT', label: 'TCP Scan (-sT)' },
              { flag: '-sV', label: 'Détection Versions (-sV)' },
              { flag: '-A', label: 'Audit Complet (-A)' }
            ].map((item) => (
              <button
                key={item.flag}
                onClick={() => {
                  setSelectedScanType(item.flag as any);
                  AudioService.playBlip();
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedScanType === item.flag
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleLaunchScan}
            disabled={isScanning}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isScanning ? 'Balayage en cours...' : 'Lancer le scan Nmap'}</span>
          </button>
        </div>

        {/* Live Nmap Terminal Output */}
        <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1 select-text">
          {scanOutput.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                line.includes('[!] CRITIQUE')
                  ? 'text-rose-400 font-bold'
                  : line.startsWith('Nmap scan report')
                  ? 'text-cyan-300 font-bold'
                  : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Discovered Hosts & Vulnerability Assessment */}
      {discoveredHosts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hosts Map list (4 cols) */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
            <div className="p-3 bg-slate-900 text-xs font-bold text-white flex items-center justify-between">
              <span>Hôtes Détectés ({discoveredHosts.length})</span>
              <span className="text-[10px] font-mono text-cyan-400">Cartographie active</span>
            </div>

            {discoveredHosts.map((host) => {
              const isSelected = host.id === currentHost.id;
              const hasVuln = host.ports.some((p) => p.isVulnerable);

              return (
                <button
                  key={host.id}
                  onClick={() => {
                    setSelectedHostId(host.id);
                    AudioService.playBlip();
                  }}
                  className={`w-full text-left p-3.5 transition-colors focus:outline-none ${
                    isSelected ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400' : 'hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate">{host.hostname}</span>
                    <span className="text-[10px] font-mono text-slate-400">{host.ip}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mb-1.5">{host.role}</div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">{host.ports.length} ports ouverts</span>
                    {hasVuln && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Faille critique
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Host Detailed Ports & Remediation (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-2">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>{currentHost.hostname} ({currentHost.ip})</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{currentHost.os} · {currentHost.role}</p>
                </div>
              </div>

              {/* Ports Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Port</th>
                      <th className="p-2.5">État</th>
                      <th className="p-2.5">Service</th>
                      <th className="p-2.5">Version Détectée</th>
                      <th className="p-2.5">Action Remédiation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {currentHost.ports.map((p) => {
                      const isRemediated = fixedVulnerabilities.includes(`${currentHost.id}-${p.port}`);

                      return (
                        <tr key={p.port} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-bold text-cyan-300">{p.port}/{p.protocol}</td>
                          <td className="p-2.5 text-emerald-400 font-semibold">{p.state}</td>
                          <td className="p-2.5 text-slate-300">{p.service}</td>
                          <td className="p-2.5 text-slate-200">
                            {p.version}
                            {p.isVulnerable && !isRemediated && (
                              <span className="block text-[10px] text-rose-400 font-sans font-bold mt-0.5">
                                [!] {p.cve}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5">
                            {p.isVulnerable ? (
                              isRemediated ? (
                                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Corrigé
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApplyRemediation(currentHost.id, p.port)}
                                  className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 text-[11px] transition-colors"
                                >
                                  Remédier faille
                                </button>
                              )
                            ) : (
                              <span className="text-[11px] text-slate-500 font-sans">Conforme</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Explanations */}
              {currentHost.ports.some((p) => p.isVulnerable) && (
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>ANALYSE DE VULNÉRABILITÉ DU PENTESTER</span>
                  </div>
                  {currentHost.ports
                    .filter((p) => p.isVulnerable)
                    .map((p, i) => (
                      <div key={i} className="text-slate-300 text-xs space-y-0.5">
                        <strong className="text-white">Port {p.port} ({p.service}) :</strong>
                        <p className="text-slate-400 leading-relaxed">{p.remediation}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-slate-500 text-[11px] font-mono">
              <span>Méthodologie PTES & NIST SP 800-115</span>
              <span className="text-cyan-400">Audit éthique défensif</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
