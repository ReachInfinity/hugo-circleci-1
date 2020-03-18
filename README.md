# Pipeline DevOps :two_men_holding_hands:
[![CircleCI](https://circleci.com/gh/ReachInfinity/hugo-circleci-1.svg?style=svg&circle-token=8f80002eaa1ad9d1601791725b1fcc1952bea479)](https://circleci.com/gh/ReachInfinity/hugo-circleci-1)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ReachInfinity_hugo-circleci-1&metric=alert_status)](https://sonarcloud.io/dashboard?id=ReachInfinity_hugo-circleci-1)

![Pipeline DevOps](https://media.joomeo.com/large/5a7c927573330.jpg)

### Prérequis :red_circle:
- [Git client](https://git-scm.com/downloads)
- [Hugo client](https://gohugo.io/getting-started/installing)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [CircleCI](https://circleci.com/)
- [Pivotal](https://run.pivotal.io/)
- [SonarCloud](https://sonarcloud.io/)
- [Sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
- [Slack](https://slack.com/)
- [Azure DevOps](https://dev.azure.com/)
- [Zoom](https://zoom.us/)
- [UptimeBot](https://uptime.bot/)

### Mise en oeuvre du tech-lunch :clap:
#### Initialisation du plan
##### Créer l'espace de collaboration :computer:
Se connecter à [Slack](https://slack.com/)

Créer un espace de collaboration [Slack Workspace](https://slack.com/create#email)

Ajouter des canaux de communications pour vos besoins de centraliser les informations liée au projet [Slack Channel](https://slack.com/intl/en-fr/help/articles/201402297-Create-a-channel)

- bugs
- kanban
- CI/CD

##### Créer l'espace de gestion de projet :date:
Se connecter à [AzureDevOps](https://dev.azure.com/)

Créer une nouvelle organisation [AzureDevOps Organization](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/create-organization?view=azure-devops)

Créer un projet public [AzureDevOps Project](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops&tabs=preview-page)

Configurer votre espace de gestion de projet :
1.  Click Project settings
2.  Désactiver les services Azure Devops inutile 
  - Repos
  - Pipelines
  - Test Plans
  - Artifacts

Créer une premier tâche 
##### Azure Boards pour Slack
[AzureBoards sur Slack](https://slack.com/apps/AKR9QDD1D-azure-boards)

```
Channel Kanban :
/azboards signin
/azboards link https://dev.azure.com/techlunch/Tech-lunch
/azboards subscriptions
Event : Work item created/deleted/restored/updated

#### Créer une tâche sur Azure Board via Slack
/azboards create 
Task
```

Créer un item via des actions sur les messages
```
Channel Bugs :
Il manque le favicon sur le site, veuillez créer un issue pour investiguer et corriger  
```

![Creer un item via un message](https://docs.microsoft.com/en-us/azure/devops/boards/integrations/media/integrations-slack/message-action-collated.png?view=azure-devops)


[Documentation AzureBoard for Slack](https://docs.microsoft.com/en-us/azure/devops/boards/integrations/boards-slack?view=azure-devops)

##### Github pour Slack :octocat:

[Github pour Slack](https://slack.com/intl/fr-fr/help/articles/232289568-GitHub-pour-Slack)

```
/github subscribe ReachInfinity/hugo-circleci-1
/github help
```
Les fonctionnalités par défaut :
- issues
- pulls
- statuses
- commits
- deployments
- public

exemple pour créer une issue sur Github :
`/github open ReachInfinity/hugo-circleci-1`

##### CirceCI pour Slack 
[CircleCI pour Slack](https://slack.com/apps/A0F7VRE7N-circleci)

Exécutez un job CircleCI pour voir l'état du pipeline dans le cannale de communication.

exemple :
```
Success: ReachInfinity's workflow (build_deploy_and_scan) in ReachInfinity/hugo-circleci-1 (master)
- Test de la qualité du code (a03c10f)
```
##### Zoom pour Slack :camera:
[Zoom pour Slack](https://slack.com/apps/A5GE9BMQC-zoom)
```
/zoom Start a meeting
/zoom meeting [topic] Start a meeting with topic
/zoom join [meeting id/personal link name] Join a meeting using meeting ID/personal link name
/zoom join me Join a meeting using your personal meeting ID
/zoom call [@contact/phone number] Start a phone call with a contact or a phone number
/zoom config Configure your settings for Zoom Meetings in Slack
/zoom logout Logout from Zoom on all your Slack channels and direct messages
```
##### Github pour AzureBoards
[Github pour Azure Boards](https://github.com/marketplace/azure-boards/plan/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW4yMjEw#pricing-and-setup)

[Documentation](https://azure.microsoft.com/fr-fr/blog/linking-your-github-commits-with-azure-boards/)

#### Initialisation du développement web
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

Exécuter le serveur web avec une autoregénération :
```
hugo server -D
http://localhost:1313/
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
sonar.sources=.
 
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
         command: sonar-scanner -Dsonar.host.url=https://sonarcloud.io -Dsonar.login="$SONAR_LOGIN"

workflows:
  version: 2.1
  build_deploy_and_scan:
    jobs:
      - build
      - scan:
          requires:
            - build
```

Ajouter du contenu pour le scan, créer le répertoire assets/css/ à la racine et créer le fichier test.scss, remplissez le avec un [exemple](https://github.com/NormandErwan/Blogpaper/blob/master/assets/css/blogpaper.scss)


#### Initialisation du monitoring de la plateforme web

[Metric Pivotal](https://metrics.run.pivotal.io/apps/)