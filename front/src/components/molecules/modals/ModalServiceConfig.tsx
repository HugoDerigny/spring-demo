import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import { FC, FormEvent, useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { http } from '../../../utils'
import { Service } from "../../../model/Service";
import { v4 as uuidv4 } from 'uuid'

interface Props {
	service?: Service
}

const ModalServiceConfig: FC<Props> = ({ service }) => {
	const { fetchServices, modal } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)

	const [label, setLabel] = useState<string>(service?.label ?? '')

	function handleSubmit(event: FormEvent): void {
		event.preventDefault()

		setLoading(true)

		service ? updateService() : createService()
	}

	function createService(): void {
		http.post('/services', { id: uuidv4(),label })
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function updateService(): void {
		http.put(`/services/${service!.id}`, { label })
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function deleteService(): void {
		setLoading(true)

		http.delete(`/services/${service!.id}`)
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{service ? `Update ${service.label}` : 'Add a service'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-primary-600 font-semibold'>
								Service's label
							</legend>
							<label>
								<input
									name='service-name'
									className='form-input input'
									type='text'
									placeholder='my-front-end'
									required
									onChange={(e) => setLabel(e.target.value)}
									value={label}
								/>
							</label>
						</fieldset>
					</div>
				</div>
			</div>
			<div className='modal__footer justify-between'>
				<div>
					<Button
						type='submit'
						name='add'
						color='full'
						disabled={loading}
						loading={loading}
					>
						{service ? 'Update' : 'Add'}
					</Button>
					<Button
						type='button'
						name='cancel'
						onClick={() => modal.close()}
						disabled={loading}
					>
						Close
					</Button>
				</div>
				{service && (
					<Button
						type='button'
						name='remove'
						color='full'
						variant='danger'
						onClick={() => deleteService()}
					>
						Delete
					</Button>
				)}
			</div>
		</form>
	)
}

export default ModalServiceConfig
