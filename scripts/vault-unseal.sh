#!/bin/bash

UNSEAL_KEYS=($( grep "HCV_KEY" .env | cut -d '=' -f 2 | tr -d \"))

#Unseal the Vault server
for KEY in "${UNSEAL_KEYS[@]}"
do
	SEALED=$(curl -s --request POST \
    		--data "{\"key\": \"${KEY}\"}" \
    		localhost:8223/v1/sys/unseal | jq -r ".sealed")
    	if ! $SEALED; then
		echo "[HashiCorp Vault] Server unsealed"
		break
	fi
done

#Print status of the Vault server
echo "[HashiCorp Vault] Status:"
curl -s localhost:8223/v1/sys/health | jq -r
