import {ChangeEvent, FC, useCallback, useContext, useEffect, useState} from 'react'
import { FlagRow } from '../molecules/FlagRow'
import { GlobalContext } from '../context/GlobalContext'
import Tabs from '../atoms/Tabs'
import Button from '../atoms/Button'
import { Flag } from "../../model/Flag";
import {http} from "../../utils";
import ModalFlagConfig from "../molecules/modals/ModalFlagConfig";

interface FlagsFilter {
	type: 'ALL' | 'ENABLED' | 'DISABLED'
	value: string
}

const initialFilter: FlagsFilter = {
	type: 'ALL',
	value: '',
}

const FlagsList: FC<unknown> = () => {
	const { services, modal } = useContext(GlobalContext)

	const [selectedServiceId, setSelectedServiceId] = useState<string>()
	const [flags, setFlags] = useState<Flag[]>([])
	const [flagsFilter, setFlagsFilter] = useState<FlagsFilter>(initialFilter)

	const fetchFlags = useCallback(() => {
		http.get(`/services/${selectedServiceId}/flags`)
			.then(({ data }) => setFlags(data))
	}, [selectedServiceId])

	useEffect(() => {
		if (selectedServiceId) {
			fetchFlags()
		}
	}, [fetchFlags, selectedServiceId])

	useEffect(() => {
		if (services && services.length > 0) {
			setSelectedServiceId(services[0].id)
		}
	}, [services])


	function filterFlags(flag: Flag): boolean {
		const { key, value, description, enabled } = flag
		const { type, value: filterValue } = flagsFilter

		function filterWithValue(): boolean {
			if (filterValue.trim() === '') {
				return true
			}

			return [key, value, description].some((value) =>
				new RegExp(filterValue, 'gi').test(value || '')
			)
		}

		const filters = {
			ALL: true,
			DISABLED: !enabled,
			ENABLED: enabled,
		}

		return filters[type] && filterWithValue()
	}

	function isDefaultFilter(): boolean {
		return JSON.stringify(initialFilter) === JSON.stringify(flagsFilter)
	}

	return selectedServiceId && services ? (
		<>
				<Tabs
					value={selectedServiceId}
					choices={services.map(({ id: key, label }) => ({
						key,
						label,
					}))}
					onChange={setSelectedServiceId}
				/>
				<fieldset className='py-2 space-x-2 flex place-items-center'>
					<Button
						name='add'
						color='full'
						type='button'
						className='ml-0 mt-1 self-stretch'
						onClick={() => modal.set(<ModalFlagConfig fetchFlags={fetchFlags} selectedService={selectedServiceId} />)}
					>
						<svg
							className='w-6 h-6 mr-2'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						Add
					</Button>
					<Button
						type='reset'
						name='flag-filter-reset'
						className='ml-0 mt-1 self-stretch'
						color='full'
						disabled={isDefaultFilter()}
						onClick={() => setFlagsFilter(initialFilter)}
					>
						Reset
					</Button>
					<div>
						<label htmlFor='flag-filter-type' className='sr-only'>
							Service
						</label>
						<select
							id='flag-filter-type'
							name='flag-filter-type'
							className='form-select input'
							value={flagsFilter.type}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								// @ts-ignore
								setFlagsFilter((filter) => ({
									...filter,
									type: e.target.value,
								}))
							}
						>
							<option value='ALL'>All flags</option>
							<option value='ENABLED'>Flags Enabled</option>
							<option value='PARTIALLY_ENABLED'>Flags Partially enabled</option>
							<option value='DISABLED'>Flags Disabled</option>
						</select>
					</div>
					<label className='flex-1'>
						<span className='sr-only'>Filter</span>
						<input
							name='flag-filter'
							className='form-input input'
							type='text'
							placeholder='Filter flags by key, value, summary'
							required
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFlagsFilter((filter) => ({
									...filter,
									value: e.target.value,
								}))
							}
							value={flagsFilter.value}
						/>
					</label>
				</fieldset>
				<section className='row-wrapper'>
					{flags.length === 0 ? <p className='text-gray-400 py-4 px-6'>
						No flags set up for this service.
					</p> : flags
						.filter(filterFlags)
						.map((flag, index) => (
							<FlagRow key={index} flag={flag} fetchFlags={fetchFlags} />
						))}
				</section>
			</>
	) : (
		<p className='text-gray-400 mt-8'>You must add a service to add a flag.</p>
	)
}

export default FlagsList
