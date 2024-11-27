# Group Update
path "identity/group/+/*" {
  capabilities = ["update", "read"]
}

# Create and delete Userpass
path "auth/userpass/users/*" {
  capabilities = ["create", "update", "delete"]
}

# Get AuthMethods
path "sys/auth" {
  capabilities = ["read", "list"]
}

# Create Entities
path "identity/entity" {
  capabilities = ["create", "update"]
}

# Read and delete Entities
path "identity/entity/+/*" {
  capabilities = ["read", "delete"]
}

# Create Entity Alias
path "identity/entity-alias" {
  capabilities = ["create", "update"]
}
