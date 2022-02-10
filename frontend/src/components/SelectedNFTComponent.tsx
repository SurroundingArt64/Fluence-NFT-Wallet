import axios from 'axios'
import { ethers } from 'ethers'
import { OpenSeaPort } from 'opensea-js'
import { EventType, Order } from 'opensea-js/lib/types'
import React, { useCallback, useEffect, useState } from 'react'
import { ERC721ABI } from '../config'
import { NFTItemProps } from './NFTWallet'

export function SelectedNFTComponent({
	signer,
	elem,
	network: { explorer, chainId },
	seaport,
}: {
	seaport?: OpenSeaPort
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
		explorer: string
	}
	elem: NFTItemProps
}): JSX.Element {
	const [tokenURI, setTokenURI] = useState('')
	const [transferToAddress, setTransferTo] = useState('')
	const [tx, setTx] = useState()
	const [sellOrder, setSellOrder] = useState<{
		startAmount?: number
		expirationTime?: string
	}>()

	const [transferText, setTransferText] = useState('Transfer')
	const [submitText, setSubmitText] = useState('Submit Bid')
	const [openSeaData, setOpenSeaData] = useState<{
		collection: { name?: string; stats?: { floor_price?: number } }
		orders: Order[]
	}>()

	const cancelOrder = async (order: Order) => {
		seaport?.cancelOrder({ order, accountAddress: signer.address })
	}

	const createOrder = async (startAmount: number, expirationTime: number) => {
		await seaport?.createSellOrder({
			asset: {
				tokenAddress: elem.token_address,
				tokenId: elem.token_id,
			},
			accountAddress: signer.address,
			startAmount: startAmount,
			expirationTime: Math.floor(expirationTime / 1000),
			endAmount: 0.1,
		})
	}

	useEffect(() => {
		const run = async () => {
			if (elem.token_uri) {
				const resp = await axios.get<{ image: string; attributes: any[] }>(elem.token_uri)
				if (resp.data.image.startsWith('ipfs://')) {
					setTokenURI('https://ipfs.moralis.io:2053/ipfs/' + resp.data.image.split('ipfs://')[1])
				} else {
					setTokenURI(resp.data.image)
				}
			}
		}
		run()
	}, [elem])
	const getOpenSeaURL = () => {
		let baseURL
		switch (chainId) {
			case 1:
				baseURL = 'https://opensea.io/assets/'
				break
			case 4:
				baseURL = 'https://testnets.opensea.io/assets/'
				break
			case 137:
				baseURL = 'https://opensea.io/assets/polygon/'
				break
			case 80001:
				baseURL = 'https://testnets.opensea.io/assets/mumbai/'
				break
			default:
				break
		}
		return baseURL + elem.token_address + '/' + elem.token_id
	}

	useEffect(() => {
		const run = async () => {
			if (seaport && elem) {
				const resp = await seaport.api.getAsset({ tokenAddress: elem.token_address, tokenId: elem.token_id })
				console.log({ resp })
				setOpenSeaData(resp as any)
			}
		}
		run()
	}, [seaport, elem])

	const handleSeaportEvents = useCallback(() => {
		if (seaport) {
			seaport.addListener(EventType.TransactionCreated, ({ transactionHash, event }) => {
				console.log({ transactionHash, event })
			})
			seaport.addListener(EventType.TransactionConfirmed, ({ transactionHash, event }) => {
				console.log({ transactionHash, event })
				// Only reset your exchange UI if we're finishing an order fulfillment or cancellation
				if (event === EventType.MatchOrders || event === EventType.CancelOrder) {
				}
			})
			seaport.addListener(EventType.TransactionDenied, ({ transactionHash, event }) => {
				console.log({ transactionHash, event })
			})
			seaport.addListener(EventType.TransactionFailed, ({ transactionHash, event }) => {
				console.log({ transactionHash, event })
			})
			seaport.addListener(EventType.InitializeAccount, ({ accountAddress }) => {
				console.log({ accountAddress })
			})
			seaport.addListener(EventType.WrapEth, ({ accountAddress, amount }) => {
				console.log({ accountAddress, amount })
			})
			seaport.addListener(EventType.UnwrapWeth, ({ accountAddress, amount }) => {
				console.log({ accountAddress, amount })
			})
			seaport.addListener(EventType.ApproveCurrency, ({ accountAddress }) => {
				console.log({ accountAddress })
			})
			seaport.addListener(EventType.ApproveAllAssets, ({ accountAddress, proxyAddress }) => {
				console.log({ accountAddress, proxyAddress })
			})
			seaport.addListener(EventType.ApproveAsset, ({ accountAddress, proxyAddress }) => {
				console.log({ accountAddress, proxyAddress })
			})
			seaport.addListener(EventType.CreateOrder, ({ order, accountAddress }) => {
				console.log({ order, accountAddress })
			})
			seaport.addListener(EventType.OrderDenied, ({ order, accountAddress }) => {
				console.log({ order, accountAddress })
			})
			seaport.addListener(EventType.MatchOrders, ({ buy, sell, accountAddress }) => {
				console.log({ buy, sell, accountAddress })
			})
			seaport.addListener(EventType.CancelOrder, ({ order, accountAddress }) => {
				console.log({ order, accountAddress })
			})
		}
	}, [seaport])

	useEffect(() => {
		if (seaport) {
			handleSeaportEvents()
		}
		return () => {
			seaport!.removeAllListeners()
		}
	}, [seaport, handleSeaportEvents])

	async function transferTo(address: string) {
		const tx = await new ethers.Contract(elem.token_address, ERC721ABI)
			.connect(signer)
			.transferFrom(signer.address, address, elem.token_id)
		setTransferText('Transferring')
		console.log({ tx })
		setTx(tx.hash)
		const receipt = await tx.wait()
		console.log({ receipt })
		setTransferText('Transferred')
		const anchor = document.createElement('a')
		anchor.target = '_blank'
		anchor.href = getOpenSeaURL()
		document.body.appendChild(anchor)
		anchor.click()
	}

	return (
		<div className='nft-select'>
			<div className='nft-card-selected'>
				<img src={tokenURI} alt='' />
				<div className='container'>
					<div className='headers'>
						<div className='item'>
							<h5>NFT Name</h5>
							<p>{elem.name}</p>
						</div>
						<div className='item'>
							<h5>TOKEN ID</h5>
							<p>{elem.symbol}</p>
						</div>
						{openSeaData && (
							<div className='item'>
								<h5>Collection</h5>
								<p>{openSeaData.collection.name}</p>
							</div>
						)}
						<div className='item'>
							<h5>Visit Explorer</h5>
							<p>
								<a
									href={explorer + 'token/' + elem.token_address + `?a=${elem.token_id}#inventory`}
									target='_blank'
									rel='noopener noreferrer'
								>
									↗
								</a>
							</p>
						</div>
						<div className='item'>
							<h5>Visit Opensea</h5>
							<p>
								<a href={getOpenSeaURL()} target='_blank' rel='noopener noreferrer'>
									↗
								</a>
							</p>
						</div>
						{tx && (
							<>
								<div className='item'>
									<h5>View Transaction</h5>
									<p>
										<a href={explorer + 'tx/' + tx} target='_blank' rel='noopener noreferrer'>
											↗
										</a>
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className='options'>
				{openSeaData && (
					<>
						{openSeaData.orders.length > 0 && (
							<div className='form'>
								<label>Orders:</label>
								{openSeaData.orders.map((elem) => {
									if (elem.basePrice && elem.currentPrice)
										return (
											<div
												style={{
													width: '97%',
													margin: '0 0 0 10px',
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'flex-start',
													justifyContent: 'center',
													position: 'relative',
												}}
											>
												<div className='item' style={{ height: '40px' }}>
													<p>Base Price:</p>
													<p>
														<a
															href={explorer + 'tx/' + tx}
															target='_blank'
															rel='noopener noreferrer'
														>
															{ethers.utils
																.formatEther(elem.basePrice.toString())
																.toString()}
														</a>
													</p>
												</div>
												<div className='item' style={{ height: '40px' }}>
													<p>Current Price:</p>
													<p>
														<a
															href={explorer + 'tx/' + tx}
															target='_blank'
															rel='noopener noreferrer'
														>
															{ethers.utils
																.formatEther(elem.currentPrice.toString())
																.toString()}
														</a>
													</p>
												</div>
												<button
													onClick={() => {
														cancelOrder(elem)
														let orders: Order[] = []
														setOpenSeaData({ ...openSeaData, orders })
													}}
													style={{ transform: 'translateX(450px)' }}
												>
													CANCEL
												</button>
											</div>
										)
									return <></>
								})}
							</div>
						)}
						{openSeaData.orders.length === 0 && (
							<>
								<form
									onSubmit={async (e) => {
										e.preventDefault()
										setSubmitText('Submitting')
										if (sellOrder?.expirationTime && sellOrder.startAmount) {
											await createOrder(
												sellOrder.startAmount,
												new Date(sellOrder.expirationTime).getTime()
											)
										}
										setSubmitText('Submitted')
									}}
									className='form'
								>
									<label style={{ fontSize: '1.2rem', fontWeight: '400' }}>Place Bid</label>
									<label htmlFor='bid'>Set Bid Amount</label>
									<input
										type='number'
										name='bid'
										placeholder='0.00000000'
										onChange={(e) => {
											setSellOrder({ ...sellOrder, startAmount: parseFloat(e.target.value) })
										}}
										value={sellOrder?.startAmount}
										id=''
									/>
									<label htmlFor='time'>Bid End Time</label>
									<div className='item'>
										<input
											type='datetime-local'
											name='time'
											placeholder='Expiration'
											onChange={(e) => {
												console.log(e.target.value)
												setSellOrder({ ...sellOrder, expirationTime: e.target.value })
											}}
											value={sellOrder?.expirationTime}
											id=''
										/>
										<button type='submit' style={{ width: '170px' }}>
											{submitText}
										</button>
									</div>
								</form>
							</>
						)}
					</>
				)}
				<form
					onClick={(e) => {
						e.preventDefault()
						if (transferToAddress) transferTo(transferToAddress)
					}}
					className='form'
				>
					<label>Transfer ↗</label>
					<div>
						<input
							type='text'
							value={transferToAddress}
							onChange={(e) => {
								setTransferTo(e.target.value)
							}}
							id=''
							placeholder='0x0000****0000'
						/>
						<button type='submit'>{transferText}</button>
					</div>
				</form>
			</div>
		</div>
	)
}
