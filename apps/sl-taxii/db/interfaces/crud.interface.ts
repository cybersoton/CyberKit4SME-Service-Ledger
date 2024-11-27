export interface CRUD {
	create: (resource: any, hostname?: string, slug?: string, digest?: string) => Promise<any>;
	deleteById: (id: string) => Promise<string>;
	list: (limit: number, page: number) => Promise<any>;
	patchById: (id: string, resource: any) => Promise<any>;
	putById: (id: string, resource: any) => Promise<string>;
	readById: (id: string) => Promise<any>;
}
