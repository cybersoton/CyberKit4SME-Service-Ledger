#!/bin/bash

#Update the SL's environment for docker network

#Update global env
sed -i "s/localhost/sl-postgres/" .env

#Update TAXII Server env
sed -i "s/cyber@localhost/cyber@sl-postgres/" apps/sl-taxii/.env
sed -i "s/ALGOD_SERVER=\"http:\/\/localhost\"/ALGOD_SERVER=\"http:\/\/algorand-sandbox-algod\"/" apps/sl-taxii/.env
sed -i "s/INDEXER_SERVER=\"http:\/\/localhost\"/INDEXER_SERVER=\"http:\/\/algorand-sandbox-indexer\"/" apps/sl-taxii/.env
sed -i "s/IPFS_SERVER=\"localhost\"/IPFS_SERVER=\"sl-ipfs\"/" apps/sl-taxii/.env
sed -i "s/HCV_HOST=\"localhost\"/HCV_HOST=\"sl-vault\"/" apps/sl-taxii/.env
sed -i "s/redis:\/\/localhost/redis:\/\/sl-redis/" apps/sl-taxii/.env

#Update Admin Server env
sed -i "s/cyber@localhost/cyber@sl-postgres/" apps/sl-auth/.env
sed -i "s/ALGOD_SERVER=\"http:\/\/localhost\"/ALGOD_SERVER=\"http:\/\/algorand-sandbox-algod\"/" apps/sl-auth/.env
sed -i "s/INDEXER_SERVER=\"http:\/\/localhost\"/INDEXER_SERVER=\"http:\/\/algorand-sandbox-indexer\"/" apps/sl-auth/.env
sed -i "s/HCV_HOST=\"localhost\"/HCV_HOST=\"sl-vault\"/" apps/sl-auth/.env
sed -i "s/redis:\/\/localhost/redis:\/\/sl-redis/" apps/sl-auth/.env

#Update Vault scripts
sed -i "s/localhost/sl-vault/" scripts/vault-init.sh
sed -i "s/localhost/sl-vault/" scripts/vault-conf.sh
sed -i "s/localhost/sl-vault/" scripts/vault-unseal.sh
