#!/bin/bash

#Initialise the Vault server
INIT=$(curl -s --request POST \
    	--data '{"secret_shares": 3, "secret_threshold": 2}' \
    	localhost:8223/v1/sys/init)
echo "[HashiCorp Vault] Server initialised"

UNSEAL_KEYS=($(echo $INIT | jq -rc ".keys[]"))

#Save the Unseal Keys into .env files
#echo "[HashiCorp Vault] Unseal Keys:"
for j in "${!UNSEAL_KEYS[@]}"
do
	#echo ${UNSEAL_KEYS[$j]}
	nkey=$((j+1))
	sed -i "s/HCV_KEY${nkey}=.*/HCV_KEY${nkey}=\"${UNSEAL_KEYS[$j]}\"/" .env
	sed -i "s/HCV_KEY${nkey}=.*/HCV_KEY${nkey}=\"${UNSEAL_KEYS[$j]}\"/" apps/sl-taxii/.env
	sed -i "s/HCV_KEY${nkey}=.*/HCV_KEY${nkey}=\"${UNSEAL_KEYS[$j]}\"/" apps/sl-auth/.env
done

VAULT_TOKEN=$(echo $INIT | jq -r ".root_token")

#Save the Root Token into .env files
#echo "[HashiCorp Vault] Root Token: $VAULT_TOKEN"
sed -i "s/HCV_ROOT_TOKEN=.*/HCV_ROOT_TOKEN=\"${VAULT_TOKEN}\"/" .env
sed -i "s/HCV_ROOT_TOKEN=.*/HCV_ROOT_TOKEN=\"${VAULT_TOKEN}\"/" apps/sl-taxii/.env
sed -i "s/HCV_ROOT_TOKEN=.*/HCV_ROOT_TOKEN=\"${VAULT_TOKEN}\"/" apps/sl-auth/.env

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
