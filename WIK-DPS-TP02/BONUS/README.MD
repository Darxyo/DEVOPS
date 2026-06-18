# Bonus — Image Docker minimale

Image Docker la plus petite possible affichant les nombres de 0 à 10000 en console.

## Approche

Programme en **C** compilé statiquement avec `musl`, optimisé pour la taille et compressé avec `upx`, lancé depuis une image `FROM scratch`.

| Technique | Détail |
|---|---|
| `FROM scratch` | Image de base vide — pas d'OS, pas de shell |
| Compilation statique | Le binaire n'a besoin d'aucune librairie externe |
| `musl-dev` | Libc ultra légère (vs glibc standard) |
| `-Os` et flags gcc | Compilation optimisée pour la taille |
| `strip --strip-all` | Supprime tous les symboles de debug |
| `upx --ultra-brute` | Compresse le binaire (~70% de réduction) |

## Structure

```
BONUS/
├── main.c
└── dockerfile.bonus
```

## Lancer

```bash
docker build -f dockerfile.bonus -t counter-bonus .
docker run counter-bonus
```

## Vérifier la taille

```bash
docker image ls counter-bonus
```

## Résultat

```
REPOSITORY      TAG       SIZE
counter-bonus   latest    ~30KB
```

## Je ne suis pas parvenu à réaliser l'assembleur.