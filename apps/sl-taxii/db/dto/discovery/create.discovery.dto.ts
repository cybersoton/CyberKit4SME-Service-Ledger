import { PutDiscoveryDto } from "./put.discovery.dto";

export interface CreateDiscoveryDto extends PutDiscoveryDto {
	id: string,
	title: string;
}