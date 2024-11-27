/* eslint-disable no-unused-vars */
import * as http from './http'
import * as auth from './auth'
import * as secrets from './secrets'
import * as system from './system'

const { identity } = secrets

export namespace HCV {
  export namespace Types {
    export type HashiCorpVaultRequestError = http.HashiCorpVaultRequestError
    export type HashiCorpVaultResponse = http.HashiCorpVaultResponse

    export namespace Secrets {
      export type DecryptedDataResponse = secrets.transit.DecryptedDataResponse
      export type EncryptedDataResponse = secrets.transit.EncryptedDataResponse

      export type CreateSecretDataResponse =
        secrets.secret.CreateSecretDataResponse
      export type ReadSecretDataResponse = secrets.secret.ReadSecretDataResponse

      export namespace Identity {
        export type CreateEntityDataResponse =
          secrets.identity.entity.CreateEntityDataResponse
        export type GetEntityDataResponse =
          secrets.identity.entity.GetEntityDataResponse
        export type GetEntityIdDataResponse =
          secrets.identity.entity.GetEntityIdDataResponse

        export type CreateEntityAliasDataResponse =
          secrets.identity.CreateEntityAliasDataResponse

        export type CreatedGroupDataResponse =
          secrets.identity.group.CreatedGroupDataResponse
        export type ReadGroupDataResponse =
          secrets.identity.group.ReadGroupDataResponse
      }
    }

    export namespace Auth {
      export type LoginDataResponse = auth.LoginDataResponse
    }

    export namespace System {
      export type AuthAccessorDataResponse = system.AuthAccessorDataResponse
    }
  }
}

export type CreateResponseData = {
  created_time: Date
  custom_metadata: object | null
  deletion_time: Date
  destroyed: boolean
  version: number
}

export type ReadResponseData = {
  data: {
    data: object
  }
  metadata: CreateResponseData
}
