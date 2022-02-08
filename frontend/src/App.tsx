import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import { Fluence } from '@fluencelabs/fluence'
import {
	getRelayTime,
	registerHelloWorld,
	registerPrivateKey,
	sayHello,
	store_private_key_data,
	tellFortune,
} from './_aqua/main'

function App() {
	useEffect(() => {
		const run = async () => {
			const localNode = {
				multiaddr: '/ip4/127.0.0.1/tcp/9999/ws/p2p/12D3KooWK688vxsyWwrYhikmyMjo4jaFZLKBRggihSoDKnGoN9ic',
				peerId: '12D3KooWK688vxsyWwrYhikmyMjo4jaFZLKBRggihSoDKnGoN9ic',
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
			const data = await store_private_key_data('a', 'b')
			console.log(data.toString() === 'true')
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
