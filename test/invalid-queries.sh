#!/bin/bash

########## SERVICE LEDGER API TESTING ##########

echo "Testing the API queries of the SL's TAXII Server...\n"



ADMIN_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "hospital_admin","password": "hosadm"}' \
	https://localhost:6023/v1/login | jq -r ".sl_token")
	

	
echo '[TEST 1] Passing a wrong keyword as parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?added_after=01/01/2023&next=bundle--2a25c3c8-5d88-4ae9-862a-cc3396442317' | jq -r "."
echo "[TEST 1] COMPLETE"

echo '[TEST 2] Passing a wrong field of "match" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?added_after=01/01/2023&match[spec_version]=2.1' | jq -r "."
echo "[TEST 2] COMPLETE"

echo '[TEST 3] Passing a more than one "added_after" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?added_after=01/01/2023&added_after=01/02/2023' | jq -r "."
echo "[TEST 3] COMPLETE"

echo '[TEST 4] Passing a more than one "limit" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?limit=20&limit=23' | jq -r "."
echo "[TEST 4] COMPLETE"

echo '[TEST 5] Passing duplicates in "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?match[version]=first&match[version]=last&match[version]=first' | jq -r "."
echo "[TEST 5] COMPLETE"

echo '[TEST 6] Passing a wrong format in "added_after" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?added_after=first' | jq -r "."
echo "[TEST 6] COMPLETE"

echo '[TEST 7] Passing a wrong format in "limit" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?limit=h3ll0' | jq -r "."
echo "[TEST 7] COMPLETE"

echo '[TEST 8] Passing a wrong field of "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?match[version]=firstly' | jq -r "."
echo "[TEST 8] COMPLETE"

echo '[TEST 9] Passing a wrong field of "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?match[version]=first&match[version]=all' | jq -r "."
echo "[TEST 9] COMPLETE"

echo '[TEST 10] Passing a wrong format in "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?match[type]=bundle&match[version]=01/01/2023' | jq -r "."
echo "[TEST 10] COMPLETE"

echo '[TEST 11] Passing a wrong format in "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?match[type]=bundle&match[version]=first&match[version]=01/01/2023' | jq -r "."
echo "[TEST 11] COMPLETE"

echo '[TEST 12] Passing a wrong format in "match[version]" parameter'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects?limit=10\&match[type]=bundle\&match[version]=first&match[version]=01/01/2023' | jq -r "."
echo "[TEST 12] COMPLETE"

echo '[TEST 13] Using "match[type]" parameter on /versions URL, which is not enabled'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects/bundle--2a25c3c8-5d88-4ae9-862a-cc3396442317/versions?match[type]=bundle' | jq -r "."
echo "[TEST 13] COMPLETE"

echo '[TEST 14] Using "match[type]" parameter on /{obj-id} URL, which is not enabled'
curl -skg --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	'https://localhost:6023/hospital/collections/attack/objects/bundle--2a25c3c8-5d88-4ae9-862a-cc3396442317?match[type]=bundle' | jq -r "."
echo "[TEST 14] COMPLETE"

