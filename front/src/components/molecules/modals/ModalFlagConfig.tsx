import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import { FC, FormEvent, useContext, useReducer, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { http } from '../../../utils'
import {Flag} from "../../../model/Flag";

type Props = {
	flag?: Flag
	fetchFlags?: Function
	selectedService?: string
}

type ReducerType = {
	serviceId: string
	key: string
	description?: string
	value?: string
	enabled: boolean
}

type ReducerAction = {
	key: string
	value: string | boolean
}

const ModalFlagConfig: FC<Props> = ({ flag, fetchFlags, selectedService }) => {
	const { modal, services } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)
	const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false)

	const [state, dispatch] = useReducer(_reducer, {
		key: flag?.key ?? '',
		description: flag?.description ?? '',
		value: flag?.value ?? '',
		serviceId: selectedService ?? flag?.serviceId ?? services![0].id,
		enabled: flag?.enabled ?? false,
	})

	function _reducer(state: ReducerType, action: ReducerAction): ReducerType {
		const { key, value } = action

		function formatValue() {
			if (key === 'key') {
				// kebab-casing the key
				return (value as string)
					.replace(/\s+/g, '-')
					.replace(/[^a-z-]/, '')
					.toLowerCase()
			}

			return value
		}

		return { ...state, [key]: formatValue() }
	}

	function handleSubmit(event: FormEvent): void {
		event.preventDefault()

		setLoading(true)

		flag ? updateFlag() : createFlag()
	}

	function createFlag(): void {
		http.post('/flags', state)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch((err) => {
				console.log(err)
				setLoading(false)
			})
	}

	function updateFlag(): void {
		http.put('/flags/' + flag!.id, state)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	function deleteFlag(): void {
		http.delete(process.env.REACT_APP_API_URL + '/flags/' + flag!.id)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{flag ? `Update flag ${flag.key}` : 'Add a flag'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-primary-600 font-semibold'>
								1. Important fields
							</legend>
							<label htmlFor='group'>Service</label>
							<select
								id='serviceId'
								name='serviceId'
								className='form-select input'
								value={state.serviceId}
							>
								{services!.map(({ label, id }) => (
									<option value={id} key={id}>
										{label}
									</option>
								))}
							</select>
							<label>
								Key
								<input
									name='flag-key'
									className='form-input input'
									type='text'
									placeholder='announcement'
									required
									onChange={(e) =>
										dispatch({ key: 'key', value: e.target.value })
									}
									value={state.key}
								/>
							</label>
							<label>
								Value displayed{' '}
								<span className='text-gray-600 italic text-sm'>(optional)</span>
								<input
									name='flag-value'
									className='form-input input'
									type='text'
									placeholder='Use the coupon OFF20 to get...'
									value={state.value}
									onChange={(e) =>
										dispatch({ key: 'value', value: e.target.value })
									}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-primary-600 font-semibold'>
								2. More options
							</legend>
							<label>
								Quick summary{' '}
								<span className='text-gray-600 italic text-sm'>(optional)</span>
								<input
									name='flag-description'
									className='form-input input'
									type='text'
									placeholder='Banner announcing a temporary coupon that customers can use before the end of the month.'
									value={state.description}
									onChange={(e) =>
										dispatch({ key: 'description', value: e.target.value })
									}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-primary-600 font-semibold'>3. Browser</legend>
							<label className='relative flex flex-col group text-base'>
								Enabled globally
								<input
									name='flag-enabled'
									className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
									type='checkbox'
									checked={state.enabled}
									onChange={(e) =>
										dispatch({ key: 'enabled', value: e.target.checked })
									}
								/>
								<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-green-600 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
							</label>
						</fieldset>
					</div>
				</div>
			</div>
			<footer className='modal__footer justify-between'>
				<div>
					<Button
						type='submit'
						name='add'
						color='full'
						disabled={loading}
						loading={loading}
					>
						{flag ? 'Update' : 'Add'}
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
				{flag &&
					(confirmDeletion ? (
						<Button
							type='button'
							name='remove-confirm'
							color='full'
							variant='danger'
							onClick={deleteFlag}
							loading={loading}
							disabled={loading}
						>
							Confirm deletion
						</Button>
					) : (
						<Button
							type='button'
							name='remove'
							color='full'
							variant='danger'
							onClick={() => setConfirmDeletion(true)}
							loading={loading}
							disabled={loading}
						>
							Delete ?
						</Button>
					))}
			</footer>
		</form>
	)
}

export default ModalFlagConfig
