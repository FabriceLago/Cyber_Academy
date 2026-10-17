import React, { useState } from 'react';
import { Terminal, Mail, Cpu, Activity, Globe, Radar } from 'lucide-react';
import { TerminalLab } from './TerminalLab';
import { PhishingLab } from './PhishingLab';
import { NetworkPacketAnimation } from '../simulations/NetworkPacketAnimation';
import { SiemLab } from './SiemLab';
import { OwaspLab } from './OwaspLab';
import { NmapScannerLab } from './NmapScannerLab';

export const CyberLabView: React.FC = () => {
  const [activeLabTab, setActiveLabTab] = useState<'terminal' | 'phishing' | 'network' | 'siem' | 'owasp' | 'nmap'>('terminal');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Cyber Lab — Espaces de Simulation</h2>
          <p className="text-sm text-slate-400 mt-1">
            Environnements isolés et interactifs pour pratiquer sans risque
          </p>
        </div>

        {/* Lab selector segmented tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setActiveLabTab('terminal')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'terminal'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Linux</span>
          </button>

          <button
            onClick={() => setActiveLabTab('phishing')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'phishing'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Détection Phishing</span>
          </button>

          <button
            onClick={() => setActiveLabTab('network')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'network'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Paquets Réseau</span>
          </button>

          <button
            onClick={() => setActiveLabTab('siem')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'siem'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Console SIEM SOC</span>
          </button>

          <button
            onClick={() => setActiveLabTab('owasp')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'owasp'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bac à Sable OWASP (Web)</span>
          </button>

          <button
            onClick={() => setActiveLabTab('nmap')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeLabTab === 'nmap'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>Scanner Réseau (Nmap)</span>
          </button>
        </div>
      </div>

      {/* Render Active Lab */}
      {activeLabTab === 'terminal' && <TerminalLab />}
      {activeLabTab === 'phishing' && <PhishingLab />}
      {activeLabTab === 'network' && <NetworkPacketAnimation />}
      {activeLabTab === 'siem' && <SiemLab />}
      {activeLabTab === 'owasp' && <OwaspLab />}
      {activeLabTab === 'nmap' && <NmapScannerLab />}
    </div>
  );
};
