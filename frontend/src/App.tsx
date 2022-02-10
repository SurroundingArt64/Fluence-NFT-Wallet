import { ethers, Wallet, providers } from 'ethers'
import { Network, OpenSeaPort } from 'opensea-js'
import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import { CreateAccount } from './components/CreateAccount'
import Login from './components/Login'
import { NFTWallet } from './components/NFTWallet'
import HDWalletProvider from '@truffle/hdwallet-provider'
import ImportAccount from './components/ImportAccount'
;(window as any).HDWallet = HDWalletProvider
//

const getHdWallet = (privateKey: string, url: string) => {
	return new HDWalletProvider({
		privateKeys: [privateKey],
		providerOrUrl: url,
	})
}
let _privKey: string

function App() {
	const [currentState, updateCurrentState] = useState<'CREATE' | 'IMPORT' | 'LOGIN' | 'CONNECTED'>()
	const networks: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
		token: string
		explorer: string
	}[] = [
		{
			name: 'Rinkeby',
			chainId: 4,
			rpcURL: `https://rinkeby.infura.io/v3/87a23938d0094e42b8856a49b25b4821`,
			moralisIdx: 'rinkeby',
			token: 'rETH',
			explorer: 'https://rinkeby.etherscan.io/',
		},
		{
			name: 'Ethereum',
			chainId: 1,
			rpcURL: `https://mainnet.infura.io/v3/87a23938d0094e42b8856a49b25b4821`,
			moralisIdx: 'eth',
			token: 'ETH',
			explorer: 'https://etherscan.io/',
		},
		{
			name: 'Polygon',
			chainId: 137,
			rpcURL: `https://speedy-nodes-nyc.moralis.io/4df3cf69e6c903f093201c6f/polygon/mainnet`,
			moralisIdx: 'polygon',
			token: 'MATIC',
			explorer: 'https://polygonscan.com/',
		},
		{
			name: 'Mumbai',
			chainId: 80001,
			rpcURL: `https://speedy-nodes-nyc.moralis.io/4df3cf69e6c903f093201c6f/polygon/mumbai`,
			moralisIdx: 'mumbai',
			token: 'tMATIC',
			explorer: 'https://mumbai.polygonscan.com/',
		},
	]

	const [network, setNetwork] = useState(networks[0])
	const [copy, setCopy] = useState(false)
	const [state, setState] = useState({ address: '', balance: '' })
	const [ethersConnected, setEthersConnected] = useState(0)

	let signer = useRef<ethers.Wallet | undefined>()
	let seaport = useRef<OpenSeaPort | undefined>()
	const initEthers = async (privKey: string) => {
		_privKey = privKey.trim()
		signer.current = new Wallet(privKey)
		let address = await signer.current.getAddress()
		if (signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			signer.current = signer.current.connect(provider)
			let balance = await signer.current.getBalance()
			setState((state) => ({ ...state, address, balance: ethers.utils.formatEther(balance) }))
			setEthersConnected((s) => s + 1)

			const hdWallet = getHdWallet(privKey, network.rpcURL)
			seaport.current = new OpenSeaPort(hdWallet, {
				networkName: Network.Rinkeby,
			})
			;(window as any).seaport = seaport.current
		}
	}

	const updateBalance = async (signer: ethers.Signer) => {
		let balance = await signer.getBalance()
		let address = await signer.getAddress()
		setState((state) => ({ ...state, address, balance: ethers.utils.formatEther(balance) }))
		setEthersConnected((s) => s + 1)
	}

	useEffect(() => {
		let interval: any
		if (network && currentState === 'CONNECTED' && signer) {
			let provider = new providers.JsonRpcProvider(network.rpcURL)
			const run = async () => {
				if (signer.current) {
					signer.current = signer.current.connect(provider)
					const hdWallet = getHdWallet(_privKey, network.rpcURL)
					seaport.current = new OpenSeaPort(hdWallet, {
						networkName: network.chainId === 1 ? Network.Main : Network.Rinkeby,
						apiKey: '',
					})

					if (interval) clearInterval(interval)

					interval = setInterval(() => {
						if (signer.current) updateBalance(signer.current)
					}, 5_000)

					let balance = await signer.current.getBalance()
					let address = await signer.current.getAddress()
					setState((state) => ({ ...state, address, balance: ethers.utils.formatEther(balance) }))
					setEthersConnected((s) => s + 1)
				}
			}
			run()
		}
		return () => {
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				{currentState && <div style={{ height: '25px' }} />}
				{!currentState && (
					<>
						<h2>
							Welcome to <span>OpenOcean!</span>
						</h2>
						{StateData.map((elem) => {
							return (
								<div className='' key={elem.text}>
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
				{currentState === 'IMPORT' && <ImportAccount setConnected={setConnected} />}
				{currentState === 'CONNECTED' && (
					<>
						<div className='Connected'>
							<h1>Settings</h1>
							<div className='network'>
								<div
									className='address'
									onDoubleClick={() => {
										navigator.clipboard.writeText(state.address)
										setCopy(true)
										// timeout for 2 seconds
										setTimeout(() => {
											setCopy(false)
										}, 2000)
									}}
								>
									{state.address.length > 0
										? state.address.substring(0, 6) + '****' + state.address.substring(38, 42)
										: 'Loading Account...'}{' '}
									{copy && <span className='copy'>📝</span>}
								</div>
								<div className='balance'>
									{state.balance} {state.balance ? network.token : '⚠️'}
								</div>
							</div>
							<h2 className='network'>
								<div>Choose Network</div>
								<button className='dropdown'>
									<select
										onChange={(e) =>
											setNetwork(networks.filter((s) => s.name === e.target.value)[0])
										}
									>
										{networks.map((elem) => {
											return (
												<option
													style={{ cursor: 'pointer' }}
													value={elem.name}
													key={elem.chainId}
												>
													{`${elem.name}(${elem.chainId})`}
												</option>
											)
										})}
									</select>
								</button>
							</h2>
							{ethersConnected > 0 && signer.current && (
								<NFTWallet seaport={seaport.current} network={network} signer={signer.current} />
							)}{' '}
						</div>
					</>
				)}
				<div className='nav'>
					{currentState && (
						<button
							onClick={() => {
								updateCurrentState(undefined)
							}}
							style={{
								position: 'absolute',
								top: '10px',
								right: '10px',
							}}
						>
							Back
						</button>
					)}
					{currentState && (
						<h2
							style={{
								position: 'absolute',
								top: '-5px',
								left: '25px',
								textTransform: 'uppercase',
								fontSize: '2rem',
							}}
						>
							OpenOcean
						</h2>
					)}
				</div>
			</header>
		</div>
	)
}

export default App
