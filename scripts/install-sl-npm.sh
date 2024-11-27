#!/bin/bash

#Install dependencies
npm install

#Install Typescript compiler
npm i ts-node

#Migrate the tables defined by the Prisma Schema to Postgres
npx prisma migrate dev --name sl

#Seed the database with a STIX discovery object (https://docs.oasis-open.org/cti/taxii/v2.1/os/taxii-v2.1-os.html#_Toc31107526)
npx prisma db seed

#Build SL's apps and packages
npm run build

#Initialise and configure Hashicorp Vault
scripts/vault-init.sh
scripts/vault-conf.sh

#Run the SL's TAXII Server and Admin Server
npm run dev
