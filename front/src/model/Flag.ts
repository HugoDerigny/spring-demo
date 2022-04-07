export interface CreateFlag extends Flag {
	serviceId: string
}

export interface Flag {
	serviceId: string
	id: number
	key: string
	value: string
	description: string
	enabled: boolean
}