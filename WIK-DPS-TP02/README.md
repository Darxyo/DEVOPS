# ping-api — Docker

Containerisation de l'API HTTP développée en TP01.

## Images disponibles

| Fichier | Description |
|---|---|
| `dockerfile` | Single stage — build et exécution dans un seul conteneur |
| `dockerfile.multi` | Multi-stage — build séparé de l'exécution |

## Prérequis

- Docker Desktop
- L'API du TP01 (dossier `src/`, `package.json`, `tsconfig.json`)

## Structure du projet

```
ping-api/
├── src/
│   ├── server.ts
│   ├── counter-store.ts
│   └── routes/
│       ├── ping.ts
│       └── stats.ts
├── dockerfile
├── dockerfile.multi
├── .dockerignore
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```

## Lancer avec Docker

### Single stage

```bash
docker build -t ping-api .
docker run -p 3000:3000 ping-api
```

### Multi-stage

```bash
docker build -f dockerfile.multi -t ping-api-multi .
docker run -p 3000:3000 ping-api-multi
```

### Avec un port personnalisé

```bash
docker run -p 8080:8080 -e PING_LISTEN_PORT=8080 ping-api
```

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `PING_LISTEN_PORT` | Port d'écoute du serveur | `3000` |

## Routes

| Requête | Réponse |
|---|---|
| `GET /ping` | `200 OK` + JSON des headers de la requête |
| `GET /stats` | `200 OK` + JSON des statistiques du serveur |
| Tout le reste | `404` corps vide |

## Tester

```bash
curl.exe http://localhost:3000/ping
curl.exe http://localhost:3000/stats
```

## Optimisation des layers

Les deux Dockerfiles sont construits pour maximiser l'utilisation du cache Docker :

```
COPY package*.json    ← rarement modifié → mis en cache
RUN npm install       ← long, servi depuis le cache si package.json inchangé
COPY src/             ← modifié souvent → seulement ce layer est recalculé
```

Ainsi, modifier uniquement le code source ne déclenche pas un nouveau `npm install`.

## Différence single stage vs multi-stage

Le multi-stage sépare l'étape de compilation de l'étape d'exécution :

- Le stage `builder` compile le TypeScript en JavaScript
- Le stage `runner` ne récupère que le résultat compilé (`dist/`)
- Les sources `.ts`, `typescript`, `ts-node` et le cache npm ne sont **pas présents** dans l'image finale

| | Single stage | Multi-stage |
|---|---|---|
| Sources `.ts` dans l'image | oui | non |
| `typescript`, `ts-node` | oui | non |
| Taille image | plus lourde | plus légère |

## Sécurité

Les deux images utilisent un utilisateur dédié non-root `appuser` pour exécuter le serveur :

```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

## Scan de vulnérabilités

Les images ont été scannées avec [Trivy](https://trivy.dev).

```bash
trivy image ping-api
trivy image ping-api-multi
```

Les 15 vulnérabilités détectées (0 critical, 11 high, 2 medium, 2 low) proviennent exclusivement de npm intégré dans l'image de base `node:20-alpine`. Aucune vulnérabilité n'est présente dans le code applicatif.