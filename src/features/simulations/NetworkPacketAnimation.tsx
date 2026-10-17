import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ShieldCheck, ShieldAlert, Globe, Server, Laptop, Router } from 'lucide-react';
import { AudioService } from '../../core/services/audioService';

export type SimulationScenario = 'https-legit' | 'dns-resolution' | 'blocked-scan';

interface SimulationStep {
  stepIndex: number;
  currentNodeId: 'client' | 'dns' | 'router' | 'firewall' | 'server';
  title: string;
  description: string;
  packetStatus: 'in-transit' | 'approved' | 'blocked' | 'resolved';
  packetDetails: {
    layer2: string;
    ipSource: string;
    ipDest: string;
    protocol: string;
    portSource: string;
    portDest: string;
    payloadSummary: string;
  };
}

export const NetworkPacketAnimation: React.FC = () => {
  const [scenario, setScenario] = useState<SimulationScenario>('https-legit');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1800);

  const scenariosData: Record<SimulationScenario, SimulationStep[]> = {
    'https-legit': [
      {
        stepIndex: 0,
        currentNodeId: 'client',
        title: 'Étape 1 : Création du paquet sur le poste client',
        description: 'L\'apprenant saisit "https://cyberacademy.fr". Le navigateur génère un paquet TCP SYN sécurisé pour démarrer la négociation TLS vers le port 443.',
        packetStatus: 'in-transit',
        packetDetails: {
          layer2: 'MAC: 00:1A:2B:3C:4D:5E -> Routeur',
          ipSource: '192.168.1.50 (Privée)',
          ipDest: '198.51.100.42 (Publique)',
          protocol: 'TCP',
          portSource: '52410 (Éphémère)',
          portDest: '443 (HTTPS)',
          payloadSummary: 'TCP SYN [Négociation chiffrement]'
        }
      },
      {
        stepIndex: 1,
        currentNodeId: 'router',
        title: 'Étape 2 : Acheminement par le routeur (NAT)',
        description: 'Le routeur examine l\'IP de destination et applique la translation d\'adresse (NAT) pour relayer le paquet sur le réseau Internet mondial.',
        packetStatus: 'in-transit',
        packetDetails: {
          layer2: 'Routeur -> Passerelle FAI',
          ipSource: '82.65.12.98 (IP Publique box)',
          ipDest: '198.51.100.42 (Serveur Web)',
          protocol: 'TCP',
          portSource: '41902 (Port NAT)',
          portDest: '443 (HTTPS)',
          payloadSummary: 'TCP SYN [En transit WAN]'
        }
      },
      {
        stepIndex: 2,
        currentNodeId: 'firewall',
        title: 'Étape 3 : Inspection par le pare-feu d\'entreprise',
        description: 'Le pare-feu d\'entrée examine la règle : "AUTORISER le trafic entrant sur le port TCP 443 (HTTPS)". La trame est déclarée conforme et transmise.',
        packetStatus: 'approved',
        packetDetails: {
          layer2: 'Inspection Stateful Firewall',
          ipSource: '82.65.12.98',
          ipDest: '198.51.100.42',
          protocol: 'TCP (State: NEW)',
          portSource: '41902',
          portDest: '443 (HTTPS Autorisé)',
          payloadSummary: 'REGLE: ACCEPT (Politique Web Sécurisé)'
        }
      },
      {
        stepIndex: 3,
        currentNodeId: 'server',
        title: 'Étape 4 : Réception par le serveur Web',
        description: 'Le serveur Web reçoit le paquet SYN, alloue les ressources mémoire pour la session et répond par un paquet SYN-ACK. La connexion chiffrée est établie !',
        packetStatus: 'approved',
        packetDetails: {
          layer2: 'Interface serveur eth0',
          ipSource: '82.65.12.98',
          ipDest: '198.51.100.42',
          protocol: 'TCP / TLS 1.3',
          portSource: '41902',
          portDest: '443 (Serveur Nginx/Apache)',
          payloadSummary: 'Session établie : Handshake réussi'
        }
      }
    ],
    'dns-resolution': [
      {
        stepIndex: 0,
        currentNodeId: 'client',
        title: 'Étape 1 : Demande de résolution de nom',
        description: 'Le client ne connaît pas l\'adresse IP de "cyberacademy.fr". Il prépare une requête DNS UDP rapide vers le port 53.',
        packetStatus: 'in-transit',
        packetDetails: {
          layer2: 'Poste -> Cache local / Passerelle',
          ipSource: '192.168.1.50',
          ipDest: '1.1.1.1 (Serveur DNS)',
          protocol: 'UDP',
          portSource: '59312',
          portDest: '53 (DNS)',
          payloadSummary: 'Requête DNS : Quel est l\'IP de cyberacademy.fr ?'
        }
      },
      {
        stepIndex: 1,
        currentNodeId: 'dns',
        title: 'Étape 2 : Consultation de l\'annuaire DNS',
        description: 'Le résolveur DNS interroge sa base de données et les serveurs racine pour trouver l\'enregistrement A correspondant.',
        packetStatus: 'resolved',
        packetDetails: {
          layer2: 'Résolution de zone autoritaire',
          ipSource: '1.1.1.1',
          ipDest: '192.168.1.50',
          protocol: 'UDP',
          portSource: '53',
          portDest: '59312',
          payloadSummary: 'Réponse DNS : cyberacademy.fr IN A 198.51.100.42'
        }
      },
      {
        stepIndex: 2,
        currentNodeId: 'client',
        title: 'Étape 3 : Mise en cache et contact direct',
        description: 'Le client mémorise l\'adresse IP reçue dans son cache local. Il peut maintenant contacter directement le serveur Web.',
        packetStatus: 'approved',
        packetDetails: {
          layer2: 'Cache DNS local mis à jour',
          ipSource: '192.168.1.50',
          ipDest: '198.51.100.42',
          protocol: 'DNS Cache',
          portSource: '-',
          portDest: '-',
          payloadSummary: 'Prêt pour la navigation web'
        }
      }
    ],
    'blocked-scan': [
      {
        stepIndex: 0,
        currentNodeId: 'client',
        title: 'Étape 1 : Émission d\'une sonde non autorisée',
        description: 'Un attaquant ou un scanner de vulnérabilités tente d\'envoyer un paquet vers le port non sécurisé 23 (Telnet) pour tenter d\'ouvrir un shell à distance.',
        packetStatus: 'in-transit',
        packetDetails: {
          layer2: 'Scanner distant',
          ipSource: '203.0.113.88 (IP Suspecte)',
          ipDest: '198.51.100.42',
          protocol: 'TCP',
          portSource: '49901',
          portDest: '23 (Telnet - Port obsolète)',
          payloadSummary: 'Tentative de balayage furtif'
        }
      },
      {
        stepIndex: 1,
        currentNodeId: 'router',
        title: 'Étape 2 : Transit Internet',
        description: 'Le paquet franchit les routeurs intermédiaires qui ne s\'intéressent qu\'à l\'adresse IP de destination.',
        packetStatus: 'in-transit',
        packetDetails: {
          layer2: 'Transit WAN',
          ipSource: '203.0.113.88',
          ipDest: '198.51.100.42',
          protocol: 'TCP',
          portSource: '49901',
          portDest: '23 (Telnet)',
          payloadSummary: 'En route vers la cible'
        }
      },
      {
        stepIndex: 2,
        currentNodeId: 'firewall',
        title: 'Étape 3 : DÉTECTION ET BLOCAGE PAR LE PARE-FEU',
        description: 'ALERTE SÉCURITÉ : La politique de sécurité interdit tout flux sur le port 23. Le pare-feu détruit immédiatement le paquet (DROP) et enregistre une alerte SIEM.',
        packetStatus: 'blocked',
        packetDetails: {
          layer2: 'Pare-feu défensif',
          ipSource: '203.0.113.88',
          ipDest: '198.51.100.42',
          protocol: 'TCP Port 23',
          portSource: '49901',
          portDest: '23 (INTERDIT)',
          payloadSummary: 'ACTION: DROP - Paquet rejeté sans réponse'
        }
      }
    ]
  };

  const steps = scenariosData[scenario];
  const activeStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speedMs]);

  const handleScenarioChange = (newScenario: SimulationScenario) => {
    setScenario(newScenario);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    AudioService.playBlip();
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = steps[nextIdx];
      if (nextStep?.packetStatus === 'blocked') {
        AudioService.playAlert();
      } else if (nextStep?.packetStatus === 'approved') {
        AudioService.playSuccess();
      } else {
        AudioService.playBlip();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      AudioService.playBlip();
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    AudioService.playBlip();
  };

  // Node positioning
  const nodes = [
    { id: 'client', name: 'Poste Client', icon: Laptop, ip: '192.168.1.50' },
    { id: 'dns', name: 'Serveur DNS', icon: Globe, ip: '1.1.1.1' },
    { id: 'router', name: 'Routeur / NAT', icon: Router, ip: 'Passerelle' },
    { id: 'firewall', name: 'Pare-feu (Firewall)', icon: ShieldCheck, ip: 'Défense' },
    { id: 'server', name: 'Serveur Web Cible', icon: Server, ip: '198.51.100.42' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-slate-100">
      {/* Simulation Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Simulateur Interactif de Trajet Réseau</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Observez l'encapsulation et le filtrage des paquets en temps réel
          </p>
        </div>

        {/* Scenarios segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => handleScenarioChange('https-legit')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              scenario === 'https-legit'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Requête HTTPS (Port 443)
          </button>
          <button
            onClick={() => handleScenarioChange('dns-resolution')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              scenario === 'dns-resolution'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Résolution DNS (Port 53)
          </button>
          <button
            onClick={() => handleScenarioChange('blocked-scan')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              scenario === 'blocked-scan'
                ? 'bg-rose-500 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scan Bloqué (Port 23)
          </button>
        </div>
      </div>

      {/* Visual Canvas Stage */}
      <div className="p-6 bg-slate-950/40 relative">
        {/* Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
          {nodes.map((node) => {
            const isCurrent = activeStep.currentNodeId === node.id;
            const isBlockedNode = isCurrent && activeStep.packetStatus === 'blocked';
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isBlockedNode
                    ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-900/20'
                    : isCurrent
                    ? 'bg-cyan-950/50 border-cyan-400 ring-2 ring-cyan-500/20 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/80 border-slate-800 opacity-70'
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                    isBlockedNode
                      ? 'bg-rose-500 text-white'
                      : isCurrent
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isBlockedNode ? <ShieldAlert className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">{node.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{node.ip}</div>
                {isCurrent && (
                  <div
                    className={`mt-2 text-[10px] font-mono font-medium py-0.5 px-1.5 rounded-sm inline-block ${
                      isBlockedNode ? 'bg-rose-900/60 text-rose-300' : 'bg-cyan-900/60 text-cyan-200'
                    }`}
                  >
                    {isBlockedNode ? 'PAQUET BLOQUÉ' : 'PAQUET ACTIF'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Banner */}
        <div
          className={`mt-6 p-4 rounded-lg border transition-colors ${
            activeStep.packetStatus === 'blocked'
              ? 'bg-rose-950/30 border-rose-800/80'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-slate-800 text-cyan-400 shrink-0 mt-0.5">
              {activeStep.packetStatus === 'blocked' ? (
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{activeStep.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeStep.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Packet Inspector Deck */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Interactive Controls */}
        <div className="flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
            Contrôles d'animation
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              title="Étape précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex >= steps.length - 1}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              title="Étape suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Recommencer au début"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Étape {currentStepIndex + 1}/{steps.length}</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <span>Vitesse :</span>
            <button
              onClick={() => setSpeedMs(2400)}
              className={`px-2 py-0.5 rounded ${speedMs === 2400 ? 'bg-slate-800 text-cyan-300' : 'text-slate-500'}`}
            >
              Lente
            </button>
            <button
              onClick={() => setSpeedMs(1500)}
              className={`px-2 py-0.5 rounded ${speedMs === 1500 ? 'bg-slate-800 text-cyan-300' : 'text-slate-500'}`}
            >
              Normale
            </button>
            <button
              onClick={() => setSpeedMs(800)}
              className={`px-2 py-0.5 rounded ${speedMs === 800 ? 'bg-slate-800 text-cyan-300' : 'text-slate-500'}`}
            >
              Rapide
            </button>
          </div>
        </div>

        {/* Right: Real-time Packet Inspector (Tabular figures) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono">
          <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between border-b border-slate-800 pb-1">
            <span>INSPECTEUR DE TRAME (Wireshark Simulé)</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeStep.packetStatus === 'blocked'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              {activeStep.packetDetails.protocol}
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">IP Source :</span>
              <span className="text-cyan-300 tabular-nums">{activeStep.packetDetails.ipSource}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">IP Destination :</span>
              <span className="text-cyan-300 tabular-nums">{activeStep.packetDetails.ipDest}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Port Source :</span>
              <span className="tabular-nums">{activeStep.packetDetails.portSource}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Port Destination :</span>
              <span className="text-amber-300 font-bold tabular-nums">{activeStep.packetDetails.portDest}</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 flex items-start justify-between">
              <span className="text-slate-500">Charge utile :</span>
              <span className="text-slate-200 text-right font-sans font-medium text-[11px] max-w-[220px]">
                {activeStep.packetDetails.payloadSummary}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
