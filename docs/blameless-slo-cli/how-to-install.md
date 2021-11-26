---
sidebar_position: 3
---

# How to install?

## Prerequisites

Before you try to install `blameless-slo` package please make sure that you have installed Node.js at your machine. To confirm that, open your terminal and type **`node -v`**. If you recieve information of node version, you have installed Node.js at your machine. After that type **`npm -v`** and you should recieve information about your npm version.

Next, you should setup your **`Github Personal Access Token (PAT)`**. If you don't create and set properly your PAT, first time when you try to install package it will fail to find it (will throw 404 Package Not Found).

### Personal Access Token

Login to your Github account, and go to **`Settings`**. At your left side bar find and open **`Developer settings`**. It will navigates you to page where you can create **PAT**.

:warning: **When creating your PAT please select following scopes `repo`, `write:packages`, `read:packages`, `delete:packages`**. If you don't set those scopes you may face with issue while installing package. If you forgot to pick some of the scopes please create new token, updating existing one won't work. Once you generate it please copy it, because you won't be able to see it again.

Next, go to your user root folder and find **`.npmrc`** file. If file exist modify, otherwise create it with following content

```jsx title=".npmrc"
@blamelesshq:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

:::tip Info

You need to setup PAT only in case if you are using private version of package. Later this package would be available in public **[npm repository](https://www.npmjs.com/)** and you don't need to setup your token.

:::

## Install package

Open your terminal and execute following command:

```jsx 
npm install -g @blamelesshq/blameless-slo@1.0.1
```

:::tip Note

Please replace **`1.0.1`** with current latest version, and make sure that always use latest version because that version contains latest features and bug fixes.

:::

Or install via package.json

```jsx title="package.json"
"@blamelesshq/blameless-slo": "1.0.1"
```