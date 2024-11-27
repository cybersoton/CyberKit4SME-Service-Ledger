#!/bin/sh

VAULT_TOKEN=$1

ROLE=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
	localhost:8200/v1/auth/approle/role/sl/role-id | jq -r ".data[\"role_id\"]")

SECRET=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
	--request POST \
	localhost:8200/v1/auth/approle/role/sl/secret-id | jq -r ".data[\"secret_id\"]")

PAYLOAD="{ \"role_id\": \"${ROLE}\", \"secret_id\": \"${SECRET}\" }"

curl -s \
	--request POST \
	--data "$PAYLOAD" \
	http://127.0.0.1:8200/v1/auth/approle/login | jq -r ".auth[\"client_token\"]"

echo "${ROLE}"
echo "${SECRET}"
