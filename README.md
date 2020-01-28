# Hugo CircleCI
[![CircleCI](https://circleci.com/gh/ReachInfinity/hugo-circleci-1.svg?style=svg&circle-token=8f80002eaa1ad9d1601791725b1fcc1952bea479)](https://circleci.com/gh/ReachInfinity/hugo-circleci-1)

### Prérequis
- [Git client](https://git-scm.com/downloads)
- [Hugo client](https://gohugo.io/getting-started/installing)
- [CircleCI](https://circleci.com/)
- [Pivotal](https://run.pivotal.io/)

### Mise en oeuvre du tech-lunch
```
hugo new site techlunch-1
cd techlunch-1/ && touch .gitingore && touch .gitmodules

.gitignore :
public/

.gitmodules :
[submodule "themes/hugo-theme-learn"]
	path = themes/hugo-theme-learn
	url = https://github.com/matcornic/hugo-theme-learn.git

git submodule add https://github.com/matcornic/hugo-theme-learn.git themes/learn
```
editez le fichier config.toml et ajouter :
```
baseURL = "<remplir>"
languageName = "Français"
languageCode = "fr-FR"
title = "<remplir>"
theme = "learn"

[params]
themeVariant = "blue"
author = "Maxime Calves"
description = "<remplir>"
showVisitedLinks = true
disableSearch = false


[outputs]
home = ["HTML", "RSS", "JSON"]
```



Créer une page de contenu :
```
hugo new techlunch/_index.md
hugo new techlunch/techlunch.md

_index.md
---
title: "Tech Lunch"
date: 2020-01-27T14:02:12+01:00
draft: true
weight: 15
---

## Content

{{% children sort="Name" %}}

techlunch.md
---
title: "Hello World"
date: 2020-01-27T13:59:31+01:00
draft: false
---

# Hugo
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
      - route: techlunch-1-maxime-calves.cfapps.io
    env:
      FORCE_HTTPS: true
```