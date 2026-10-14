---
title: Introduction
description: What Telesphorepo is, which repository formats it hosts, and how its parts fit together.
---

Telesphorepo is a self-hosted package repository. It hosts Maven repositories (including Gradle plugins), Debian (apt) repositories and raw file repositories.

It is one Go binary with the web UI built in. Metadata lives in SQLite. File contents (blobs) live on the local disk or in any S3-compatible bucket, such as Cloudflare R2, SeaweedFS or AWS S3.

## What it hosts

| Format | What you store | Guide |
|---|---|---|
| `maven` | Maven and Gradle artifacts, including Gradle plugins | [Maven and Gradle](/repositories/maven-gradle/) |
| `debian` | `.deb` packages, served as a signed apt repository | [Debian](/repositories/debian/) |
| `raw` | Plain files at any path | [Raw files](/repositories/raw/) |

Each format is a plugin. The server core does not know the formats by name.

## What it does not do

- It hosts only. It has no proxy or cache repositories.
- It does not implement the Nexus API. You can still [migrate from Nexus 3](/operations/nexus-migration/).

## How the parts fit together

- **Server.** One process. It serves the web UI, the JSON API and the format routes (`/maven/...`, `/debian/...`, `/raw/...`) on one port, 8080 by default.
- **Database.** SQLite, in the data directory. It holds users, repositories, settings and an index of every stored file.
- **Blob storage.** Local disk by default. You can switch to S3 on the Settings page, and the server [moves the existing files](/operations/moving-storage/) for you.
- **Settings.** Almost all configuration lives in the database and on the Settings page. See [Configuration](/getting-started/configuration/).
- **Publishing.** Every upload needs a short-lived publish session. A password or a read token can read but never write. See the [publishing overview](/publishing/overview/).

## Where to go next

1. [Install](/getting-started/install/) the server.
2. Follow [First run](/getting-started/first-run/) to sign in, set up two-factor authentication and create a repository.
3. Read [Configuration](/getting-started/configuration/) before you put the server on a public address.
