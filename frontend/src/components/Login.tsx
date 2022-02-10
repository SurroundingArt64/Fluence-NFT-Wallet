import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import React from 'react'
import { DB_NAME } from '../config'
import { get_private_key_data } from '../_aqua/main'

const Login: React.FC<{ setConnected: (privKey: string) => void }> = ({ setConnected }) => {
	const [addr, setAddr] = React.useState('')
	const [password, setPassword] = React.useState('')

	const handleLogin = React.useCallback(async (e) => {
		e.preventDefault()
		await Fluence.start({ connectTo: krasnodar[0] })
		const res = await get_private_key_data(DB_NAME, addr, password)
		setConnected(res)
		await Fluence.stop()
	}, [addr, password, setConnected])

	return (
		<>
			<h2>LOGIN</h2>
			<p>Enter your address and password</p>
			<form onSubmit={handleLogin}>
				<div className='Form'>
					<label htmlFor='addr'>Address</label>
					<input
						type='username'
						placeholder='0x0000....0000'
						onChange={(e) => {
							setAddr(e.target.value)
						}}
						value={addr}
						required
					/>
				</div>
				<div className='Form'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						security='true'
						placeholder='********'
						onChange={(e) => {
							setPassword(e.target.value)
						}}
						value={password}
						required
					/>
				</div>
				<span style={{ height: "25px" }} />
				<button type='submit'>LOGIN</button>
			</form>
		</>
	)
}

export default Login
