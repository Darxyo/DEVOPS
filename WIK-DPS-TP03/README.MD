# ping-api — Docker Compose & Load Balancing

Déploiement de l'API avec 4 replicas derrière un reverse-proxy nginx.

## Architecture

```
Client
  │
  ▼
nginx (port 8080)
  │
  ├── ping-api-1 (port 3000)
  ├── ping-api-2 (port 3000)
  ├── ping-api-3 (port 3000)
  └── ping-api-4 (port 3000)
```

Seul nginx est exposé sur l'hôte. Les containers `ping-api` ne sont pas accessibles directement depuis l'extérieur.

## Structure

```
WIK-DPS-TP03/
├── src/
│   ├── server.ts
│   ├── counter-store.ts
│   └── routes/
│       ├── ping.ts
│       └── stats.ts
├── docker-compose.yaml
├── nginx.conf
├── dockerfile.multi
├── package.json
├── tsconfig.json
└── README.md
```

## Lancer

```bash
docker compose up --build
```

## Arrêter

```bash
docker compose down
```

## Tester

```bash
curl http://localhost:8080/ping
curl http://localhost:8080/stats
```

## Observer le load balancing

```bash
docker compose logs -f ping-api
```

Chaque requête sur `/ping` affiche le hostname du container qui a répondu :

```
ping-api-3  | [f715b2aacd91] GET /ping
ping-api-4  | [7948c6f18689] GET /ping
ping-api-1  | [88517bca1d06] GET /ping
ping-api-2  | [02c0108f9f30] GET /ping
```

Les 4 hostnames différents confirment que nginx répartit les requêtes entre les replicas en round-robin.

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `PING_LISTEN_PORT` | Port d'écoute de l'API | `3000` |

## Routes

| Requête | Réponse |
|---|---|
| `GET /ping` | `200 OK` + JSON des headers + log du hostname |
| `GET /stats` | `200 OK` + JSON des statistiques |
| Tout le reste | `404` corps vide |

## Détails techniques

### docker-compose.yaml

- `ping-api` : 4 replicas construits depuis `dockerfile.multi`
- `nginx` : reverse-proxy exposé sur le port `8080`, configuré via `nginx.conf`
- `expose` vs `ports` : les containers `ping-api` utilisent `expose` (réseau interne uniquement), nginx utilise `ports` (accessible depuis l'hôte)

### nginx.conf

nginx distribue les requêtes en **round-robin** par défaut entre les 4 instances `ping-api`. La directive `upstream` pointe vers le nom du service Docker Compose, qui résout automatiquement vers les 4 replicas.