import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import { Fluence } from '@fluencelabs/fluence'
import {
	getRelayTime,
	get_private_key_data,
	registerHelloWorld,
	sayHello,
	store_private_key_data,
	tellFortune,
} from './_aqua/main'

function App() {
	useEffect(() => {
		const run = async () => {
			const localNode = {
				multiaddr: '/ip4/127.0.0.1/tcp/9999/ws/p2p/12D3KooWSGWcLm3WkLpMM3ERvEBZyg6X12AobDThK5JCaxE8ARPw',
				peerId: '12D3KooWSGWcLm3WkLpMM3ERvEBZyg6X12AobDThK5JCaxE8ARPw',
			}
			console.log({ krasnodar: krasnodar[0], localNode })
			await Fluence.start({ connectTo: krasnodar[0] })

			const relayTime = await getRelayTime()

			console.log('The relay time is: ', new Date(relayTime).toLocaleString())

			registerHelloWorld({
				hello: (str) => {
					console.log(str)
				},
				getFortune: async () => {
					await new Promise((resolve) => {
						setTimeout(resolve, 1000)
					})
					return 'Wealth awaits you very soon.'
				},
			})
			await sayHello()
			await tellFortune()
			const publicKey = '0xC399B74B33730189E2C931716BF5A1fB3e0e0e28'
			const privateKey = '0x31e23ea86193f0eb1d6563b4e39b7494e1fec93f88034504ea6468f5e2d93339'
			const password = 'password'

			// await test_connection('users20')
			const data = await store_private_key_data('users20', publicKey, privateKey, password)
			console.log(await get_private_key_data('users20', publicKey, password))
			console.log(data === true)
			await Fluence.stop()
		}
		run()
	}, [])
	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
