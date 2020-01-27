# hugo-circleci-1

### Prérequis

- [Git client](https://git-scm.com/downloads)
- [Hugo client](https://gohugo.io/getting-started/installing)
- [CircleCI](https://circleci.com/)
- [Pivotal](https://run.pivotal.io/)

### Mise en oeuvre du tech-lunch
```
hugo new site techlunch-1
cd techlunch-1/ && git submodule add https://github.com/matcornic/hugo-theme-learn.git themes/learn
```
editez le fichier config.toml et ajouter :
```
baseURL = "<remplir>"
languageName = "Français"
languageCode = "fr-FR"
title = "<remplir>"
theme = "hugo-theme-learn"

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

Créer son premier processus déploiement continue :
```
mkdir .circleci
vim .circleci/config.yml
```
