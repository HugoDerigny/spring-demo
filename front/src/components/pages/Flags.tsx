import { FC, useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Button from '../atoms/Button'
import FlagsList from '../organisms/FlagsList'
import ModalFlagConfig from '../molecules/modals/ModalFlagConfig'

const Flags: FC<any> = () => {
	const { modal, services } = useContext(GlobalContext)

	return (
		<>
			<header className='pb-4'>
				<h1 className='title'>Flags</h1>
			</header>
			<FlagsList />
		</>
	)
}

export default Flags
