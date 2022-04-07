import {Flag} from "./Flag";

export interface Service {
	id: string
	label: string
	flags: Flag[]
}