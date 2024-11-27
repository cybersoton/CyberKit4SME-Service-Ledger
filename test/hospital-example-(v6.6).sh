#!/bin/bash

#Register the Hospital organisation in SL, along with its admin
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"org_name": "hospital", "username": "hospital_admin","password": "hosadm"}' \
	https://localhost:6023/v1/signup/admin | jq -r "."

#Admin login
ADMIN_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "hospital_admin","password": "hosadm"}' \
	https://localhost:6023/v1/login | jq -r ".sl_token")
	
#Get the Algorand account address of the Hospital
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	https://localhost:6023/v1/hospital/algo_account | jq -r "."
	
#Create user1 for the Hospital
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"username": "hospital_user1","password": "pass1"}' \
	https://localhost:6023/v1/signup/hospital/user | jq -r "."
	
#Create user2 for the Hospital
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"username": "hospital_user2","password": "pass2"}' \
	https://localhost:6023/v1/signup/hospital/user | jq -r "."
	
#Create a user3 for the Hospital
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	--data '{"username": "hospital_user3","password": "pass3"}' \
	https://localhost:6023/v1/signup/hospital/user | jq -r "."

#Get Hospital's users
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	https://localhost:6023/v1/hospital/users | jq -r "."
	
#Remove a user from Hospital
curl -sk --request DELETE \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	https://localhost:6023/v1/hospital/users/hospital_user2 | jq -r "."
	
#Get Hospital's users
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${ADMIN_TOKEN}" \
	https://localhost:6023/v1/hospital/users | jq -r "."
	
#Register the Sogei organisation in SL, along with its admin
curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"org_name": "sogei", "username": "sogei_admin","password": "sogadm"}' \
	https://localhost:6023/v1/signup/admin | jq -r "."
	
#Admin login
SOGEI_ADMIN_TOKEN=$(curl -sk --request POST \
	--header "Content-Type: application/json" \
	--data '{"username": "sogei_admin","password": "sogadm"}' \
	https://localhost:6023/v1/login | jq -r ".sl_token")
	
#Get Hospital's users ---> This should raise error
curl -sk --request GET \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${SOGEI_ADMIN_TOKEN}" \
	https://localhost:6023/v1/hospital/users | jq -r "."
	
#Remove a user from Hospital ---> This should raise error
curl -sk --request DELETE \
	--header "Accept: application/json" \
	--header "Authorization: Bearer ${SOGEI_ADMIN_TOKEN}" \
	https://localhost:6023/v1/sogei/users/hospital_user3 | jq -r "."
