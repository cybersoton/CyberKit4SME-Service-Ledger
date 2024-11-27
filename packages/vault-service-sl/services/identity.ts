import { createAlgoAccount, importAlgoAccount } from 'algo'
import { auth, secrets, system } from 'vault-http'
import { GenPolicy } from '../templates/generatePolicy'
import { HashiCorpVaultLoginService } from './login'

class HashiCorpVaultIdentityService extends HashiCorpVaultLoginService {
  async createGroup(groupName: string, importMn?: string) {
    try {
      const { id, name } = await secrets.identity.group.createGroup(
        this.token,
        {
          name: groupName,
        }
      )

      const pTransitEngine = system.mounts.enableSecretsEngine(
        this.token,
        `transit/${groupName}`,
        {
          type: 'transit',
        }
      )

      const algoAccountDetails = !importMn
        ? createAlgoAccount()
        : importAlgoAccount(importMn)

      const pCreateDataSk = secrets.secret.createSecret(
        this.token,
        `${groupName}/algo-sk`,
        {
          private_key: Buffer.from(
            algoAccountDetails?.account_sk || ''
          ).toString('base64'),
        }
      )

      const pCreateDataPub = secrets.secret.createSecret(
        this.token,
        `${groupName}/algo-pub`,
        {
          public_address: Buffer.from(
            algoAccountDetails?.account_address || ''
          ).toString('base64'),
        }
      )

      const [transitEngine = {}, secret] = await Promise.all([
        pTransitEngine,
        pCreateDataSk,
        pCreateDataPub,
      ])

      const policyPayloadGroup = GenPolicy.generateGroupPolicy(name)
      const policyPayloadUsers = GenPolicy.generateGroupUsersPolicy(id)
      const groupUsers = `${groupName}-users`

      const pCreateACLPolicyGroup = system.policies.createACLPolicy(
        this.token,
        groupName,
        policyPayloadGroup
      )

      const pCreateACLPolicyUsers = system.policies.createACLPolicy(
        this.token,
        groupUsers,
        policyPayloadUsers
      )

      const pUpdateGroupById = secrets.identity.group.updateGroupById(
        this.token,
        id,
        {
          policies: [`${groupName}`],
        }
      )

      const pCreateKey = secrets.transit.createKeyInGroup(
        this.token,
        'stix',
        groupName,
        {
          type: 'aes256-gcm96',
        }
      )

      const [policyGroup, policyGroupUsers, update_group = {}, vault] = await Promise.all([
        pCreateACLPolicyGroup,
        pCreateACLPolicyUsers,
        pUpdateGroupById,
        pCreateKey,
      ])
      
      const org = await secrets.identity.group.readGroupById(this.token, id)
      const { creation_time, policies } = org

      if (algoAccountDetails) {
      	
        const { account_address, account_mnemonic } = algoAccountDetails
        const algorand = {"account_address": account_address, "account_mnemonic": account_mnemonic}
        
        return Promise.resolve({
          name,
          id,
          creation_time,
          policies,
          //member_entity_ids,
          vault,
          algorand
        })
      }
      
      return Promise.resolve({ name, id, creation_time, policies, vault })
      
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  
  async createEntityInGroup(username: string, password: string, groupName: string, groupRole: string) {
    
    const policies_admins = ['sl-admins', 'default']
    const policies_users = ['sl-users', `${groupName}-users`, 'default']
    
    try {
      
      let pCreateUserpass
      if (groupRole === "admin") {
      	
      	pCreateUserpass = auth.userpass.createUserpass(
          this.token,
          username,
          {
            password,
            policies: policies_admins,
            token_policies: policies_admins
          }
        )
      } else {
      	
      	pCreateUserpass = auth.userpass.createUserpass(
          this.token,
          username,
          {
            password,
            policies: policies_users,
            token_policies: policies_users
          }
        )
      }

      const pGetAuthAccessor = system.auth.getAuthAccessor(
        this.token,
        'userpass'
      )
      
      const entity_info = {"organisation": groupName, "role": groupRole}
      
      let pCreateEntity
      if (groupRole === "admin") {
      
      	pCreateEntity = secrets.identity.entity.createEntity(
          this.token,
          {
            name: username,
            policies: policies_admins,
            metadata: entity_info
          }
        )
      } else {
      	
      	pCreateEntity = secrets.identity.entity.createEntity(
          this.token,
          {
            name: username,
            policies: policies_users,
            metadata: entity_info
          }
        )
      }

      

      const pReadGroupByName = secrets.identity.group.readGroupByName(
        this.token,
        groupName
      )

      const [userPass = {}, authAccessor, entity, group] = await Promise.all([
        pCreateUserpass,
        pGetAuthAccessor,
        pCreateEntity,
        pReadGroupByName,
      ])

      await secrets.identity.entity_alias.createEntityAlias(this.token, {
        name: username,
        canonical_id: entity.id,
        mount_accessor: authAccessor,
      })
      
      if(group.member_entity_ids == null){
      	group.member_entity_ids = ['']
      }
      
      const updateGroup = await secrets.identity.group.updateGroupById(
        this.token,
        group.id,
        {
          member_entity_ids: [...group.member_entity_ids, entity.id],
        }
      )
      
      const { name, id, metadata, policies, creation_time, group_ids } = await secrets.identity.entity.readEntityByName(this.token, username)

      return Promise.resolve({ name, id, metadata, policies, creation_time, group_ids })
      
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  async deleteUser(groupName: string, username: string) {
    
    try {
      
      const authentication = await auth.userpass.deleteUserpass(this.token, username)
      
      const entity = await secrets.identity.entity.deleteEntityByName(this.token, username)
      
      return Promise.resolve({ name: groupName, authentication, entity })
      
    } catch (error) {
      return Promise.reject(error)
    }
  }
  
  async listGroupUsers(groupName: string) {
    
    try {
      
      const group = await secrets.identity.group.readGroupByName(this.token, groupName)
      const users_ids = group.member_entity_ids
      
      const pUsers = users_ids.map( user_id => secrets.identity.entity.readEntityById(this.token, user_id) )
      const users_info = await Promise.all(pUsers)
      
      const users = users_info.map( user => user.name)
      
      return Promise.resolve(users)
      
    } catch (error) {
      return Promise.reject(error)
    }
  }

  setToken(token: string) {
    this.token = token
    return this
  }
}

export default new HashiCorpVaultIdentityService()
