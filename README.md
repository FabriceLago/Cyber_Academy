# Cyber Academy — Plateforme Interactive de Formation en Cybersécurité

> **Apprenez la cybersécurité de zéro à professionnel** grâce à des cours vulgarisés, des simulations pas-à-pas et des laboratoires pratiques isolés.

![Licence](https://img.shields.io/badge/licence-Apache--2.0-blue.svg)
![React](https://img.shields.io/badge/React-19-cyan.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)

---

## 🎯 Objectifs de la plateforme

Cyber Academy est une académie numérique gratuite, en français, conçue pour permettre à une personne sans aucune connaissance informatique préalable d'apprendre progressivement la cybersécurité et de se préparer aux métiers juniors du secteur :
- **Analyste SOC Junior**
- **Administrateur Système & Sécurité Junior**
- **Pentester Éthique Junior**

---

## 🚀 Fonctionnalités Clés

### 1. 📊 Tableau de bord apprenant
- Suivi de la progression globale et des compétences acquises
- Recommandation intelligente de la prochaine étape
- Suivi du temps d'apprentissage et des objectifs hebdomadaires
- Déblocage de badges pédagogiques

### 2. 🗺️ Cursus en 9 Niveaux
- **Niveau 1** : Culture Informatique & Fondations
- **Niveau 2** : Réseaux Informatiques (IP, DNS, TCP/UDP, Pare-feu)
- **Niveau 3** : Linux & Administration Système
- **Niveau 4** : Fondamentaux de la Cybersécurité (CIA, Cryptographie, Ingénierie sociale)
- **Niveau 5** : SOC & Analyste Cybersécurité Junior
- **Niveau 6** : Sécurité Web & Applications (OWASP Top 10)
- **Niveau 7** : Pentesting Éthique & Audits autorisés
- **Niveau 8** : Cloud & Sécurité DevSecOps
- **Niveau 9** : Spécialisation & Préparation aux entretiens

### 3. 🔬 Cyber Lab (Simulations Interactives)
- **Terminal Linux simulé** : Véritable système de fichiers virtuel in-memory (`pwd`, `ls -la`, `cd`, `cat`, `touch`, `mkdir`, `chmod 600`, `whoami`, `id`, `help`, `clear`) avec missions d'audit et de sécurisation validées automatiquement.
- **Détecteur de Phishing** : Analyseur de courriels suspects avec inspection des en-têtes de transport réels (`SPF`, `DKIM`, `DMARC`, `Return-Path`), détection d'indices et verdict motivé.
- **Simulateur Réseau Interactif** : Animation pas-à-pas du voyage d'un paquet à travers 5 nœuds (Client $\to$ DNS $\to$ Routeur NAT $\to$ Pare-feu $\to$ Serveur Web) avec inspecteur de trame style Wireshark en temps réel.

### 4. 📝 Quiz & Examens de Validation
- Quiz après chaque leçon générés selon des objectifs pédagogiques mesurables
- Correction détaillée et justifiée pour chaque option
- Calcul immédiat des notes et mise à jour de la matrice de compétences

### 5. 💼 Portfolio Exportable
- Export des compétences démontrées au format JSON pour les recruteurs
- Préparation de synchronisation Supabase / PostgreSQL

---

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **Build Tool** : Vite 8
- **Persistance** : Moteur réactif local (`localStorage`) prêt pour intégration Supabase (Auth + PostgreSQL RLS)
- **Déploiement** : Prêt pour Vercel, Netlify, Cloud Run ou Docker

---

## 💻 Installation & Démarrage Local

```bash
# Cloner le dépôt
git clone https://github.com/FabriceLago/Cyber_Academy.git
cd Cyber_Academy

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

### Scripts disponibles :
- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production (`dist/`)
- `npm run lint` : Vérifie la validité TypeScript (`tsc --noEmit`)

---

## ☁️ Déploiement sur Vercel

Le projet contient un fichier `vercel.json` préconfiguré. Pour déployer :
1. Importez ce dépôt sur [vercel.com](https://vercel.com).
2. Laissez les réglages par défaut (`Vite`, `npm run build`, `dist`).
3. Cliquez sur **Deploy**.
