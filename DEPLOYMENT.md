# Azure Deployment Guide

This document describes how to deploy Sentence Builder to Microsoft Azure.

## Architecture

```
┌──────────────────────────┐       ┌────────────────────────────┐
│ Azure Static Web App     │──────▶│ Azure Container App        │
│ (Angular frontend)       │       │ (Node/Express backend)     │
└──────────────────────────┘       └──────────────┬─────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │ Azure Database for         │
                                   │ PostgreSQL Flexible Server │
                                   └────────────────────────────┘
```

## Prerequisites

- Azure CLI installed (`az --version`)
- Docker installed locally
- Azure subscription

## Step 1 — Login and resource group

```bash
az login
az group create --name rg-sentence-builder --location westeurope
```

## Step 2 — Azure Container Registry

```bash
az acr create \
  --resource-group rg-sentence-builder \
  --name sbsentencebuilder \
  --sku Basic \
  --admin-enabled true

az acr login --name sbsentencebuilder
```

## Step 3 — Build and push images

```bash
docker build -t sbsentencebuilder.azurecr.io/backend:latest ./backend
docker build -t sbsentencebuilder.azurecr.io/frontend:latest ./frontend

docker push sbsentencebuilder.azurecr.io/backend:latest
docker push sbsentencebuilder.azurecr.io/frontend:latest
```

## Step 4 — PostgreSQL Flexible Server

```bash
az postgres flexible-server create \
  --resource-group rg-sentence-builder \
  --name sb-postgres \
  --location westeurope \
  --admin-user appuser \
  --admin-password 'Str0ngP@ssword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --public-access 0.0.0.0

az postgres flexible-server db create \
  --resource-group rg-sentence-builder \
  --server-name sb-postgres \
  --database-name sentence_builder

az postgres flexible-server firewall-rule create \
  --resource-group rg-sentence-builder \
  --name sb-postgres \
  --rule-name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

Load the schema and seed using `psql` or Azure Data Studio:

```bash
psql "host=sb-postgres.postgres.database.azure.com \
      port=5432 dbname=sentence_builder \
      user=appuser password=Str0ngP@ssword123! sslmode=require" \
     -f backend/db/schema.sql \
     -f backend/db/seed.sql
```

## Step 5 — Container Apps environment

```bash
az containerapp env create \
  --name sb-env \
  --resource-group rg-sentence-builder \
  --location westeurope
```

## Step 6 — Deploy backend

```bash
az containerapp create \
  --name sb-backend \
  --resource-group rg-sentence-builder \
  --environment sb-env \
  --image sbsentencebuilder.azurecr.io/backend:latest \
  --registry-server sbsentencebuilder.azurecr.io \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    DATABASE_URL="postgres://appuser:Str0ngP@ssword123!@sb-postgres.postgres.database.azure.com:5432/sentence_builder?sslmode=require" \
    CORS_ORIGIN="*"
```

Copy the FQDN from the output — you'll need it in Step 8.

## Step 7 — Deploy frontend

```bash
az containerapp create \
  --name sb-frontend \
  --resource-group rg-sentence-builder \
  --environment sb-env \
  --image sbsentencebuilder.azurecr.io/frontend:latest \
  --registry-server sbsentencebuilder.azurecr.io \
  --target-port 80 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3
```

## Step 8 — Update CORS

Update the backend CORS origin to your frontend's FQDN:

```bash
az containerapp update \
  --name sb-backend \
  --resource-group rg-sentence-builder \
  --set-env-vars CORS_ORIGIN="https://<frontend-fqdn>"
```

## Step 9 — Verify

```bash
curl https://<backend-fqdn>/health
curl https://<backend-fqdn>/api/word-types
```

Open `https://<frontend-fqdn>` in a browser.

## Alternative — Azure Static Web Apps for the frontend

If you prefer Static Web Apps over Container Apps:

1. Push the repo to GitHub.
2. In the Azure Portal, create a Static Web App linked to the repo.
3. Set **App location** to `/frontend`.
4. Set **Output location** to `dist/frontend/browser`.
5. Add a build-time environment variable `API_BASE` pointing at the backend FQDN.

## Cost Control

- Container Apps scale to zero — set `--min-replicas 0` for dev.
- PostgreSQL Burstable B1ms is the cheapest tier.
- Delete the resource group when done:

```bash
az group delete --name rg-sentence-builder --yes
```
