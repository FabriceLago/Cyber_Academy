import { LearningPath, Lesson, Quiz, PhishingEmail } from '../types/cyber.types';

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1-1',
    lessonId: 'lesson-1-1',
    title: 'Validation : Architecture d\'un système informatique',
    passingScore: 75,
    questions: [
      {
        id: 'q1-1',
        question: 'Quel est le rôle fondamental du système d\'exploitation (OS) vis-à-vis du matériel ?',
        type: 'single',
        explanation: 'L\'OS fait office d\'arbitre et d\'intermédiaire indispensable : il empêche les programmes d\'accéder de façon anarchique au processeur, à la mémoire et aux périphériques.',
        options: [
          {
            id: 'opt1',
            text: 'Il sert uniquement à afficher une interface graphique avec des icônes.',
            isCorrect: false,
            explanation: 'Incorrect. De nombreux systèmes d\'exploitation (serveurs Linux notamment) fonctionnent sans aucune interface graphique.'
          },
          {
            id: 'opt2',
            text: 'Il gère et isole les ressources matérielles (RAM, CPU, stockage) entre les différents programmes.',
            isCorrect: true,
            explanation: 'Exact ! C\'est le rôle du noyau (kernel) : assurer la répartition équitable et isolée des ressources.'
          },
          {
            id: 'opt3',
            text: 'Il remplace les puces mémoire quand celles-ci sont saturées.',
            isCorrect: false,
            explanation: 'Incorrect. L\'OS gère l\'espace mémoire mais ne remplace pas le composant physique.'
          }
        ]
      },
      {
        id: 'q1-2',
        question: 'Que se passe-t-il pour les données stockées en mémoire vive (RAM) lors d\'une coupure d\'alimentation ?',
        type: 'single',
        explanation: 'La RAM est une mémoire volatile. Dès que l\'alimentation électrique est coupée, tous les électrons se déchargent et les données sont perdues.',
        options: [
          {
            id: 'opt1',
            text: 'Toutes les données en mémoire vive sont immédiatement effacées.',
            isCorrect: true,
            explanation: 'Correct ! C\'est la définition d\'une mémoire volatile, contrairement au disque SSD/HDD qui est persistant.'
          },
          {
            id: 'opt2',
            text: 'Les données sont automatiquement copiées sur la carte mère pour être restaurées.',
            isCorrect: false,
            explanation: 'Incorrect. Sans alimentation, la RAM perd son contenu instantanément.'
          },
          {
            id: 'opt3',
            text: 'Elles sont sauvegardées dans le processeur.',
            isCorrect: false,
            explanation: 'Incorrect. Les registres du processeur sont également volatils.'
          }
        ]
      },
      {
        id: 'q1-3',
        question: 'En cybersécurité, pourquoi isole-t-on les processus les uns des autres dans la mémoire ?',
        type: 'single',
        explanation: 'L\'isolation de l\'espace d\'adressage mémoire garantit qu\'une application malveillante ou corrompue ne puisse pas lire les mots de passe ou les données privées d\'un autre logiciel en cours d\'exécution.',
        options: [
          {
            id: 'opt1',
            text: 'Pour empêcher une application de lire ou modifier les données privées d\'une autre application.',
            isCorrect: true,
            explanation: 'Parfait ! L\'isolation mémoire (Memory Protection) est un pilier de la sécurité moderne.'
          },
          {
            id: 'opt2',
            text: 'Pour augmenter artificiellement la vitesse de connexion à Internet.',
            isCorrect: false,
            explanation: 'Incorrect. La mémoire locale et la bande passante réseau sont des concepts différents.'
          },
          {
            id: 'opt3',
            text: 'Pour éviter que l\'écran ne s\'éteigne pendant un téléchargement.',
            isCorrect: false,
            explanation: 'Incorrect. Ceci dépend des paramètres de gestion d\'énergie.'
          }
        ]
      }
    ]
  },
  {
    id: 'quiz-1-2',
    lessonId: 'lesson-1-2',
    title: 'Validation : Fichiers, arborescence et permissions',
    passingScore: 75,
    questions: [
      {
        id: 'q2-1',
        question: 'Sur un système de type Linux, que représente le symbole "/" (slash) initial dans un chemin comme "/etc/passwd" ?',
        type: 'single',
        explanation: 'Le "/" initial désigne la racine unique (root) de tout le système de fichiers sous Linux, à partir de laquelle s\'organisent tous les dossiers et disques montés.',
        options: [
          {
            id: 'opt1',
            text: 'Le dossier personnel de l\'utilisateur connecté.',
            isCorrect: false,
            explanation: 'Incorrect. Le dossier personnel est symbolisé par "~" ou se situe dans "/home/utilisateur".'
          },
          {
            id: 'opt2',
            text: 'La racine (root) absolue de toute l\'arborescence du système de fichiers.',
            isCorrect: true,
            explanation: 'Exactement ! Toute l\'arborescence démarre du sommet appelé la racine "/".'
          },
          {
            id: 'opt3',
            text: 'Une commande spéciale pour supprimer un dossier.',
            isCorrect: false,
            explanation: 'Incorrect. Le slash est un séparateur de hiérarchie.'
          }
        ]
      },
      {
        id: 'q2-2',
        question: 'Quels sont les trois droits élémentaires représentés par les lettres "r", "w", "x" sur un fichier ?',
        type: 'single',
        explanation: 'r = read (lire le contenu), w = write (modifier ou écrire), x = execute (exécuter le fichier comme un programme).',
        options: [
          {
            id: 'opt1',
            text: 'Read (Lecture), Write (Écriture), Execute (Exécution).',
            isCorrect: true,
            explanation: 'Exact ! C\'est la triade fondamentale des permissions Unix.'
          },
          {
            id: 'opt2',
            text: 'Reset (Réinitialiser), Warn (Avertir), Exit (Quitter).',
            isCorrect: false,
            explanation: 'Incorrect. Les termes r, w, x correspondent à Read, Write, Execute.'
          },
          {
            id: 'opt3',
            text: 'Root, Web, XML.',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      },
      {
        id: 'q2-3',
        question: 'Pourquoi la permission octale "777" (rwxrwxrwx) sur un fichier de configuration contenant des mots de passe est-elle une faute grave de sécurité ?',
        type: 'single',
        explanation: 'La permission 777 donne la lecture, l\'écriture et l\'exécution à TOUS les utilisateurs du système. N\'importe quel compte invité ou service piraté pourrait lire ou altérer ce mot de passe.',
        options: [
          {
            id: 'opt1',
            text: 'Elle permet à n\'importe quel utilisateur ou processus de la machine de lire et modifier le fichier.',
            isCorrect: true,
            explanation: 'Exact ! Un fichier sensible doit être restreint au strict minimum (ex: 600 ou 640).'
          },
          {
            id: 'opt2',
            text: 'Elle rend le fichier totalement invisible et inaccessible.',
            isCorrect: false,
            explanation: 'Incorrect. Elle l\'ouvre au contraire à tout le monde.'
          },
          {
            id: 'opt3',
            text: 'Elle force le redémarrage immédiat de l\'ordinateur.',
            isCorrect: false,
            explanation: 'Incorrect. Aucun redémarrage n\'est lié à cette permission.'
          }
        ]
      }
    ]
  },
  {
    id: 'quiz-1-3',
    lessonId: 'lesson-1-3',
    title: 'Validation : Prise en main du terminal de commande',
    passingScore: 75,
    questions: [
      {
        id: 'q3-1',
        question: 'Quelle commande permet d\'afficher le répertoire courant dans lequel on se trouve dans un terminal ?',
        type: 'single',
        explanation: 'La commande "pwd" signifie "Print Working Directory" (Afficher le répertoire de travail).',
        options: [
          {
            id: 'opt1',
            text: 'pwd',
            isCorrect: true,
            explanation: 'Bravo ! "pwd" (Print Working Directory) affiche le chemin absolu du dossier actif.'
          },
          {
            id: 'opt2',
            text: 'whereami',
            isCorrect: false,
            explanation: 'Incorrect. Cette commande n\'existe pas par défaut dans les terminaux Unix standard.'
          },
          {
            id: 'opt3',
            text: 'show',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      },
      {
        id: 'q3-2',
        question: 'Comment afficher les fichiers cachés (commençant par un point) avec la commande "ls" ?',
        type: 'single',
        explanation: 'L\'option "-a" (ou "--all") demande à "ls" d\'inclure tous les fichiers, y compris les fichiers cachés comme .bashrc ou .env.',
        options: [
          {
            id: 'opt1',
            text: 'ls -a',
            isCorrect: true,
            explanation: 'Exact ! L\'argument -a active l\'affichage de tous les fichiers (all).'
          },
          {
            id: 'opt2',
            text: 'ls --hidden',
            isCorrect: false,
            explanation: 'Incorrect. La syntaxe canonique est ls -a (ou ls -la pour voir aussi les permissions).'
          },
          {
            id: 'opt3',
            text: 'ls -h',
            isCorrect: false,
            explanation: 'Incorrect. -h signifie "human-readable" (tailles en Ko/Mo).'
          }
        ]
      },
      {
        id: 'q3-3',
        question: 'Quelle commande affiche le contenu d\'un fichier texte directement dans la console ?',
        type: 'single',
        explanation: 'La commande "cat" (de "concatenate") lit et imprime le contenu d\'un fichier texte dans le terminal.',
        options: [
          {
            id: 'opt1',
            text: 'cat nom_du_fichier',
            isCorrect: true,
            explanation: 'Très bien ! "cat" permet d\'examiner immédiatement le texte d\'un fichier.'
          },
          {
            id: 'opt2',
            text: 'open nom_du_fichier',
            isCorrect: false,
            explanation: 'Incorrect. "open" sous macOS ouvre l\'application graphique associée.'
          },
          {
            id: 'opt3',
            text: 'read nom_du_fichier',
            isCorrect: false,
            explanation: 'Incorrect. "read" en bash lit une entrée clavier dans un script.'
          }
        ]
      }
    ]
  },
  {
    id: 'quiz-2-1',
    lessonId: 'lesson-2-1',
    title: 'Validation : Voyage d\'un paquet réseau et adresses IP',
    passingScore: 75,
    questions: [
      {
        id: 'q4-1',
        question: 'À quoi sert le service DNS (Domain Name System) sur Internet ?',
        type: 'single',
        explanation: 'Le DNS est l\'annuaire téléphonique d\'Internet : il convertit un nom humain facile à retenir (ex: www.cyberacademy.fr) en adresse IP numérique utilisable par les machines (ex: 198.51.100.42).',
        options: [
          {
            id: 'opt1',
            text: 'À traduire un nom de domaine lisible en adresse IP numérique compréhensible par les routeurs.',
            isCorrect: true,
            explanation: 'Exact ! Sans DNS, il faudrait retenir par cœur chaque adresse IP.'
          },
          {
            id: 'opt2',
            text: 'À chiffrer les mots de passe bancaires sur les sites Web.',
            isCorrect: false,
            explanation: 'Incorrect. Le chiffrement est assuré par TLS/HTTPS, pas par le DNS de base.'
          },
          {
            id: 'opt3',
            text: 'À stocker les e-mails reçus pendant la nuit.',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      },
      {
        id: 'q4-2',
        question: 'Quelle est la différence fondamentale entre le protocole TCP et le protocole UDP ?',
        type: 'single',
        explanation: 'TCP garantit la remise en ordre et vérifie que chaque paquet est bien arrivé (avec acquittement ACK). UDP privilégie la vitesse brute sans garantie de livraison (utilisé pour la voix, vidéo en direct ou jeux).',
        options: [
          {
            id: 'opt1',
            text: 'TCP garantit la livraison ordonnée et vérifiée des paquets, alors qu\'UDP envoie les données rapidement sans vérification d\'arrivée.',
            isCorrect: true,
            explanation: 'Parfait ! TCP est orienté connexion fiable (Handshake 3 temps), UDP est sans connexion (best effort).'
          },
          {
            id: 'opt2',
            text: 'TCP ne fonctionne qu\'en Wi-Fi, tandis qu\'UDP ne fonctionne qu\'en câble Ethernet.',
            isCorrect: false,
            explanation: 'Incorrect. Les deux opèrent au niveau de la couche transport quel que soit le support physique.'
          },
          {
            id: 'opt3',
            text: 'UDP est réservé aux armées et TCP aux particuliers.',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      },
      {
        id: 'q4-3',
        question: 'Quel est le port réseau standard par défaut utilisé pour les connexions Web sécurisées chiffrées (HTTPS) ?',
        type: 'single',
        explanation: 'Le port standard réservé par l\'IANA pour HTTPS est le port 443 (le port 80 étant réservé au protocole HTTP non chiffré).',
        options: [
          {
            id: 'opt1',
            text: 'Port 443',
            isCorrect: true,
            explanation: 'Exact ! Le port 443 est le port HTTPS universel.'
          },
          {
            id: 'opt2',
            text: 'Port 80',
            isCorrect: false,
            explanation: 'Incorrect. Le port 80 correspond au HTTP en clair (non sécurisé).'
          },
          {
            id: 'opt3',
            text: 'Port 22',
            isCorrect: false,
            explanation: 'Incorrect. Le port 22 est le port d\'administration à distance SSH.'
          }
        ]
      }
    ]
  },
  {
    id: 'quiz-4-1',
    lessonId: 'lesson-4-1',
    title: 'Validation : Détection de phishing et ingénierie sociale',
    passingScore: 75,
    questions: [
      {
        id: 'q5-1',
        question: 'Un e-mail reçu annonce : "URGENT : Votre compte bancaire sera suspendu dans 2 heures si vous ne confirmez pas vos identifiants via ce lien". Quel est l\'indicateur majeur d\'ingénierie sociale ?',
        type: 'single',
        explanation: 'La création artificielle d\'un sentiment d\'urgence extrême et de panique est la technique reine de l\'ingénierie sociale pour court-circuiter l\'esprit critique de la victime.',
        options: [
          {
            id: 'opt1',
            text: 'L\'instauration d\'une urgence artificielle et la menace d\'une sanction imminente pour forcer une action impulsive.',
            isCorrect: true,
            explanation: 'Parfait ! Les attaquants exploitent la peur et la précipitation pour que la victime clique sans réfléchir.'
          },
          {
            id: 'opt2',
            text: 'Le fait que l\'e-mail soit écrit en langue française.',
            isCorrect: false,
            explanation: 'Incorrect. La langue seule n\'est pas un indicateur suffisant.'
          },
          {
            id: 'opt3',
            text: 'L\'e-mail a été envoyé un jour de semaine.',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      },
      {
        id: 'q5-2',
        question: 'Lorsque vous survolez avec la souris un lien dans un e-mail suspect, l\'adresse affichée est "http://paypal.securite-connexion-urgent.com". Est-ce le site officiel de PayPal ?',
        type: 'single',
        explanation: 'En observant le domaine parent (avant le premier slash), le domaine réel est "securite-connexion-urgent.com". Le mot "paypal" n\'est qu\'un sous-domaine trompeur configuré par l\'attaquant.',
        options: [
          {
            id: 'opt1',
            text: 'Non : le domaine principal est en réalité "securite-connexion-urgent.com", PayPal n\'est qu\'un sous-domaine leurre.',
            isCorrect: true,
            explanation: 'Exactement ! Le domaine de premier niveau enregistré est le dernier bloc avant le .com. C\'est une technique classique d\'usurpation.'
          },
          {
            id: 'opt2',
            text: 'Oui, car le mot "paypal" figure au tout début de l\'adresse web.',
            isCorrect: false,
            explanation: 'Danger ! N\'importe qui peut créer un sous-domaine "paypal.mon-site-malveillant.com".'
          },
          {
            id: 'opt3',
            text: 'Oui, car le mot "securite" figure dans le texte.',
            isCorrect: false,
            explanation: 'Incorrect. Les pirates ajoutent délibérément ces mots pour rassurer la victime.'
          }
        ]
      },
      {
        id: 'q5-3',
        question: 'Que signifie un résultat "SPF: FAIL" dans les en-têtes techniques d\'un courrier électronique ?',
        type: 'single',
        explanation: 'SPF (Sender Policy Framework) vérifie si le serveur qui a expédié l\'e-mail est officiellement autorisé par les propriétaires du domaine à envoyer des messages en son nom. Un "FAIL" indique que le serveur expéditeur n\'est pas légitime.',
        options: [
          {
            id: 'opt1',
            text: 'Le serveur qui a émis le message n\'est pas autorisé par le propriétaire légitime du nom de domaine (forte probabilité d\'usurpation).',
            isCorrect: true,
            explanation: 'Excellent ! C\'est une alerte technique majeure d\'usurpation d\'identité (spoofing).'
          },
          {
            id: 'opt2',
            text: 'Le destinataire a bloqué tous les messages entrants.',
            isCorrect: false,
            explanation: 'Incorrect. SPF concerne l\'autorisation de l\'expéditeur.'
          },
          {
            id: 'opt3',
            text: 'Le message est trop volumineux pour être distribué.',
            isCorrect: false,
            explanation: 'Incorrect.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1-1',
    moduleId: 'mod-1-1',
    pathId: 'path-1',
    order: 1,
    title: 'Comprendre un ordinateur et son système d\'exploitation',
    level: 'Débutant',
    durationMinutes: 20,
    prerequisites: ['Aucun prérequis informatique nécessaire'],
    measurableObjectives: [
      'Différencier le rôle du processeur (CPU), de la mémoire vive (RAM) et du stockage persistant (SSD/HDD)',
      'Expliquer la fonction d\'arbitrage et d\'isolation du système d\'exploitation (OS)',
      'Comprendre pourquoi la mémoire vive s\'efface lors de l\'extinction et ses impacts en sécurité'
    ],
    simplifiedExplanation: {
      introduction: 'Un ordinateur n\'a aucune intelligence magique. C\'est un ensemble de composants électroniques ultra-rapides capables de stocker et d\'exécuter des instructions binaires (des 0 et des 1). Pour qu\'un être humain puisse l\'utiliser sans manipuler des signaux électriques, un logiciel maître indispensable a été inventé : le système d\'exploitation.',
      analogy: 'Imaginez une grande cuisine de restaurant gastronomique. Le Chef cuisinier qui réalise les recettes à toute vitesse, c\'est le processeur (CPU). Le plan de travail où il pose temporairement ses casseroles et ingrédients pendant la préparation, c\'est la mémoire vive (RAM). La chambre froide où sont stockés les cartons d\'aliments pour des mois, c\'est le disque dur (SSD). Et le maître d\'hôtel qui s\'assure que personne ne vole les ingrédients d\'un autre chef et que la cuisine ne brûle pas, c\'est le système d\'exploitation (l\'OS).',
      coreConcepts: [
        {
          heading: '1. Le processeur (CPU) : Le moteur de calcul',
          body: 'Le CPU lit des instructions élémentaires à une vitesse vertigineuse (plusieurs milliards par seconde, mesurées en Gigahertz). Il ne sait faire que des calculs simples, mais il les fait avec une cadence prodigieuse.'
        },
        {
          heading: '2. La mémoire vive (RAM) : Le plan de travail éphémère',
          body: 'Lorsque vous ouvrez un navigateur ou un jeu, ses données sont chargées depuis le disque vers la RAM. La RAM est ultra-rapide mais totalement volatile : coupez l\'électricité, et tout disparaît en une fraction de seconde.'
        },
        {
          heading: '3. Le stockage persistant (SSD / Disque dur) : La mémoire longue durée',
          body: 'Même éteint, votre disque conserve vos photos, documents et programmes grâce à des cellules magnétiques ou de la mémoire flash. C\'est là que résident vos données quand elles dorment.'
        },
        {
          heading: '4. Le système d\'exploitation : Le gardien de la paix',
          body: 'Windows, macOS et Linux sont des systèmes d\'exploitation. Leur mission primordiale en sécurité est l\'isolation des processus : empêcher un programme malveillant d\'aller espionner les données d\'un autre programme hébergé sur la même machine.'
        }
      ]
    },
    glossary: [
      {
        term: 'Système d\'exploitation (OS)',
        definition: 'Programme fondamental qui pilote le matériel et fournit une interface de programmation et de contrôle aux logiciels applicatifs.',
        example: 'Linux Ubuntu, Windows 11 ou macOS Sonoma.'
      },
      {
        term: 'Mémoire volatile (RAM)',
        definition: 'Mémoire électronique à accès ultra-rapide dont le contenu est irrémédiablement perdu dès que l\'alimentation électrique cesse.',
        example: 'Vos onglets ouverts non enregistrés disparaissent si la batterie de votre PC se vide soudainement.'
      },
      {
        term: 'Processus',
        definition: 'Instance d\'un programme informatique en cours d\'exécution dans la mémoire du système.',
        example: 'Chaque onglet de navigateur ouvert constitue généralement un processus distinct.'
      },
      {
        term: 'Noyau (Kernel)',
        definition: 'Cœur central du système d\'exploitation qui a le contrôle absolu sur tout ce qui se passe sur l\'ordinateur et dialogue avec le matériel.',
        example: 'Le noyau Linux est le cœur commun qui fait tourner serveurs Web, supercalculateurs et téléphones Android.'
      }
    ],
    concreteExample: {
      scenario: 'Une application de traitement de texte et un navigateur bancaire tournent en même temps sur votre PC.',
      explanation: 'Sans système d\'exploitation pour cloisonner la mémoire vive, un pirate qui injecterait un script dans la page web pourrait directement lire dans la RAM ce que vous tapez dans votre traitement de texte. L\'OS crée des "murs étanches" invisibles entre chaque application.',
      takeaway: 'La cybersécurité repose d\'abord sur l\'intégrité et la robustesse de ces cloisons logiques assurées par le système d\'exploitation.'
    },
    visualDemoType: 'file-permissions',
    guidedExercise: {
      title: 'Vérifier la séparation des processus sur votre machine',
      instructions: [
        'Observez comment votre système liste les programmes en cours d\'exécution.',
        'Sous Windows, ouvrez le Gestionnaire des tâches avec Ctrl+Maj+Échap.',
        'Sous Linux ou Mac, la commande "top" ou "htop" dans le terminal affiche la liste vivante des processus avec leur consommation de mémoire RAM et de CPU.'
      ],
      hint: 'Chaque ligne correspond à un processus avec un identifiant numérique unique appelé PID (Process ID).',
      solution: 'Vous observez que chaque programme possède son propre PID et un espace mémoire alloué strictement délimité.'
    },
    quizId: 'quiz-1-1',
    summaryPoints: [
      'Le CPU calcule, la RAM sert d\'espace de travail éphémère et le SSD stocke de façon permanente.',
      'La mémoire vive (RAM) est volatile et perd toutes ses informations hors tension.',
      'Le système d\'exploitation garantit l\'isolation des processus pour empêcher qu\'une application ne pirate la mémoire d\'une autre.',
      'Tout système informatique repose sur cet équilibre matériel et logiciel.'
    ],
    successCriteria: [
      'Être capable d\'expliquer à un proche la différence concrète entre RAM et disque dur avec l\'analogie de la cuisine.',
      'Identifier le rôle du système d\'exploitation comme arbitre et protecteur de la mémoire.',
      'Obtenir au moins 75% au quiz de fin de leçon.'
    ]
  },
  {
    id: 'lesson-1-2',
    moduleId: 'mod-1-1',
    pathId: 'path-1',
    order: 2,
    title: 'Fichiers, dossiers et permissions fondamentales',
    level: 'Débutant',
    durationMinutes: 25,
    prerequisites: ['Leçon 1 : Comprendre un ordinateur et son système d\'exploitation'],
    measurableObjectives: [
      'Comprendre la structure hiérarchique d\'un système de fichiers sous forme d\'arbre',
      'Maîtriser les trois droits fondamentaux : Lecture (r), Écriture (w) et Exécution (x)',
      'Comprendre les trois catégories d\'utilisateurs : Propriétaire, Groupe et Autres (UGO)',
      'Identifier les permissions dangereuses comme le mode 777'
    ],
    simplifiedExplanation: {
      introduction: 'Toutes les informations sur un ordinateur sont enregistrées sous forme de fichiers rangés dans des dossiers (ou répertoires). Pour éviter que n\'importe qui puisse effacer des fichiers système vitaux ou lire les e-mails d\'un collègue, les systèmes d\'exploitation ont inventé un système de droits d\'accès (les permissions).',
      analogy: 'Considérez un immeuble d\'entreprises avec des bureaux fermés à clé. Il y a le propriétaire du bureau (qui a toutes les clés pour lire ses dossiers et en ajouter), ses collègues d\'équipe (le groupe, qui ont le droit de consulter certains dossiers partagés), et les visiteurs de passage dans le couloir (les autres, qui n\'ont le droit d\'entrer nulle part). Les permissions informatiques sont exactement ce trousseau de clés électronique.',
      coreConcepts: [
        {
          heading: '1. L\'arborescence : Un arbre à l\'envers',
          body: 'Sous Linux, tout commence à la racine unique, notée "/". Les sous-dossiers s\'emboîtent : /home pour les utilisateurs, /etc pour la configuration, /var pour les journaux d\'activité.'
        },
        {
          heading: '2. Les trois droits : Lecture, Écriture, Exécution',
          body: 'r (Read) permet d\'ouvrir et lire le contenu. w (Write) permet de modifier ou supprimer. x (Execute) permet d\'exécuter le fichier comme un logiciel.'
        },
        {
          heading: '3. Les trois bénéficiaires : UGO',
          body: 'User (le propriétaire du fichier), Group (les membres d\'un groupe autorisé), Others (tous les autres comptes de la machine).'
        },
        {
          heading: '4. La notation octale (chiffres 0 à 7)',
          body: 'r vaut 4, w vaut 2, x vaut 1. Si vous voulez Lecture + Écriture sans exécution, vous faites 4 + 2 = 6. Un fichier en 600 ne peut être lu et écrit QUE par son propriétaire.'
        }
      ]
    },
    glossary: [
      {
        term: 'Chemin absolu',
        definition: 'Chemin complet qui démarre depuis la racine du disque (commence toujours par un slash "/" sous Linux).',
        example: '/home/etudiant/rapports/bilan.txt'
      },
      {
        term: 'Chemin relatif',
        definition: 'Chemin calculé à partir de l\'endroit précis où vous vous trouvez actuellement.',
        example: './documents/notes.txt ou ../images/photo.png'
      },
      {
        term: 'Permissions octales',
        definition: 'Système numérique compact (ex: 755, 644, 600) codant les droits UGO sous forme de trois chiffres.',
        example: 'chmod 600 config.env protège les clés d\'API secrètes.'
      },
      {
        term: 'Principe du moindre privilège',
        definition: 'Règle d\'or en cybersécurité qui stipule qu\'un utilisateur ou programme ne doit recevoir que le strict minimum de droits nécessaires à sa tâche.',
        example: 'Ne jamais donner les droits d\'administrateur à un compte servant uniquement à surfer sur le Web.'
      }
    ],
    concreteExample: {
      scenario: 'Un développeur étourdi crée un fichier contenant les mots de passe de la base de données : db_secrets.txt, et lui attribue la permission "chmod 777 db_secrets.txt".',
      explanation: '777 signifie que le propriétaire (7), le groupe (7) et ABSOLUMENT TOUS LES UTILISATEURS de la machine (7) ont le droit de lire, modifier et exécuter ce fichier. Si le serveur héberge un site web compromis, l\'attaquant accède directement à ce fichier et pille l\'ensemble des comptes clients.',
      takeaway: 'La bonne pratique consiste à appliquer "chmod 600 db_secrets.txt" : seul le propriétaire légitime a le droit de lire et modifier son contenu.'
    },
    guidedExercise: {
      title: 'Calculer une permission octale en toute sécurité',
      instructions: [
        'Supposons que vous ayez un script nommé backup.sh.',
        'Vous souhaitez que le propriétaire puisse tout faire (r + w + x = 4 + 2 + 1 = 7).',
        'Le groupe doit seulement pouvoir le lire et l\'exécuter (r + x = 4 + 1 = 5).',
        'Les autres utilisateurs ne doivent avoir aucun droit du tout (0).',
        'Quel code octal allez-vous appliquer ?'
      ],
      hint: 'Additionnez les valeurs pour chaque tiers : Propriétaire = 7, Groupe = 5, Autres = 0.',
      solution: 'La commande à appliquer est : chmod 750 backup.sh'
    },
    associatedLabId: 'lab-terminal',
    quizId: 'quiz-1-2',
    summaryPoints: [
      'Le système de fichiers Linux s\'organise à partir d\'une racine unique symbolisée par "/".',
      'Les permissions définissent qui peut Lire (r=4), Écrire (w=2) et Exécuter (x=1).',
      'Les droits s\'appliquent à trois niveaux : Utilisateur propriétaire, Groupe, et Autres.',
      'Une permission 777 est une faille critique ; privilégiez toujours le principe du moindre privilège (ex: 600 ou 640).'
    ],
    successCriteria: [
      'Comprendre la décomposition d\'une ligne de permissions de type -rw-r--r--.',
      'Savoir calculer la valeur numérique d\'un droit en additionnant 4, 2 et 1.',
      'Réaliser la mission de sécurisation des permissions dans le Cyber Lab.'
    ]
  },
  {
    id: 'lesson-1-3',
    moduleId: 'mod-1-1',
    pathId: 'path-1',
    order: 3,
    title: 'Découvrir le terminal et l\'interpréteur de commandes',
    level: 'Débutant',
    durationMinutes: 25,
    prerequisites: ['Leçon 2 : Fichiers, dossiers et permissions fondamentales'],
    measurableObjectives: [
      'Comprendre pourquoi les professionnels de la cybersécurité privilégient le terminal aux interfaces graphiques',
      'Maîtriser les 6 commandes vitales : pwd, ls, cd, cat, mkdir, touch',
      'Savoir lire un prompt de commande et naviguer sans crainte dans une arborescence'
    ],
    simplifiedExplanation: {
      introduction: 'Le terminal effraie souvent les débutants avec son écran noir et son curseur clignotant. En réalité, c\'est le moyen le plus direct, rapide et puissant de dialoguer avec un ordinateur. Au lieu de cliquer sur des boutons préfabriqués par une interface graphique, vous donnez des ordres précis sous forme de texte.',
      analogy: 'L\'interface graphique (avec souris et fenêtres) est comme un menu fixe de fast-food avec 5 choix d\'assiettes préconçues. Le terminal, c\'est la cuisine ouverte où vous pouvez demander n\'importe quelle combinaison d\'ingrédients au gramme près. Pour administrer un serveur à l\'autre bout de la planète ou analyser des millions de lignes de journaux de sécurité, le terminal est 100 fois plus efficace.',
      coreConcepts: [
        {
          heading: '1. Le prompt : Votre point de repère',
          body: 'La ligne qui clignote affiche généralement votre nom d\'utilisateur, le nom de la machine et le dossier où vous vous trouvez (ex: etudiant@cyber-box:~$ ). Le symbole "$" indique que vous êtes un utilisateur standard, tandis que "#" signale le compte administrateur (root).'
        },
        {
          heading: '2. Se repérer : pwd',
          body: 'Tapez "pwd" et appuyez sur Entrée. Le système vous renvoie votre position exacte (ex: /home/etudiant).'
        },
        {
          heading: '3. Regarder autour de soi : ls',
          body: '"ls" liste les fichiers et dossiers visibles. Ajoutez "-la" ("ls -la") pour afficher les fichiers cachés et les permissions détaillées.'
        },
        {
          heading: '4. Se déplacer : cd',
          body: '"cd nom_dossier" vous fait entrer dans un dossier. "cd .." (avec deux points) vous fait remonter d\'un étage dans l\'arborescence. "cd ~" vous ramène directement à votre maison personnelle.'
        }
      ]
    },
    glossary: [
      {
        term: 'Terminal (CLI)',
        definition: 'Interface en ligne de commande (Command Line Interface) permettant d\'interagir avec l\'OS par saisie de texte.',
        example: 'Bash sous Linux, Zsh sous macOS, PowerShell sous Windows.'
      },
      {
        term: 'Shell',
        definition: 'Programme intermédiaire qui interprète les commandes tapées au clavier et demande au noyau du système de les exécuter.',
        example: 'GNU Bash est le shell le plus répandu au monde.'
      },
      {
        term: 'Fichier caché',
        definition: 'Fichier dont le nom commence par un point ".", masqué par défaut dans les explorateurs graphiques et la commande ls standard.',
        example: '.bash_history contient l\'historique des commandes saisies par l\'utilisateur.'
      }
    ],
    concreteExample: {
      scenario: 'Un attaquant a réussi à s\'infiltrer sur un serveur et a laissé un outil de piratage dans un fichier masqué nommé ".backdoor".',
      explanation: 'En ouvrant simplement l\'explorateur de fichiers standard, l\'icône n\'apparaît nulle part. L\'administrateur ouvre un terminal, tape "ls -la" et voit immédiatement la ligne ".backdoor" avec ses permissions et sa date exacte de création.',
      takeaway: 'Le terminal révèle la vérité brute du système sans les filtres cosmétiques des interfaces graphiques.'
    },
    guidedExercise: {
      title: 'Scénario de prise en main guidée',
      instructions: [
        '1. Affichez votre répertoire courant avec "pwd".',
        '2. Créez un nouveau dossier d\'entraînement : "mkdir cyber_training".',
        '3. Entrez dans ce dossier : "cd cyber_training".',
        '4. Créez un fichier texte vide : "touch secret.txt".',
        '5. Vérifiez la présence du fichier avec "ls -la".'
      ],
      hint: 'N\'oubliez pas l\'espace entre la commande et son argument !',
      solution: 'Vous venez d\'accomplir le cycle fondamental de gestion de fichiers en ligne de commande.'
    },
    associatedLabId: 'lab-terminal',
    quizId: 'quiz-1-3',
    summaryPoints: [
      'Le terminal est l\'outil central de tous les métiers de la cybersécurité.',
      '"pwd" affiche où vous êtes, "ls" affiche ce qui vous entoure, "cd" permet de vous déplacer.',
      '"ls -la" révèle les fichiers masqués et les attributs de sécurité.',
      'Tout se fait par saisie textuelle de commandes et d\'arguments séparés par des espaces.'
    ],
    successCriteria: [
      'Pouvoir naviguer dans un répertoire virtuel sans hésitation.',
      'Savoir créer un dossier et un fichier avec "mkdir" et "touch".',
      'Réussir les 4 exercices du laboratoire de terminal simulé.'
    ]
  },
  {
    id: 'lesson-2-1',
    moduleId: 'mod-2-1',
    pathId: 'path-2',
    order: 4,
    title: 'Adresses IP, ports et le voyage d\'un paquet réseau',
    level: 'Débutant',
    durationMinutes: 30,
    prerequisites: ['Leçon 1 : Comprendre un ordinateur et son système d\'exploitation'],
    measurableObjectives: [
      'Comprendre la structure et le rôle d\'une adresse IP (IPv4 vs IPv6)',
      'Visualiser comment les données sont découpées en paquets pour transiter sur le réseau',
      'Différencier l\'adresse IP (qui désigne la machine) du port de communication (qui désigne le service applicatif)',
      'Comprendre le rôle protecteur d\'un pare-feu (Firewall) inspectant les paquets'
    ],
    simplifiedExplanation: {
      introduction: 'Lorsque vous cliquez sur un lien pour consulter une page web, votre ordinateur ne télécharge pas un bloc solide d\'un seul coup. Vos données sont découpées en petits morceaux numérotés appelés des "paquets réseau", qui voyagent à la vitesse de la lumière à travers des dizaines d\'équipements à travers le globe avant d\'être réassemblés.',
      analogy: 'Imaginez que vous vouliez envoyer une encyclopédie de 1000 pages par la poste à un ami. Au lieu d\'expédier un colis de 30 kg impossible à porter, vous déchirez chaque page, la glissez dans une enveloppe numérotée avec l\'adresse postale du destinataire (l\'adresse IP), le numéro de la boîte aux lettres spécifique dans l\'immeuble (le numéro de port), et un accusé de réception (protocole TCP). Le facteur (le routeur) achemine chaque lettre par la route la plus rapide.',
      coreConcepts: [
        {
          heading: '1. L\'adresse IP : L\'adresse postale de la machine',
          body: 'Une adresse IPv4 est composée de 4 nombres séparés par des points (ex: 192.168.1.42 ou 8.8.8.8). Elle identifie de façon unique un appareil sur un réseau.'
        },
        {
          heading: '2. Les ports réseau : Les portes d\'entrée de l\'immeuble',
          body: 'Une même machine peut faire tourner à la fois un serveur Web, une boîte mail et un serveur de jeu. Pour que les données aillent au bon logiciel, on utilise des numéros de ports (0 à 65535). Le port 80/443 est pour le Web, le port 22 pour SSH, le port 53 pour le DNS.'
        },
        {
          heading: '3. L\'en-tête du paquet (Packet Header)',
          body: 'Chaque paquet contient une étiquette avec l\'IP source, l\'IP destination, le port source, le port destination et un numéro de séquence pour reconstituer le puzzle à l\'arrivée.'
        },
        {
          heading: '4. Le pare-feu (Firewall) : Le vigile à l\'entrée',
          body: 'Le pare-feu examine chaque paquet qui se présente. Si un paquet suspect tente de se connecter sur un port fermé ou provient d\'une adresse bannie, il est immédiatement détruit (DROP) sans jamais atteindre le serveur.'
        }
      ]
    },
    glossary: [
      {
        term: 'Paquet réseau',
        definition: 'Unité élémentaire de transmission de données découpée selon les protocoles de communication de la couche réseau.',
        example: 'Un fichier de 1 Mo est généralement découpé en environ 700 paquets de 1500 octets.'
      },
      {
        term: 'Port de communication',
        definition: 'Numéro logique (16 bits) assigné à une application spécifique pour recevoir et émettre des paquets réseau.',
        example: 'Le port 443 est réservé aux connexions web sécurisées chiffrées (HTTPS).'
      },
      {
        term: 'Routeur',
        definition: 'Équipement réseau qui examine l\'adresse IP de destination d\'un paquet et choisit le meilleur chemin suivant pour l\'acheminer vers sa cible.',
        example: 'Votre box Internet domestique agit comme un routeur entre vos appareils et le réseau mondial.'
      },
      {
        term: 'Pare-feu (Firewall)',
        definition: 'Dispositif de sécurité matériel ou logiciel filtrant les flux réseau selon des règles prédéfinies d\'autorisation ou de blocage.',
        example: 'Bloquer tous les flux entrants sauf ceux dirigés vers le port web 443.'
      }
    ],
    concreteExample: {
      scenario: 'Un pirate lance un balayage de ports (Port Scan) contre une entreprise pour trouver des failles.',
      explanation: 'Le pirate envoie des milliers de paquets vers tous les numéros de ports (de 1 à 1000). Le pare-feu de l\'entreprise détecte cette pluie anormale de paquets, repère l\'IP source agressive et bloque automatiquement tout paquet venant de cette provenance.',
      takeaway: 'Comprendre la structure d\'un paquet est indispensable tant pour acheminer les données légitimes que pour concevoir les défenses réseau.'
    },
    visualDemoType: 'network-packet',
    guidedExercise: {
      title: 'Observer les connexions réseau actives',
      instructions: [
        'Dans le simulateur d\'animation réseau ci-dessous :',
        '1. Lancez l\'animation en mode "Requête HTTPS Légitime".',
        '2. Suivez le déplacement du paquet de votre poste client jusqu\'au serveur.',
        '3. Inspectez l\'en-tête du paquet au niveau du pare-feu pour voir l\'IP et le port 443.',
        '4. Changez ensuite le scénario vers "Tentative de Scan Malveillant" pour observer le blocage par le pare-feu.'
      ],
      hint: 'Utilisez les boutons Pause et Pas-à-Pas pour observer l\'étiquette de chaque trame.',
      solution: 'Vous constatez que le pare-feu valide les paquets autorisés (port 443) et détruit les paquets illégitimes.'
    },
    quizId: 'quiz-2-1',
    summaryPoints: [
      'Les données transitent sous forme de paquets découpés avec une adresse IP source et destination.',
      'Les numéros de ports permettent d\'orienter le paquet vers la bonne application (443 pour HTTPS, 53 pour DNS, 22 pour SSH).',
      'Les routeurs orientent les paquets à travers le monde en examinant l\'adresse IP.',
      'Le pare-feu inspecte les en-têtes pour autoriser ou bloquer le trafic selon une politique de sécurité stricte.'
    ],
    successCriteria: [
      'Différencier sans hésiter une adresse IP d\'un numéro de port.',
      'Utiliser le simulateur interactif pour expliquer le trajet d\'un paquet.',
      'Réussir le quiz de validation du module réseau.'
    ]
  },
  {
    id: 'lesson-4-1',
    moduleId: 'mod-4-1',
    pathId: 'path-4',
    order: 5,
    title: 'Fondamentaux de la sécurité : l\'ingénierie sociale et le phishing',
    level: 'Débutant',
    durationMinutes: 30,
    prerequisites: ['Leçon 1 : Comprendre un ordinateur et son système d\'exploitation'],
    measurableObjectives: [
      'Définir l\'ingénierie sociale et les biais psychologiques exploités par les attaquants (peur, urgence, autorité)',
      'Identifier les 5 indices révélateurs d\'un courriel d\'hameçonnage (phishing)',
      'Savoir lire et analyser les en-têtes techniques d\'un e-mail (SPF, DKIM, domaine réel de l\'expéditeur)',
      'Pratiquer la détection d\'e-mails piégés dans le laboratoire d\'investigation'
    ],
    simplifiedExplanation: {
      introduction: 'Le maillon le plus ciblé en cybersécurité n\'est pas un câble ou un algorithme, mais l\'être humain. L\'ingénierie sociale consiste à manipuler psychologiquement une personne pour l\'amener à divulguer des informations confidentielles ou à exécuter une action dangereuse sans s\'en rendre compte.',
      analogy: 'Imaginez un cambrioleur qui n\'essaie pas de crocheter la serrure blindée d\'une banque. À la place, il enfile une fausse salopette de livreur, se présente avec un gros carton devant l\'accueil avec un faux badge, et demande poliment mais avec insistance au vigile de lui ouvrir la porte d\'accès réservée parce qu\'il est "en retard pour une livraison urgente". Le phishing applique cette même ruse dans votre boîte e-mail.',
      coreConcepts: [
        {
          heading: '1. Le levier de l\'urgence artificielle',
          body: '"Votre compte va être clôturé dans 2 heures", "Dernier avis avant poursuites judiciaires". L\'attaquant vous prive délibérément de votre temps de réflexion.'
        },
        {
          heading: '2. L\'usurpation d\'identité (Spoofing) et le Typosquattage',
          body: 'L\'attaquant achète un nom de domaine très proche du vrai (ex: www.micros0ft.com avec un zéro, ou secure-amzon.net) pour tromper l\'œil distrait de la victime.'
        },
        {
          heading: '3. Les liens cachés sous le texte',
          body: 'Le texte bleu affiché peut indiquer "www.ma-banque.fr", mais le vrai lien hypertexte en arrière-plan pointe vers "http://serveur-pirate-russe.ru/login". Le survol avec la souris révèle la supercherie.'
        },
        {
          heading: '4. Les en-têtes SPF et DKIM : La signature numérique des e-mails',
          body: 'Comme une lettre manuscrite sur laquelle n\'importe qui peut inscrire l\'adresse de retour qu\'il veut sur l\'enveloppe, le champ "De:" d\'un mail peut être falsifié. Les technologies SPF et DKIM vérifient cryptographiquement si le serveur d\'envoi est réellement mandaté par l\'expéditeur.'
        }
      ]
    },
    glossary: [
      {
        term: 'Hameçonnage (Phishing)',
        definition: 'Technique d\'attaque consistant à se faire passer pour un tiers de confiance (banque, employeur, impôts) afin de subtiliser des identifiants ou propager un rançongiciel.',
        example: 'Un e-mail prétendant venir de la Sécurité Sociale demandant vos coordonnées bancaires pour un remboursement fictif.'
      },
      {
        term: 'Ingénierie sociale',
        definition: 'Pratique de manipulation psychologique visant à exploiter la crédulité, la peur ou la bienveillance humaine pour contourner les défenses techniques.',
        example: 'Appeler un salarié en prétendant être le technicien du support informatique pour lui faire dicter son mot de passe.'
      },
      {
        term: 'SPF (Sender Policy Framework)',
        definition: 'Norme technique de vérification permettant au propriétaire d\'un nom de domaine de publier la liste des serveurs autorisés à envoyer des courriels avec ce nom.',
        example: 'Un enregistrement DNS indiquant : "Seuls les serveurs Google sont autorisés à envoyer des mails @mon-entreprise.com".'
      },
      {
        term: 'DKIM (DomainKeys Identified Mail)',
        definition: 'Signature cryptographique insérée dans les en-têtes d\'un courriel prouvant que le message n\'a pas été altéré en cours de route.',
        example: 'Une empreinte cryptographique vérifiable avec la clé publique du domaine.'
      }
    ],
    concreteExample: {
      scenario: 'Vous recevez un message prétendant provenir du PDG de votre société : "Bonjour, je suis en réunion confidentielle à l\'étranger, effectuez immédiatement un virement urgent de 25 000€ à ce fournisseur avant midi, gardez cela discret".',
      explanation: 'C\'est l\'attaque classique dite de "l\'Arnaque au Président". Elle combine autorité hiérarchique, urgence absolue et demande de secret. En vérifiant l\'adresse d\'expédition réelle ou en appelant directement le supérieur par un canal vérifié, l\'escroquerie s\'effondre instantanément.',
      takeaway: 'Ne jamais déroger aux procédures de sécurité sous prétexte d\'urgence ou de hiérarchie sans validation sur un canal secondaire indépendant.'
    },
    visualDemoType: 'phishing-inspection',
    guidedExercise: {
      title: 'Débusquer un e-mail piégé',
      instructions: [
        'Rendez-vous dans l\'onglet "Cyber Lab : Détecteur de Phishing".',
        'Ouvrez le premier e-mail de la boîte de réception simulée.',
        'Passez en mode "En-têtes bruts" pour observer les résultats SPF et DKIM.',
        'Recherchez la faute d\'orthographe dans le domaine de retour.',
        'Formulez votre verdict argumenté en sélectionnant les indices suspects.'
      ],
      hint: 'Méfiez-vous toujours des messages exigeant un changement de mot de passe immédiat avec un bouton cliquable.',
      solution: 'Vous découvrez que l\'en-tête Return-Path trahit un serveur non autorisé et que SPF est en statut FAIL.'
    },
    associatedLabId: 'lab-phishing',
    quizId: 'quiz-4-1',
    summaryPoints: [
      'L\'humain est la cible privilégiée des attaquants via l\'ingénierie sociale.',
      'Les signaux d\'alerte majeurs : urgence inhabituelle, demande de mot de passe ou virement, adresses proches mais inexactes.',
      'Toujours vérifier le vrai domaine de destination d\'un lien avant de cliquer.',
      'Les en-têtes techniques (SPF, DKIM, DMARC) permettent aux analystes de démasquer les usurpations.'
    ],
    successCriteria: [
      'Reconnaître les ressorts psychologiques d\'une tentative de manipulation.',
      'Classifier avec succès les 4 courriels du laboratoire pratique de phishing.',
      'Obtenir au moins 75% au quiz d\'évaluation.'
    ]
  }
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-1',
    levelNumber: 1,
    title: 'Culture Informatique & Fondations',
    slug: 'culture-informatique',
    tagline: 'Comprendre la machine de l\'intérieur sans aucun jargon préalable',
    description: 'Le point de départ idéal pour toute personne sans bagage technique : architecture matérielle, systèmes d\'exploitation, système de fichiers et découverte décomplexée du terminal.',
    durationHours: 6,
    modulesCount: 3,
    labsCount: 2,
    isAvailable: true,
    modules: [
      {
        id: 'mod-1-1',
        pathId: 'path-1',
        title: 'Composants, Système et Fichiers',
        description: 'Démystifier le processeur, la mémoire, l\'arborescence de fichiers et le terminal.',
        durationMinutes: 120,
        order: 1,
        lessons: INITIAL_LESSONS.slice(0, 3)
      }
    ]
  },
  {
    id: 'path-2',
    levelNumber: 2,
    title: 'Réseaux Informatiques',
    slug: 'reseaux-informatiques',
    tagline: 'Comment les données circulent, s\'échangent et sont inspectées',
    description: 'Adresses IP, masques, ports, DNS, DHCP, TCP vs UDP, modèle OSI et rôle fondamental des routeurs et pare-feux dans la défense d\'un réseau.',
    durationHours: 8,
    modulesCount: 4,
    labsCount: 3,
    isAvailable: true,
    modules: [
      {
        id: 'mod-2-1',
        pathId: 'path-2',
        title: 'Protocoles fondamentaux et paquets',
        description: 'Le voyage d\'un paquet IP, la résolution DNS et le filtrage pare-feu.',
        durationMinutes: 140,
        order: 1,
        lessons: [INITIAL_LESSONS[3]]
      }
    ]
  },
  {
    id: 'path-3',
    levelNumber: 3,
    title: 'Linux & Administration Système',
    slug: 'linux-administration',
    tagline: 'Devenir à l\'aise dans le système d\'exploitation du web et du cloud',
    description: 'Gestion des processus, utilisateurs, permissions avancées, analyse des journaux système (/var/log), gestion des services et durcissement (hardening).',
    durationHours: 10,
    modulesCount: 4,
    labsCount: 4,
    isAvailable: false,
    modules: []
  },
  {
    id: 'path-4',
    levelNumber: 4,
    title: 'Fondamentaux de la Cybersécurité',
    slug: 'fondamentaux-cyber',
    tagline: 'Triade CIA, cryptographie, ingénierie sociale et gestion des risques',
    description: 'Confidentialité, intégrité, disponibilité, authentification multifacteur (MFA), hachage vs chiffrement, détection du phishing et premiers réflexes de défense.',
    durationHours: 8,
    modulesCount: 4,
    labsCount: 3,
    isAvailable: true,
    modules: [
      {
        id: 'mod-4-1',
        pathId: 'path-4',
        title: 'Menaces humaines et défenses',
        description: 'Ingénierie sociale, hameçonnage, vérification cryptographique des expéditeurs.',
        durationMinutes: 90,
        order: 1,
        lessons: [INITIAL_LESSONS[4]]
      }
    ]
  },
  {
    id: 'path-5',
    levelNumber: 5,
    title: 'SOC & Analyste Cybersécurité Junior',
    slug: 'soc-analyste',
    tagline: 'Surveiller, détecter les anomalies et répondre aux incidents de sécurité',
    description: 'Fonctionnement d\'un SOC, collecte et corrélation SIEM, indicateurs de compromission (IOC), matrice MITRE ATT&CK et rédaction de rapports d\'incidents professionnels.',
    durationHours: 14,
    modulesCount: 5,
    labsCount: 5,
    isAvailable: false,
    modules: []
  },
  {
    id: 'path-6',
    levelNumber: 6,
    title: 'Sécurité Web & Applications',
    slug: 'securite-web',
    tagline: 'Comprendre et prévenir les vulnérabilités de l\'OWASP Top 10',
    description: 'Injections SQL, Cross-Site Scripting (XSS), failles de contrôle d\'accès, gestion des sessions, cookies sécurisés et audits d\'APIs modernes.',
    durationHours: 12,
    modulesCount: 5,
    labsCount: 5,
    isAvailable: false,
    modules: []
  },
  {
    id: 'path-7',
    levelNumber: 7,
    title: 'Pentesting Éthique & Tests d\'intrusion',
    slug: 'pentest-ethique',
    tagline: 'Penser comme un attaquant pour mieux protéger les systèmes autorisés',
    description: 'Cadre légal strict, reconnaissance passive et active, cartographie de cibles autorisées, analyse de vulnérabilités, exploitation contrôlée et rapport d\'audit.',
    durationHours: 14,
    modulesCount: 5,
    labsCount: 4,
    isAvailable: false,
    modules: []
  },
  {
    id: 'path-8',
    levelNumber: 8,
    title: 'Cloud & Sécurité DevSecOps',
    slug: 'cloud-devsecops',
    tagline: 'Sécuriser l\'infrastructure moderne, les conteneurs et les pipelines CI/CD',
    description: 'Permissions IAM dans le Cloud, stockage S3 sécurisé, conteneurs Docker, détection de secrets dans le code (Git leaks) et analyse statique SAST/DAST.',
    durationHours: 12,
    modulesCount: 4,
    labsCount: 4,
    isAvailable: false,
    modules: []
  },
  {
    id: 'path-9',
    levelNumber: 9,
    title: 'Spécialisations & Préparation à l\'Emploi',
    slug: 'preparation-emploi',
    tagline: 'Construire son portfolio technique et réussir les entretiens juniors',
    description: 'Fiches métiers (Analyste SOC, Pentester junior, Cloud Security), simulations d\'entretiens d\'embauche, questions techniques fréquentes et certification roadmap.',
    durationHours: 10,
    modulesCount: 4,
    labsCount: 2,
    isAvailable: false,
    modules: []
  }
];

export const PHISHING_EMAILS: PhishingEmail[] = [
  {
    id: 'mail-1',
    subject: 'URGENT : Suspension immédiate de votre accès bancaire professionnel',
    senderName: 'Sécurité Banque Pro',
    senderEmail: 'support@securite-banque-pro-verification.com',
    recipient: 'jean.dupont@entreprise.fr',
    date: 'Aujourd\'hui, 08:42',
    body: `Cher client,

Une tentative de connexion inhabituelle depuis une adresse IP située à l'étranger (Russie) a été détectée sur votre compte professionnel ce matin à 04h12.

Conformément à la directive européenne DSP2, votre accès sera temporairement suspendu dans les 2 heures si vous ne confirmez pas vos coordonnées.

Veuillez régulariser votre situation immédiatement en cliquant sur le lien ci-dessous :
-> https://auth-banque-pro.com/validation-identite

Cordialement,
Le Service Prévention des Fraudes`,
    headers: {
      returnPath: '<bounce@serveur-inconnu-vps992.net>',
      receivedFrom: 'mail.vps992.net (IP: 185.220.101.5)',
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'FAIL',
      replyTo: 'collecte-identifiants@gmail.com'
    },
    isPhishing: true,
    indicators: [
      {
        type: 'urgency',
        description: 'Urgence artificielle et menace de blocage sous 2 heures pour forcer une réaction impulsive sans réflexion.'
      },
      {
        type: 'sender',
        description: 'Nom de domaine de l\'expéditeur suspect et totalement différent du site officiel de la banque.'
      },
      {
        type: 'header',
        description: 'Les vérifications SPF et DKIM sont en statut FAIL : le serveur d\'émission n\'a aucune autorisation légitime.'
      },
      {
        type: 'link',
        description: 'Le lien pointe vers un nom de domaine tiers non sécurisé destiné à capturer vos identifiants.'
      }
    ],
    explanation: 'Cet e-mail est une attaque d\'hameçonnage flagrante. Le pirate mise sur la panique (suspension bancaire imminente) pour vous pousser à saisir vos identifiants sur une fausse page clone.'
  },
  {
    id: 'mail-2',
    subject: 'Facture #2026-0984 pour vos services Cloud mensuels',
    senderName: 'Service Facturation OVHcloud',
    senderEmail: 'facturation@ovhcloud.com',
    recipient: 'jean.dupont@entreprise.fr',
    date: 'Hier, 14:15',
    body: `Bonjour Jean,

Votre facture mensuelle #2026-0984 d'un montant de 48,00 € TTC pour votre hébergement web et nom de domaine est disponible sur votre espace client.

Le prélèvement automatique sera effectué sur votre compte se terminant par *4892 le 25 du mois.

Vous pouvez consulter le récapitulatif comptable depuis votre tableau de bord habituel ou contacter votre service client via le portail officiel.

Merci pour votre fidélité.
L'équipe Facturation OVHcloud`,
    headers: {
      returnPath: '<facturation@ovhcloud.com>',
      receivedFrom: 'mail-out.ovhcloud.com (IP: 213.186.33.5)',
      spf: 'PASS',
      dkim: 'PASS',
      dmarc: 'PASS'
    },
    isPhishing: false,
    indicators: [],
    explanation: 'Cet e-mail est légitime. Le domaine expéditeur correspond fidèlement au domaine officiel, les contrôles SPF, DKIM et DMARC sont tous au vert (PASS), aucun ton alarmiste n\'est employé et aucun mot de passe n\'est réclamé.'
  },
  {
    id: 'mail-3',
    subject: 'Avis de conformité RH : Mise à jour obligatoire de vos identifiants Microsoft 365',
    senderName: 'Support Informatique Interne',
    senderEmail: 'admin-it@micros0ft-support-online.net',
    recipient: 'jean.dupont@entreprise.fr',
    date: 'Hier, 18:30',
    body: `Attention à tous les collaborateurs,

Dans le cadre du renouvellement de la politique de sécurité de l'entreprise, votre mot de passe réseau expire ce soir à minuit.

Tous les utilisateurs doivent impérativement synchroniser leur compte pour éviter toute interruption de leur messagerie Outlook :
-> https://connexion-portail-rh-securise.com/m365/login

Merci de votre coopération rapide,
La Direction des Systèmes d'Information`,
    headers: {
      returnPath: '<contact@micros0ft-support-online.net>',
      receivedFrom: 'smtp-relay-external.ru (IP: 94.102.61.12)',
      spf: 'FAIL',
      dkim: 'NONE',
      dmarc: 'FAIL',
      replyTo: 'phish-hunter-test@proton.me'
    },
    isPhishing: true,
    indicators: [
      {
        type: 'sender',
        description: 'Typosquattage grossier dans l\'adresse : "micros0ft" s\'écrit avec le chiffre 0 au lieu de la lettre o.'
      },
      {
        type: 'header',
        description: 'Le serveur d\'émission est situé sur un relai externe non corporatif (SPF: FAIL).'
      },
      {
        type: 'urgency',
        description: 'Menace de blocage de messagerie à minuit pour empêcher l\'utilisateur de vérifier auprès du vrai service informatique.'
      }
    ],
    explanation: 'Il s\'agit d\'une campagne de credential harvesting (vol d\'identifiants). L\'usurpation du service IT interne est l\'une des méthodes les plus redoutables en entreprise.'
  },
  {
    id: 'mail-4',
    subject: 'Confirmation de votre commande #FR-882109',
    senderName: 'Boutique TechStore',
    senderEmail: 'commandes@techstore.fr',
    recipient: 'jean.dupont@entreprise.fr',
    date: 'Il y a 3 jours',
    body: `Bonjour Jean,

Nous vous confirmons la bonne prise en compte de votre commande #FR-882109 contenant :
- 1x Clé de sécurité physique FIDO2 (39,90 €)

Votre colis est en cours de préparation dans nos entrepôts et vous recevrez un numéro de suivi dès son expédition par le transporteur.

Retrouvez le détail de vos commandes dans votre espace personnel.

Bien cordialement,
Service Relation Client TechStore`,
    headers: {
      returnPath: '<bounces@techstore.fr>',
      receivedFrom: 'smtp.techstore.fr (IP: 51.159.22.80)',
      spf: 'PASS',
      dkim: 'PASS',
      dmarc: 'PASS'
    },
    isPhishing: false,
    indicators: [],
    explanation: 'Cet e-mail est légitime. Aucun lien piégé, aucun sentiment de panique, et la cryptographie d\'en-tête (SPF et DKIM) est rigoureusement valide.'
  }
];

export const INITIAL_TERMINAL_VFS: Record<string, { type: 'file' | 'dir'; content?: string; permissions: string; owner: string }> = {
  '/': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root' },
  '/home': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root' },
  '/home/apprenant': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'apprenant' },
  '/home/apprenant/readme.txt': {
    type: 'file',
    content: 'Bienvenue dans le Cyber Lab Linux !\nVotre mission est de manipuler le système avec précaution.\nTapez "help" pour afficher les commandes autorisées.',
    permissions: 'rw-r--r--',
    owner: 'apprenant'
  },
  '/home/apprenant/documents': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'apprenant' },
  '/home/apprenant/documents/notes.txt': {
    type: 'file',
    content: 'Note de service : Tous les mots de passe doivent comporter au moins 14 caractères avec caractères spéciaux.',
    permissions: 'rw-r--r--',
    owner: 'apprenant'
  },
  '/home/apprenant/documents/.secret_flag.txt': {
    type: 'file',
    content: 'BRAVO{FLAG_CYBER_TERMINAL_MASTER_2026}\nVous avez débusqué le fichier caché avec ls -la !',
    permissions: 'rw-------',
    owner: 'apprenant'
  },
  '/home/apprenant/config_exposee.env': {
    type: 'file',
    content: 'DB_PASSWORD=SuperSecretPassw0rd!\nAPI_KEY=sk_live_998877665544332211\nATTENTION: Ce fichier a actuellement des permissions 777 dangereuses ! Modifiez-le avec chmod 600.',
    permissions: 'rwxrwxrwx',
    owner: 'apprenant'
  },
  '/var': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root' },
  '/var/log': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root' },
  '/var/log/auth.log': {
    type: 'file',
    content: `Oct 17 03:12:01 srv-prod sshd[4102]: Failed password for invalid user admin from 198.51.100.23 port 45120 ssh2
Oct 17 03:12:03 srv-prod sshd[4105]: Failed password for invalid user root from 198.51.100.23 port 45124 ssh2
Oct 17 03:12:05 srv-prod sshd[4108]: Failed password for invalid user test from 198.51.100.23 port 45128 ssh2
Oct 17 03:12:07 srv-prod sshd[4112]: Failed password for invalid user support from 198.51.100.23 port 45132 ssh2
Oct 17 03:12:15 srv-prod sshd[4115]: WARNING: Possible SSH brute-force attack detected from 198.51.100.23 (4 failed attempts)`,
    permissions: 'r--r-----',
    owner: 'root'
  },
  '/etc': { type: 'dir', permissions: 'rwxr-xr-x', owner: 'root' },
  '/etc/hostname': {
    type: 'file',
    content: 'cyber-academy-sandbox',
    permissions: 'rw-r--r--',
    owner: 'root'
  }
};
