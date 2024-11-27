# Group Creation
path "identity/group" {
  capabilities = ["create", "update"]
}

# Group Update
path "identity/group/+/*" {
  capabilities = ["update", "read"]
}

# Transit Secret Engine Creation
path "sys/mounts/transit/*" {
  capabilities = ["create", "update"]
}

# Transit Key Creation
path "transit/+/keys/stix" {
  capabilities = ["create", "update"]
}

# Create Algo Secret sk
path "secret/data/+/algo-*" {
  capabilities = ["create"]
}

# Create Policies
path "sys/policy/*" {
  capabilities = ["create", "update"]
}

# Create Userpass
path "auth/userpass/users/*" {
  capabilities = ["create", "update"]
}

# Get AuthMethods
path "sys/auth" {
  capabilities = ["read", "list"]
}

# Create Entities
path "identity/entity" {
  capabilities = ["create", "update"]
}

# Read Entities
path "identity/entity/name/*" {
  capabilities = ["read"]
}

# Create Entity Alias
path "identity/entity-alias" {
  capabilities = ["create", "update"]
}
