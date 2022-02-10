import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import { ethers } from 'ethers'
import React from 'react'
import { DB_NAME } from '../config'
import { store_private_key_data } from '../_aqua/main'

const ImportAccount: React.FC<{ setConnected: (privKey: string) => void }> = ({ setConnected }) => {
	const [privKey, setPrivKey] = React.useState('')
	const [password, setPassword] = React.useState('')

	const handleImport = async (privKey: string, password: string) => {
		await Fluence.start({ connectTo: krasnodar[0] })
		const signer = new ethers.Wallet(privKey)
		await store_private_key_data(DB_NAME, signer.address, privKey, password)
		setConnected(privKey)
		await Fluence.stop()
	}

	return (
		<>
			<h2>IMPORT</h2>
			<p>Enter your private key and password</p>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleImport(privKey, password)
				}}
			>
				<div className='Form'>
					<label htmlFor='addr'>Private Key</label>
					<input
						type='password'
						placeholder='0x0000....0000'
						onChange={(e) => {
							setPrivKey(e.target.value)
						}}
						value={privKey}
						required
					/>
				</div>
				<div className='Form'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						placeholder='********'
						onChange={(e) => {
							setPassword(e.target.value)
						}}
						value={password}
						required
					/>
				</div>
				<span style={{ height: '25px' }} />
				<input type='submit' value='LOGIN' />
			</form>
		</>
	)
}

export default ImportAccount
