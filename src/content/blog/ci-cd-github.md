---
title: "Déploiement d'un site web avec Github - CI/CD"
description: ""
pubDate: "30 Mar 2023"
heroImage: "/placeholder-hero.jpg"
author: "Lynxgsm"
draft: true
---

## Que fait le fichier static.yml?

Le workflow est déclenché automatiquement lorsqu'un push est effectué sur la branche "main", ou peut être déclenché manuellement depuis l'onglet "Actions" de GitHub.

Les permissions nécessaires sont définies pour le jeton GITHUB_TOKEN, qui est utilisé pour le déploiement sur GitHub Pages.

Une politique de concurrence est mise en place pour éviter que plusieurs déploiements ne se produisent en même temps, ce qui peut causer des problèmes. Cependant, cette politique ne va pas annuler les déploiements en cours, car ils doivent être autorisés à se terminer.

Un travail est défini pour le déploiement, qui s'exécute sur une machine virtuelle Ubuntu.

Les étapes du travail sont les suivantes :
a. Vérification du code source en le récupérant à partir du référentiel Git.
b. Configuration des paramètres de déploiement pour GitHub Pages.
c. Chargement des fichiers à déployer vers une zone de stockage temporaire.
d. Déploiement des fichiers vers GitHub Pages.

Une variable d'environnement est configurée pour l'URL de la page GitHub Pages nouvellement déployée, qui peut être utilisée pour référencer la page dans des tâches ultérieures.
