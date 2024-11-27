#!/bin/bash

#Unseal the Vault service
scripts/vault-unseal.sh

#Run the SL's TAXII Server and Admin Server
echo "[Service Ledger] Starting the TAXII Server and the Authentication Server"
echo "[Service Ledger] Listening on ports 6011 (taxii) and 6012 (auth)"
npm run dev >> sl.log &
