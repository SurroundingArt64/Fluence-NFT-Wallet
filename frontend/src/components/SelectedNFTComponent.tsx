import axios from 'axios'
import { ethers } from 'ethers'
import { OpenSeaPort } from 'opensea-js'
import React, { useEffect, useState } from 'react'
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

	const [openSeaData, setOpenSeaData] = useState<{
		collection: { name?: string; stats: { floor_price: number } }
		sellOrders: { basePrice: ethers.BigNumberish; currentPrice: ethers.BigNumberish }[]
	}>()
	useEffect(() => {
		const run = async () => {
			console.log(elem)
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
				console.log({ data: resp })
			}
		}
		run()
	}, [seaport, elem])

	async function transferTo(address: string) {
		const tx = await new ethers.Contract(elem.token_address, ERC721ABI)
			.connect(signer)
			.transferFrom(signer.address, address, elem.token_id)
		console.log({ tx })
		setTx(tx.hash)
		const receipt = await tx.wait()
		console.log({ receipt })
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
				<form
					onClick={(e) => {
						e.preventDefault()
						if (transferToAddress) transferTo(transferToAddress)
					}}
					style={{
						border: '2px solid #ccc',
						borderRadius: '10px',
						padding: '10px',
						display: 'flex',
						alignItems: 'flex-start',
					}}
				>
					<label
						style={{
							fontSize: '1.2rem',
						}}
					>
						Transfer ↗
					</label>
					<div
						style={{
							padding: 0,
							width: '235px',
							margin: '10px 0 0 0',
						}}
					>
						<input
							type='text'
							value={transferToAddress}
							onChange={(e) => {
								setTransferTo(e.target.value)
							}}
							id=''
							placeholder='0x0000****0000'
							style={{
								minWidth: '100px',
								width: '175px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						/>
						<button type='submit'>Transfer NFT</button>
					</div>
				</form>
			</div>
		</div>
	)
}
