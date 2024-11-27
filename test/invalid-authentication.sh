#!/bin/bash

########## SERVICE LEDGER API TESTING ##########

echo "Testing the authorisation middleware of the SL's Authentication Server...\n"

curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"org_name": "hospital", "username": "hospital_admin","password": "hosadm"}' \
	https://localhost:6012/v1/signup/admin | jq -r "." > /dev/null
	
echo "[TEST 1] Omitting a token to create a user"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "hospital_user1","password": "password"}' \
	https://localhost:6012/v1/signup/hospital/user | jq -r "."
echo "[TEST 1] COMPLETE"

echo "[TEST 2] Sending an invalid token to create a user"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer 01GW9E8WZ9MDGILBHK9K2BJBZB" \
	--data '{"username": "hospital_user1","password": "password"}' \
	https://localhost:6012/v1/signup/hospital/user | jq -r "."
echo "[TEST 2] COMPLETE"

ADMIN_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "hospital_admin","password": "hosadm"}' \
	https://localhost:6012/v1/login | jq -r ".sl_token")
	
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"username": "hospital_user1","password": "password"}' \
	https://localhost:6012/v1/signup/hospital/user | jq -r "." > /dev/null
	
USER_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "hospital_user1","password": "password"}' \
	https://localhost:6012/v1/login | jq -r ".sl_token")
	
echo "[TEST 3] An user, with a correct token, trying to create another user"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${USER_TOKEN}" \
	--data '{"username": "hospital_user1","password": "password"}' \
	https://localhost:6012/v1/signup/hospital/user | jq -r "."
echo "[TEST 3] COMPLETE"

echo "\nTesting the authorisation middleware of the SL's TAXII Server...\n"

echo "[TEST 4] Omitting a token to create an apiroot"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"title": "The Hospital","description": "Hospital Group"}' \
	https://localhost:6011/hospital | jq -r "."
echo "[TEST 4] COMPLETE"

echo "[TEST 5] Sending an invalid token to create an apiroot"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer 01GW9E8WZ9MDGILBHK9K2BJBZB" \
	--data '{"title": "The Hospital","description": "Hospital Group"}' \
	https://localhost:6011/hospital | jq -r "."
echo "[TEST 5] COMPLETE"

echo "[TEST 6] An user, with a correct token, trying to create an apiroot"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${USER_TOKEN}" \
	--data '{"title": "The Hospital","description": "Hospital Group"}' \
	https://localhost:6011/hospital | jq -r "."
echo "[TEST 6] COMPLETE"

curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"title": "The Hospital","description": "Hospital Group"}' \
	https://localhost:6011/hospital | jq -r "." > /dev/null
	
echo "[TEST 7] Omitting a token to create a collection"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "."
echo "[TEST 7] COMPLETE"

echo "[TEST 8] Sending an invalid token to create a collection"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: 01GW9E8WZ9MDGILBHK9K2BJBZB" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "."
echo "[TEST 8] COMPLETE"

echo "[TEST 9] An user, with a correct token, trying to create a collection"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${USER_TOKEN}" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "."
echo "[TEST 9] COMPLETE"

curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"org_name": "grocery", "username": "grocery_admin","password": "groadm"}' \
	https://localhost:6012/v1/signup/admin | jq -r "." > /dev/null
	
GRO_ADMIN_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "grocery_admin","password": "groadm"}' \
	https://localhost:6012/v1/login | jq -r ".sl_token")
	
echo "[TEST 10] An admin of another organisation, with a correct token, trying to create a collection"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${GRO_ADMIN_TOKEN}" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "."
echo "[TEST 10] COMPLETE"

curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${GRO_ADMIN_TOKEN}" \
	--data '{"username": "grocery_user1","password": "gropass"}' \
	https://localhost:6012/v1/signup/grocery/user | jq -r "." > /dev/null
	
GRO_USER_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "grocery_user1","password": "gropass"}' \
	https://localhost:6012/v1/login | jq -r ".sl_token")
	
echo "[TEST 11] An user of another organisation, with a correct token, trying to create a collection"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${GRO_USER_TOKEN}" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "."
echo "[TEST 11] COMPLETE"

curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"title": "Attacks","alias": "attack"}' \
	https://localhost:6011/hospital/collections | jq -r "." > /dev/null

echo "[TEST 12] An admin of another organisation, with a correct token, trying to get a collection"
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${GRO_ADMIN_TOKEN}" \
	https://localhost:6011/hospital/collections/attack | jq -r "."
echo "[TEST 12] COMPLETE"

echo "[TEST 13] An user of another organisation, with a correct token, trying to get a collection"
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${GRO_USER_TOKEN}" \
	https://localhost:6011/hospital/collections/attack | jq -r "."
echo "[TEST 13] COMPLETE"

echo "[TEST 14] Omitting a token to create a STIX object"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data @stix-obj-example.json \
	https://localhost:6011/hospital/collections/attack/objects | jq -r "."
echo "[TEST 14] COMPLETE"

echo "[TEST 15] Sending an invalid token to create a STIX object"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer 01GW9E8WZ9MDGILBHK9K2BJBZB" \
	--data @stix-obj-example.json \
	https://localhost:6011/hospital/collections/attack/objects | jq -r "."
echo "[TEST 15] COMPLETE"

echo "[TEST 16] An admin of another organisation, with a correct token, trying to create a STIX object"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${GRO_ADMIN_TOKEN}" \
	--data @stix-obj-example.json \
	https://localhost:6011/hospital/collections/attack/objects | jq -r "."
echo "[TEST 16] COMPLETE"

echo "[TEST 17] An user of another organisation, with a correct token, trying to create a STIX object"
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${GRO_USER_TOKEN}" \
	--data @stix-obj-example.json \
	https://localhost:6011/hospital/collections/attack/objects | jq -r "."
echo "[TEST 17] COMPLETE"
