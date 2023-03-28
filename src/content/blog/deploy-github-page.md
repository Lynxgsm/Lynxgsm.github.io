---
title: "Deploy Github Page with Astro"
description: "Get started with creating a blog with Astro"
pubDate: "25 Mar 2023"
heroImage: "/placeholder-hero.jpg"
author: "Lynxgsm"
draft: true
---

## Github Pages

GitHub Pages is a **free hosting service** (yes! free! 😁) that allows you to create and host your own website, directly from your GitHub repository. You can create as many websites as you want 😱, without having to pay 💰 for hosting. Another benefit is that it's easy to set up.

That's what we will talk about today.

## Astro

Astro JS is a relatively new static site generator (SSG) that has been gaining popularity in the web development community.

Astro JS takes the concept of SSG to the next level by introducing a new paradigm called "unified rendering". This means that instead of rendering components on the server or client, Astro can render them anywhere.

Another advantage of Astro JS is its performance. Because static sites are pre-built, they load quickly and are less resource-intensive than dynamic sites. Additionally, by using React, Astro JS can create highly optimized and interactive web components that can be rendered quickly and efficiently.

There is so much more to cover about Astro but that's not the purpose of this article. If you want me to write a dedicated article about it, let me know in the comments 👇.

## Prerequisites

You just need to have a Github account to follow this article. If you don't already have one then go ahead an create it. And a little sense of logic. Having used Git is also a plus.

## Quick setup

First, let's pull our repository:

```bash
> git clone https://github.com/{username}/{username}.github.io
```

You need to replace `username` by yours.
That's right, every github account has a free Github page related to. Now open the cloned folder

Let's Pull the Astro template file by running this command:

```bash
> pnpm create astro@latest
```

Create a yml file which will contain our action:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v3
      - name: Install, build, and upload your site
        uses: withastro/action@v0
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

This is a YAML file describes our GitHub Actions workflow for deploying a website to GitHub Pages.

The workflow is triggered when a push is made to the master branch of the repository. It contains two jobs: build and deploy. The build job runs on an Ubuntu environment and uses the actions/checkout and withastro/action actions to install, build, and upload the site. The deploy job needs the build job to complete successfully and also runs on an Ubuntu environment.

It defines an environment called github-pages and sets the URL to the page URL output from the build job. The steps in the deploy job use the _actions/deploy-pages_ action to deploy the site to GitHub Pages.

The deployment section specifies permissions required for the deployment, which includes read access to repository contents, write access to GitHub Pages, and write access to the ID token.

This workflow helps us automates the process of building and deploying a website to GitHub Pages when changes are made to the master branch of the repository.
