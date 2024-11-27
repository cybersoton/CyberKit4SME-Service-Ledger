import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
	const discovery = await prisma.discovery.upsert({
		where: { id: 'taxii2' },
		update: {},
		create: {
			id: 'taxii2',
			title: 'TAXII V2.1 Implementation',
			description: 'This is the discovery listing all available api roots',
			contact: 'University of Southampton'
		},
	})
	console.log({ discovery })
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})