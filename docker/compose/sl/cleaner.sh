#!/bin/bash

docker compose down --volumes

rm -rf storage/postgres/
rm -rf storage/ipfs/
rm -rf storage/vault/file/

docker image rm uoscyber/service-ledger:6.5
