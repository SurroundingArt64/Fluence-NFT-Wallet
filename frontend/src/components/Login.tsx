import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import React from 'react'
import { DB_NAME } from '../config'
import { get_private_key_data } from '../_aqua/main'

const Login: React.FC<{ setConnected: (privKey: string) => void }> = ({ setConnected }) => {
	const [addr, setAddr] = React.useState('')
	const [password, setPassword] = React.useState('')

	const handleLogin = async (addr: string, password: string) => {
		await Fluence.start({ connectTo: krasnodar[0] })
		const res = await get_private_key_data(DB_NAME, addr, password)
		setConnected(res)
		await Fluence.stop()
	}

	return (
		<>
			<h3>LOGIN</h3>
			<p>Enter your address and password</p>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					handleLogin(addr, password)
				}}
			>
				<div className=''>
					<input
						type='text'
						placeholder='Enter Address'
						onChange={(e) => {
							setAddr(e.target.value)
						}}
						value={addr}
					/>
				</div>
				<div className=''>
					<input
						type='password'
						placeholder='Enter Password'
						onChange={(e) => {
							setPassword(e.target.value)
						}}
						value={password}
					/>
				</div>
				<div className=''>
					<input type='submit' value='Submit' />
				</div>
			</form>
		</>
	)
}

export default Login
