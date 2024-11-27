#!/bin/bash

#Migrate the tables defined by the Prisma Schema to Postgres
npx prisma migrate dev --name sl

#Seed the database with a STIX discovery object (https://docs.oasis-open.org/cti/taxii/v2.1/os/taxii-v2.1-os.html#_Toc31107526)
npx prisma db seed

#Build SL's apps and packages
npm run build

#Keep the container running
tail -f /dev/null
