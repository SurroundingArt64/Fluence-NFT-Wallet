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
	test_connection,
} from './_aqua/main'

function App() {
	useEffect(() => {
		const run = async () => {
			const localNode = {
				multiaddr: '/ip4/127.0.0.1/tcp/9999/ws/p2p/12D3KooWLh9CrUcpjrtG3cANn1Uuo4y55q2oL4hYPqj2jDGxNn1c',
				peerId: '12D3KooWLh9CrUcpjrtG3cANn1Uuo4y55q2oL4hYPqj2jDGxNn1c',
			}
			console.log({ krasnodar: krasnodar[0], localNode })
			await Fluence.start({ connectTo: localNode })

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
			// console.log(await test_connection(), 'Connected')
			// console.log(await test_connection(), 'Already connected')
			console.log(await get_private_key_data('12', '3'))
			const data = await store_private_key_data('12', '2', '3')
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
