export class GenPolicy {

	static generateGroupPolicy(groupName: string) {
		  const transitEncrypt = `path "transit/${groupName}/encrypt/*" {\n\tcapabilities = [ "update" ]\n}`
		  const transitDecrypt = `path "transit/${groupName}/decrypt/*" {\n\tcapabilities = [ "update" ]\n}`
		  const secretsAccess = `path "secret/data/${groupName}/algo-*" {\n\tcapabilities = [ "read" ]\n}`

		  const policyString = `${transitEncrypt}\n\n${transitDecrypt}\n\n${secretsAccess}`
		  
		  return {
		    policy: Buffer.from(policyString).toString('base64'),
		  }
	}

	static generateGroupUsersPolicy(groupId: string) {
		  //{{identity.groups.ids.${groupId}.name}}
		  const readGroup = `path "identity/group/id/${groupId}" {\n\tcapabilities = [ "read" ]\n}`

		  const policyString = `# Read Group\n${readGroup}\n`
		  
		  return {
		    policy: Buffer.from(policyString).toString('base64'),
		  }
	}

}
