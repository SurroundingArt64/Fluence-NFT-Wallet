import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { ERC721ABI, MORALIS_API_KEY } from '../config'

export const NFTWallet: React.FC<{
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
		explorer: string
	}
}> = ({ signer, network }) => {
	const [NFTs, setNFTs] = useState<
		{
			token_address: string
			token_id: string
			owner_of: string
			block_number: string
			amount: string
			contract_type: string
			name: string
			symbol: string
			token_uri: string
			metadata: string | null
		}[]
	>([])

	useEffect(() => {
		if (network && signer) {
			const run = async () => {
				try {
					const resp = await axios.get<{
						result: typeof NFTs
					}>(
						`https://deep-index.moralis.io/api/v2/${signer.address}/nft?chain=${network.moralisIdx}&format=decimal`,
						{
							headers: {
								'X-API-Key': MORALIS_API_KEY,
							},
						}
					)
					setNFTs(resp.data.result)
				} catch (err) {
					console.error(err)
				}
				console.log(signer.address, network.chainId)
			}
			run()
		}
	}, [network, signer])
	return (
		<>
			<h1>NFT Wallet</h1>
			<div className='nft'>
				{NFTs.map((elem, idx) => (
					<NFTComponent signer={signer} network={network} idx={idx} elem={elem} />
				))}
			</div>
		</>
	)
}
function NFTComponent({
	signer,
	idx,
	elem,
	network: { explorer, chainId },
}: {
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
		explorer: string
	}
	idx: number
	elem: {
		token_address: string
		token_id: string
		owner_of: string
		block_number: string
		amount: string
		contract_type: string
		name: string
		symbol: string
		token_uri: string
		metadata: string | null
	}
}): JSX.Element {
	const [tokenURI, setTokenURI] = useState('')
	const [transferToAddress, setTransferTo] = useState('')
	const [tx, setTx] = useState()
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
	const [transfer, setTransfer] = useState(false)

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
		<div key={idx} className='nft-card'>
			<img src={tokenURI} alt="" />
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
				<div className="item">
					<h5>Transfer to Address</h5>
					<p onClick={() => {
						setTransfer(!transfer)
					}}
						style={{ cursor: 'pointer' }}
					>
						↘
					</p>
				</div>
				{tx && (
					<>
						<div className="item">
							<h5>View Transaction</h5>
							<p>
								<a href={explorer + 'tx/' + tx} target='_blank' rel='noopener noreferrer'>
									↗
								</a>
							</p>
						</div>
					</>
				)}
				{
					transfer &&
					(<form
						onClick={(e) => {
							e.preventDefault()
							if (transferToAddress) transferTo(transferToAddress)
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
							style={
								{
									minWidth: "225px",
									margin: "10px 0",
								}
							}
						/>
						<button type='submit'>Transfer NFT</button>
					</form>)
				}
			</div>
		</div>
	)
}
