# WordPress Stack — Architecture 3 tiers

Déploiement d'un WordPress en architecture 3 tiers avec Docker Compose.

## Ce qui tourne

- **nginx** — reverse proxy, seul service accessible depuis l'extérieur (port 80)
- **wordpress_1 / wordpress_2** — deux instances WordPress en PHP-FPM, load balancées par nginx
- **mysql** — base de données partagée entre les deux instances
- **redis** — cache objet, branché sur WordPress via le plugin Redis Object Cache

## Lancer le projet

```bash
docker compose up -d
```

Attendre 10-15 secondes le temps que MySQL soit prêt, puis ouvrir http://localhost.

Si c'est la première fois, WordPress demande de créer un compte admin. Une fois connecté, le site est opérationnel.

## Structure des fichiers

```
wordpress-stack/
├── docker-compose.yml
├── nginx/
│   └── default.conf       # config reverse proxy + load balancing
└── wordpress/
    └── uploads.ini        # limites PHP (upload 64MB, mémoire 256MB)
```

## Réseau

Aucun service n'est exposé directement sauf nginx sur le port 80. MySQL, Redis et les deux WordPress communiquent sur un réseau interne Docker (`backend`). Depuis l'hôte il est impossible d'atteindre MySQL ou Redis directement.

```
Internet → nginx:80 → wordpress_1:9000
                    → wordpress_2:9000 (round-robin)
                            ↓
                       mysql:3306
                       redis:6379
```

## Vérifications

**Conteneurs actifs**
```bash
docker compose ps
```

**Load balancing — voir quel backend répond**
```bash
docker compose logs -f wordpress_1
docker compose logs -f wordpress_2
```

**Test de résilience**
```bash
docker compose stop wordpress_1
curl -I http://localhost        # doit retourner 200
docker compose start wordpress_1
```

**Redis**
```bash
docker compose exec redis redis-cli monitor
# recharger http://localhost → des GET/SET wp_* apparaissent
```

**MySQL**
```bash
docker compose exec mysql mysql -u wordpress -pwordpress -e "SHOW TABLES FROM wordpress;"
```

## Données persistantes

Les données sont stockées dans des volumes Docker nommés :

- `mysql_data` — base de données
- `redis_data` — cache
- `wordpress_data` — fichiers WordPress, thèmes, plugins, uploads

Un `docker compose down` sans `-v` conserve tous les volumes. Les données sont perdues uniquement avec `docker compose down -v`.

## Arrêter le projet

```bash
docker compose down        # arrête les conteneurs, conserve les données
docker compose down -v     # arrête et supprime tout (repart de zéro)
```