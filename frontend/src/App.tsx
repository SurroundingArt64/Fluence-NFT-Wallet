import ethers, { Wallet, providers } from 'ethers'
import React, { useState } from 'react'
import './App.css'

import { CreateAccount } from './components/CreateAccount'
import Login from './components/Login'
import { BLOCK_API_KEY } from './config'

function App() {
	const [currentState, updateCurrentState] = useState<'CREATE' | 'IMPORT' | 'LOGIN' | 'CONNECTED'>()
	const networks = [
		{
			name: 'Rinkeby',
			chainId: 4,
			rpcURL: `https://eth.getblock.io/rinkeby/?api_key=${BLOCK_API_KEY}`,
		},
	]

	let signer: ethers.Signer | undefined
	const initEthers = async (privKey: string) => {
		signer = new Wallet(privKey)
		if (signer) {
			let provider = new providers.JsonRpcProvider(networks[0].rpcURL)
			signer.connect(provider)
			console.log(await signer.getBalance())
		}
	}

	const setConnected = (privKey: string) => {
		updateCurrentState('CONNECTED')
		initEthers(privKey)
	}

	const StateData: { text: string; value: typeof currentState }[] = [
		{ text: 'Create an account', value: 'CREATE' },
		{ text: 'Import an account', value: 'IMPORT' },
		{ text: 'Login into account', value: 'LOGIN' },
	]

	return (
		<div className='App'>
			<header className='App-header'>
				<h2>
					Welcome to OpenOcean!
				</h2>
				{StateData.map((elem) => {
					return (
						<div className=''>
							<button
								onClick={() => {
									updateCurrentState(elem.value)
								}}
							>
								{elem.text}
							</button>
						</div>
					)
				})}
				{currentState === 'CREATE' && <CreateAccount setConnected={setConnected} />}
				{currentState === 'LOGIN' && <Login />}
			</header>
		</div>
	)
}

export default App
