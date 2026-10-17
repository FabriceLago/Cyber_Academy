import React, { useState } from 'react';
import {
  Brain,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioService } from '../../core/services/audioService';
import { StorageService } from '../../core/services/storageService';
import { useProgress } from '../../shared/hooks/useProgress';

export interface Flashcard {
  id: string;
  category: 'ports' | 'concepts' | 'linux' | 'owasp' | 'defense';
  question: string;
  answer: string;
  mnemonique?: string;
  example: string;
  box: 1 | 2 | 3; // Leitner Box: 1 = Learning, 2 = Review, 3 = Mastered
}

const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    category: 'ports',
    question: 'Quel est le port réseau standard réservé pour le protocole SSH (Secure Shell) ?',
    answer: 'Port 22 (TCP)',
    mnemonique: '22 v\'la les flics... ou la connexion chiffrée sécurisée vers le terminal distant !',
    example: 'ssh etudiant@192.168.1.10 -p 22',
    box: 1
  },
  {
    id: 'fc-2',
    category: 'ports',
    question: 'Quel est le port réseau par défaut pour le service DNS (Domain Name System) ?',
    answer: 'Port 53 (UDP / TCP)',
    mnemonique: '53 comme un numéro d\'annuaire téléphonique d\'urgence pour traduire les noms de domaine en adresses IP.',
    example: 'dig @8.8.8.8 cyberacademy.fr (envoi d\'un datagramme UDP port 53)',
    box: 1
  },
  {
    id: 'fc-3',
    category: 'ports',
    question: 'Quelle est la différence de port entre HTTP (non chiffré) et HTTPS (chiffré TLS) ?',
    answer: 'Port 80 pour HTTP en clair, Port 443 pour HTTPS sécurisé.',
    mnemonique: '443 est plus grand que 80 : il intègre la couche supplémentaire de chiffrement TLS.',
    example: 'https://cyberacademy.fr négocie automatiquement sur le port 443.',
    box: 1
  },
  {
    id: 'fc-4',
    category: 'concepts',
    question: 'Que désignent les trois piliers de la Triade "CIA" en cybersécurité ?',
    answer: 'Confidentialité, Intégrité et Disponibilité (Availability en anglais).',
    mnemonique: 'C.I.A. : Seules les personnes autorisées lisent (C), les données ne sont pas altérées (I), et le service reste accessible quand on en a besoin (A).',
    example: 'Un ransomware viole la Disponibilité (fichiers chiffrés inaccessibles) et la Confidentialité.',
    box: 1
  },
  {
    id: 'fc-5',
    category: 'concepts',
    question: 'Quelle est la différence fondamentale entre le Chiffrement et le Hachage ?',
    answer: 'Le chiffrement est réversible avec une clé secrète (déchiffrement). Le hachage est une fonction à sens unique irréversible.',
    mnemonique: 'On peut mixer des fruits en smoothie (hachage), mais on ne peut pas reconstituer la pomme entière !',
    example: 'AES-256 pour chiffrer un disque dur (réversible), SHA-256 ou bcrypt pour stocker les mots de passe (irréversible).',
    box: 1
  },
  {
    id: 'fc-6',
    category: 'defense',
    question: 'Quels sont les trois mécanismes indispensables de protection des courriels contre le phishing ?',
    answer: 'SPF (qui a le droit d\'émettre), DKIM (signature anti-altération), DMARC (politique en cas d\'échec).',
    mnemonique: 'Le passeport (SPF), le sceau de cire (DKIM) et la consigne douanière (DMARC).',
    example: 'Un en-tête SPF: FAIL trahit une usurpation d\'identité du nom de domaine expéditeur.',
    box: 1
  },
  {
    id: 'fc-7',
    category: 'linux',
    question: 'Que signifie la permission octale "chmod 600 fichier.env" sous Linux ?',
    answer: 'Lecture et écriture (4 + 2 = 6) UNIQUEMENT pour le propriétaire. Aucun droit (0) pour le groupe et les autres.',
    mnemonique: '600 = "Mon secret et le mien seul". C\'est la permission idéale pour une clé privée SSH ou des mots de passe.',
    example: 'chmod 600 ~/.ssh/id_rsa',
    box: 1
  },
  {
    id: 'fc-8',
    category: 'owasp',
    question: 'Comment empêcher de façon définitive les injections SQL dans une application Web ?',
    answer: 'En utilisant systématiquement des Requêtes Préparées avec requêtes paramétrées (Prepared Statements / PDO / ORM).',
    mnemonique: 'Ne jamais concaténer de chaînes avec des variables utilisateur directes dans le code SQL.',
    example: 'SELECT * FROM users WHERE username = ? (le point d\'interrogation est un paramètre étanche).',
    box: 1
  }
];

export const FlashcardsView: React.FC = () => {
  const progress = useProgress();
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCards = cards.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );
  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    AudioService.playKeypress();
  };

  const handleResponse = (level: 'hard' | 'medium' | 'easy') => {
    if (!currentCard) return;

    let targetBox: 1 | 2 | 3 = currentCard.box;
    if (level === 'hard') {
      targetBox = 1;
      AudioService.playAlert();
    } else if (level === 'medium') {
      targetBox = 2;
      AudioService.playBlip();
    } else if (level === 'easy') {
      targetBox = 3;
      AudioService.playSuccess();
      StorageService.recordLabTaskComplete(`fc-${currentCard.id}`, 'defense');
    }

    // Update card in state
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, box: targetBox } : c))
    );

    // Advance to next card
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleShuffle = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    AudioService.playBlip();
  };

  const box1Count = cards.filter((c) => c.box === 1).length;
  const box2Count = cards.filter((c) => c.box === 2).length;
  const box3Count = cards.filter((c) => c.box === 3).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span>Flashcards & Répétition Espacée (Méthode Leitner)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ancrez durablement les ports, acronymes et réflexes de sécurité dans votre mémoire à long terme
          </p>
        </div>

        {/* Shuffle */}
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Mélanger le paquet</span>
        </button>
      </div>

      {/* Leitner Boxes Progress Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Boîte 1 : En apprentissage
          </span>
          <span className="text-lg font-bold text-rose-400 tabular-nums font-mono">{box1Count} cartes</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Boîte 2 : En révision
          </span>
          <span className="text-lg font-bold text-amber-400 tabular-nums font-mono">{box2Count} cartes</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Boîte 3 : Mémorisé
          </span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums font-mono">{box3Count} cartes</span>
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs">
        {[
          { key: 'all', label: 'Toutes les cartes' },
          { key: 'ports', label: 'Ports Réseau' },
          { key: 'concepts', label: 'Concepts & CIA' },
          { key: 'linux', label: 'Linux & Permissions' },
          { key: 'owasp', label: 'Sécurité Web OWASP' },
          { key: 'defense', label: 'Défense E-mail' }
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setSelectedCategory(cat.key);
              setCurrentIndex(0);
              setIsFlipped(false);
              AudioService.playBlip();
            }}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive 3D Flip Card */}
      {currentCard && (
        <div className="space-y-4">
          <div
            onClick={handleFlip}
            className="cursor-pointer min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative transition-all hover:border-slate-700 select-none group"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 uppercase font-semibold">
                Catégorie : {currentCard.category}
              </span>
              <span>
                Carte {currentIndex + 1} / {filteredCards.length}
              </span>
            </div>

            {/* Content Area */}
            <div className="my-auto text-center py-6">
              {!isFlipped ? (
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-3">
                    [QUESTION / NOTION]
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                    {currentCard.question}
                  </h3>
                  <div className="mt-6 text-xs text-slate-400 font-mono group-hover:text-cyan-300 flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Cliquez pour révéler la réponse</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                    [RÉPONSE DÉTAILLÉE]
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {currentCard.answer}
                  </div>

                  {currentCard.mnemonique && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-amber-300 max-w-lg mx-auto">
                      <strong>Astuce mnémotechnique :</strong> {currentCard.mnemonique}
                    </div>
                  )}

                  <div className="text-xs text-slate-400 font-mono pt-1">
                    <span className="text-slate-500">Exemple : </span>
                    {currentCard.example}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className="text-center text-[11px] text-slate-500 font-mono">
              {!isFlipped ? 'Astuce : Tentez de formuler la réponse à haute voix avant de retourner' : 'Évaluez votre niveau de maîtrise ci-dessous'}
            </div>
          </div>

          {/* Leitner Feedback Buttons (Appears when flipped) */}
          {isFlipped ? (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-300 font-semibold">
                Comment avez-vous trouvé cette notion ?
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResponse('hard')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Difficile / Oublié</span>
                </button>

                <button
                  onClick={() => handleResponse('medium')}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Hésitation</span>
                </button>

                <button
                  onClick={() => handleResponse('easy')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Facile / Maîtrisé (+15 XP)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleFlip}
                className="px-6 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                Révéler la réponse (Espace ou Clic)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
