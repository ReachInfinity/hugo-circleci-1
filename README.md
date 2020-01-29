# Hugo CircleCI
[![CircleCI](https://circleci.com/gh/ReachInfinity/hugo-circleci-1.svg?style=svg&circle-token=8f80002eaa1ad9d1601791725b1fcc1952bea479)](https://circleci.com/gh/ReachInfinity/hugo-circleci-1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ReachInfinity_hugo-circleci-1&metric=alert_status)](https://sonarcloud.io/dashboard?id=ReachInfinity_hugo-circleci-1)

### Prérequis
- [Git client](https://git-scm.com/downloads)
- [Hugo client](https://gohugo.io/getting-started/installing)
- [CircleCI](https://circleci.com/)
- [Pivotal](https://run.pivotal.io/)

### Mise en oeuvre du tech-lunch
```
hugo new site techlunch-1
cd techlunch/ && touch .gitingore && touch .gitmodules

.gitignore :
public/
```

Ajouter le theme du site :
```
git submodule add https://github.com/spech66/bootstrap-bp-hugo-startpage.git themes/presentation
```
editez le fichier config.toml et ajouter :
```
baseURL = "https://tech-lunch.cfapps.io/"
languageName = "Français"
languageCode = "fr-FR"
title = "Tech Lunch"
theme = "presentation"

### Pour le theme presentation
[params]
welcomeText = "Hello World"
```

Générer les fichiers statiques du site
```
hugo -D
```

Créer son premier processus déploiement continue :
```
mkdir .circleci
vim .circleci/config.yml
```

Créer le manifeste de déploiement :
```
vim manifest.yml
---
applications:
  -
    name: tech-lunch
    memory: 64M
    path: public
    buildpacks:
      - staticfile_buildpack
    routes:
      - route: techlunch-maxime-calves.cfapps.io
    env:
      FORCE_HTTPS: true
```