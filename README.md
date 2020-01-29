# Hugo CircleCI
[![CircleCI](https://circleci.com/gh/ReachInfinity/hugo-circleci-1.svg?style=svg&circle-token=8f80002eaa1ad9d1601791725b1fcc1952bea479)](https://circleci.com/gh/ReachInfinity/hugo-circleci-1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ReachInfinity_hugo-circleci-1&metric=alert_status)](https://sonarcloud.io/dashboard?id=ReachInfinity_hugo-circleci-1)

### Prérequis
- [Git client](https://git-scm.com/downloads)
- [Hugo client](https://gohugo.io/getting-started/installing)
- [CircleCI](https://circleci.com/)
- [Pivotal](https://run.pivotal.io/)
- [SonarCloud](https://sonarcloud.io/)
- [Slack](https://slack.com/)

### Mise en oeuvre du tech-lunch
#### Initialisation du projet web
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
#### Initialisation du processus CI/CD
Créer son premier processus déploiement continue :
```
mkdir .circleci
vim .circleci/config.yml

#############################
version: 2.1
jobs:
  build:
    docker:
      # 2019-10-23 BTH: had to fix the version as there is a breaking change in latest (=0.59)
      # See https://hub.docker.com/r/cibuilds/hugo, https://github.com/cibuilds/hugo
      - image: cibuilds/hugo:0.58.3

    steps:
      - checkout
      - run:
          name: Install git client
          command: apk update && apk add git
      - run:
          name: Load submodule
          command: git submodule sync && git submodule update --init
      - run:
          name: Build Hugo static website
          command: HUGO_ENV=production hugo
      - run:
          name: Install CF CLI
          command: |
            apk add wget
            wget https://cli.run.pivotal.io/stable?release=linux64-binary
            mv stable?release=linux64-binary /tmp/cf-cli.tgz
            mkdir -p /usr/local/bin
            tar -xzf /tmp/cf-cli.tgz -C /usr/local/bin
            cf --version
            rm -f /tmp/cf-cli.tgz
      - run:
          name: Deploy
          command: |
            cf login -a "$CF_API" -u "$CF_USERNAME" -p "$CF_PASSWORD" -o "$CF_ORG" -s "$CF_SPACE_PROD"
            cf push
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
      - route: tech-lunch.cfapps.io
    env:
      FORCE_HTTPS: true
```
#### Initialisation de la qualité du code
Créer un fichier `sonar-project.properties` :
```
sonar.projectKey=ReachInfinity_hugo-circleci-1
sonar.organization=reachinfinity

# This is the name and version displayed in the SonarCloud UI.
sonar.projectName=hugo-circleci-1
sonar.projectVersion=1.0
 
# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
sonar.sources=public/
 
# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8
```

Ajouter le processus automatique de scan via CircleCI :
`.circleci/config.yml`
```
  scan:
     docker:
       - image: sonarsource/sonarcloud-scan:1.0.1
     steps:
     - checkout
     - run:
         name: Quality Scan
         command: sonar-scanner -Dsonar.projectKey=ReachInfinity_hugo-circleci-1 -Dsonar.organization=reachinfinity -Dsonar.sources=. -Dsonar.host.url=https://sonarcloud.io -Dsonar.login="$SONAR_LOGIN"

workflows:
  version: 2.1
  build_deploy_and_scan:
    jobs:
      - build
      - scan:
          requires:
            - build
```

