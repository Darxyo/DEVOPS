# ping-api

Une API HTTP minimaliste en TypeScript (Node.js natif, zéro dépendance runtime).

## Routes

| Requête        | Réponse                                           |
|----------------|---------------------------------------------------|
| `GET /ping`    | `200 OK` + JSON des headers de la requête         |
| `GET /stats`   | `200 OK` + JSON des statistiques du serveur       |
| Tout le reste  | `404` corps vide                                  |

## Prérequis

- Node.js ≥ 18
- npm

## Installation

```bash
npm install
```

## Lancement

### Mode développement (ts-node, pas de build)
```bash
npm run dev
```

### Mode production (compile puis lance)
```bash
npm run build
npm start
```

### Avec un port personnalisé
```bash
PING_LISTEN_PORT=8080 npm run dev
# ou
PING_LISTEN_PORT=8080 npm start
```

Le port par défaut est **3000** si `PING_LISTEN_PORT` n'est pas défini.

## Variables d'environnement

| Variable           | Description               | Défaut |
|--------------------|---------------------------|--------|
| `PING_LISTEN_PORT` | Port d'écoute du serveur  | `3000` |

## Exemples de requêtes

### GET /ping

Retourne les headers HTTP de la requête au format JSON.
Le compteur de requêtes est incrémenté à chaque appel.

```bash
curl http://localhost:3000/ping
```

```json
{
  "host": "localhost:3000",
  "user-agent": "curl/8.4.0",
  "accept": "*/*"
}
```

### GET /stats

Retourne les statistiques du serveur : nombre total de requêtes `/ping`,
uptime et identifiant d'instance.

```bash
curl http://localhost:3000/stats
```

```json
{
  "instanceId": "a3f1c2d4-9b8e-4f2a-bc31-7d6e5f4c3a2b",
  "totalPingRequests": 3,
  "uptime": {
    "ms": 4521,
    "seconds": 4,
    "human": "0h 0m 4s"
  }
}
```

- `instanceId` : UUID généré au démarrage du serveur, change à chaque redémarrage
- `totalPingRequests` : nombre d'appels à `/ping` depuis le démarrage (remis à zéro au redémarrage)
- `uptime` : temps écoulé depuis le démarrage du serveur

## Architecture

```
src/
├── server.ts            # Point d'entrée, routing, injection du store
├── counter-store.ts     # Interface CounterStore + implémentation InMemoryCounterStore
└── routes/
    ├── ping.ts          # Handler GET /ping
    └── stats.ts         # Handler GET /stats
```

### CounterStore

Le compteur est isolé derrière une interface :

```ts
interface CounterStore {
  increment(): void;
  getCount(): number;
}
```

L'implémentation actuelle (`InMemoryCounterStore`) stocke le compteur en mémoire.
Pour utiliser une autre implémentation (Redis, SQLite...), il suffit de créer une
nouvelle classe qui implémente `CounterStore` et de la passer dans `server.ts`.
