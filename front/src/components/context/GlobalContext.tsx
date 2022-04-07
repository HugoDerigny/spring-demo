import React, { ReactNode, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { http } from '../../utils'
import {Service} from "../../model/Service";

interface Props {
	children: ReactNode
}

type GlobalContextType = {
	services: Service[] | undefined
	setServices: (services: Service[]) => void
	fetchServices: Function
	modal: {
		node: JSX.Element | undefined
		set: (modal: JSX.Element) => void
		close: Function
	}
}

const GlobalContext = React.createContext({} as GlobalContextType)

function ContextProvider({ children }: Props) {
	const [services, setServices] = useState<Service[]>()
	const [activeModal, setActiveModal] = useState<JSX.Element>()

	useEffect(() => {
		fetchServices()
	}, [])

	async function fetchServices(): Promise<void> {
		try {
			const { data }: AxiosResponse = await http.get<Service[]>('/services')

			setServices(data)
		} catch (e) {
			// TODO: better error handling
		}
	}

	return (
		<GlobalContext.Provider
			value={{
				services,
				setServices,
				fetchServices,
				modal: {
					node: activeModal,
					set: (modal: JSX.Element) => {
						setActiveModal(modal)
					},
					close: () => {
						setActiveModal(undefined)
					},
				},
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}

export { GlobalContext }
export default ContextProvider
