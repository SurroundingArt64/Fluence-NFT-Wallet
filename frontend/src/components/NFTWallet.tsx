import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { MORALIS_API_KEY } from '../config'

export const NFTWallet: React.FC<{
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
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
		<div>
			<h1>NFT Wallet</h1>
			<p>My NFTs</p>
			{NFTs.map((elem, idx) => (
				<NFTComponent idx={idx} elem={elem} />
			))}
		</div>
	)
}
function NFTComponent({
	idx,
	elem,
}: {
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
	return (
		<div key={idx} className=''>
			<img src={tokenURI} alt={elem.name} />
			<p className='name'>{elem.name}</p>
			<p className='symbol'>{elem.symbol}</p>
		</div>
	)
}
