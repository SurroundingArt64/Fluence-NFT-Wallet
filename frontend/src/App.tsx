import ethers, { Wallet, providers } from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import { CreateAccount } from './components/CreateAccount'
import Login from './components/Login'

function App() {
	const [currentState, updateCurrentState] = useState<'CREATE' | 'IMPORT' | 'LOGIN' | 'CONNECTED'>()
	const networks = [
		{
			name: 'Ethereum',
			chainId: 1,
			rpcURL: `https://mainnet.infura.io/v3/87a23938d0094e42b8856a49b25b4821`,
		},
		{
			name: 'Rinkeby',
			chainId: 4,
			rpcURL: `https://rinkeby.infura.io/v3/87a23938d0094e42b8856a49b25b4821`,
		},
	]

	const [network, setNetwork] = useState(networks[0])

	const [state, setState] = useState({ address: '' })

	let signer = useRef<ethers.Signer | undefined>()
	const initEthers = async (privKey: string) => {
		signer.current = new Wallet(privKey)
		let address = await signer.current.getAddress()
		if (signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			signer.current = signer.current.connect(provider)
			setState((state) => ({ ...state, address }))
		}
	}

	useEffect(() => {
		if (network && currentState === 'CONNECTED' && signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			if (signer.current) {
				signer.current = signer.current.connect(provider)
			}
		}
	}, [network, currentState])

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
				<span>Welcome to OpenOcean!</span>
				{currentState !== 'CONNECTED' &&
					StateData.map((elem) => {
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
				{currentState === 'LOGIN' && <Login setConnected={setConnected} />}

				{currentState === 'CONNECTED' && (
					<>
						<div className=''>
							<p>Connected to {network.name}</p>
							<p>Address: {state.address}</p>
							Switch Network
							{networks.map((elem) => {
								return (
									<>
										<div
											style={{ cursor: 'pointer' }}
											onClick={() => setNetwork(elem)}
											className=''
										>{`${elem.name}(${elem.chainId})`}</div>
									</>
								)
							})}
						</div>
					</>
				)}
			</header>
		</div>
	)
}

export default App
