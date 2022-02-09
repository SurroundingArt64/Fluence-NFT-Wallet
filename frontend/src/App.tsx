import { ethers, Wallet, providers } from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import { CreateAccount } from './components/CreateAccount'
import Login from './components/Login'
import { NFTWallet } from './components/NFTWallet'

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
		{
			name: 'Polygon',
			chainId: 137,
			rpcURL: `https://speedy-nodes-nyc.moralis.io/4df3cf69e6c903f093201c6f/polygon/mainnet`,
		},
		{
			name: 'Mumbai',
			chainId: 80001,
			rpcURL: `https://speedy-nodes-nyc.moralis.io/4df3cf69e6c903f093201c6f/polygon/mumbai`,
		},
	]

	const [network, setNetwork] = useState(networks[0])

	const [state, setState] = useState({ address: '', balance: '' })
	const [ethersConnected, setEthersConnected] = useState(0)
	let signer = useRef<ethers.Signer | undefined>()
	const initEthers = async (privKey: string) => {
		signer.current = new Wallet(privKey)
		let address = await signer.current.getAddress()
		if (signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			signer.current = signer.current.connect(provider)
			let balance = await signer.current.getBalance()
			setState((state) => ({ ...state, address, balance: ethers.utils.formatEther(balance) }))
			setEthersConnected((s) => s + 1)
		}
	}

	useEffect(() => {
		if (network && currentState === 'CONNECTED' && signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			const run = async () => {
				if (signer.current) {
					signer.current = signer.current.connect(provider)
					setEthersConnected((s) => s + 1)
					let balance = await signer.current.getBalance()
					let address = await signer.current.getAddress()

					setState((state) => ({ ...state, address, balance: ethers.utils.formatEther(balance) }))
				}
			}
			run()
		}
	}, [network, currentState])

	const setConnected = (privKey: string) => {
		updateCurrentState('CONNECTED')
		initEthers(privKey)
	}

	const StateData: { text: string; value: typeof currentState }[] = [
		{ text: 'Login into account', value: 'LOGIN' },
		{ text: 'Create an account', value: 'CREATE' },
		{ text: 'Import an account', value: 'IMPORT' },
	]

	return (
		<div className='App'>
			<header className='App-header'>
				{!currentState && (
					<>
						<h2>
							Welcome to <span>OpenOcean!</span>
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
					</>
				)}
				{currentState === 'CREATE' && <CreateAccount setConnected={setConnected} />}
				{currentState === 'LOGIN' && <Login setConnected={setConnected} />}
				{currentState === 'CONNECTED' && (
					<>
						<div className='Connected'>
							<h1>
								Settings
							</h1>
							<div className='network'>
								<div className='address'>{state.address.length > 0 ? state.address.substring(0, 6) + "****" + state.address.substring(38, 42) : "Loading Account..."}</div>
								<div className='balance'>{state.balance} ETH</div>
							</div>
							<h2 className='network'>
								<div>
									Switch Network
								</div>
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
							</h2>
							{ethersConnected > 0 && signer.current && <NFTWallet signer={signer.current} />}{' '}
						</div>
					</>
				)}
				{currentState && (
					<button
						onClick={() => {
							updateCurrentState(undefined)
						}}
						style={
							{
								position: 'absolute',
								top: '10px',
								right: '10px',
							}
						}
					>
						Back
					</button>
				)}
			</header>
		</div>
	)
}

export default App
