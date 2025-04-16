# Gestion de Tournois de Jeux Vidéo avec ReactJS
## Contexte du Projet

Suite au développement de l’API dédiée à la gestion des tournois de jeux vidéo, nous avons conçu cette application front-end en ReactJS. Cette application permet aux utilisateurs de :

- Consulter l’ensemble des tournois.
- Accéder aux détails des matchs.
- S’inscrire et suivre en temps réel l’évolution des compétitions.

L’objectif est de créer une interface utilisateur fluide, moderne et intuitive, tout en assurant une intégration transparente avec l’API backend et en mettant l’accent sur la performance et la réactivité.

## Architecture et Outils

### Communication avec l’API Backend

- **Axios/Fetch API** : Pour effectuer les appels vers l’API backend.
- **JWT (JSON Web Token)** : Pour la gestion de l’authentification et la protection des routes privées.

### Sécurité et Authentification

- **Gestion des Tokens** : Stockage sécurisé des tokens d’authentification via `localStorage` ou `cookies`.
- **Middleware d’Interception** : Ajout automatique des tokens dans les requêtes HTTP.


## Structure de l’Application

### 1. Authentification

#### Composants & Pages
- **Inscription** : Formulaire permettant à un utilisateur de s’inscrire via l'API `[POST] /api/register`.
- **Connexion** : Formulaire de connexion pour récupérer un token d’accès via `[POST] /api/login`.
- **Déconnexion** : Bouton pour supprimer le token et rediriger l’utilisateur vers la page de connexion.
- **Profil** : Affichage des informations de l’utilisateur via `[GET] /api/user`.

### 2. Gestion des Tournois

#### Composants & Pages
- **Liste des Tournois** : Affiche tous les tournois via `[GET] /api/tournaments`.
- **Détails du Tournoi** : Page détaillant un tournoi spécifique via `[GET] /api/tournaments/{id}`.
- **Création & Modification** : Formulaires pour créer ou modifier un tournoi via `[POST] /api/tournaments` et `[PUT] /api/tournaments/{id}`.
- **Suppression** : Action pour supprimer un tournoi via `[DELETE] /api/tournaments/{id}`.

### 3. Inscription des Joueurs

#### Fonctionnalités
- **Inscription à un Tournoi** : Formulaire permettant d’inscrire un joueur à un tournoi via `[POST] /api/tournaments/{tournament_id}/players`.
- **Liste des Joueurs** : Affichage des joueurs inscrits à un tournoi.
- **Désinscription** : Option de désinscription d’un joueur via `[DELETE] /api/tournaments/{tournament_id}/players/{player_id}`.

### 4. Gestion des Matchs et Scores

#### Composants & Pages
- **Création de Match** : Interface pour planifier un match entre des joueurs via `[POST] /api/matches`.
- **Liste et Détails des Matchs** : Affichage des matchs programmés via `[GET] /api/matches` et détails d’un match spécifique via `[GET] /api/matches/{id}`.
- **Mise à Jour des Scores** : Formulaire pour ajouter ou modifier les scores via `[PUT] /api/matches/{id}/scores` ou `[POST] /api/matches/{id}/scores`.



