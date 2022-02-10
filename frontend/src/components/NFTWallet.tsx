import axios from 'axios'
import { ethers } from 'ethers'
import { OpenSeaPort } from 'opensea-js'
import React, { useEffect, useState } from 'react'
import { MORALIS_API_KEY } from '../config'
import { NFTComponent } from './NFTComponent'
import { SelectedNFTComponent } from './SelectedNFTComponent'

export interface NFTItemProps {
	token_address: string
	token_id: string
	owner_of: string
	block_number: string
	amount: string
	contract_type: string
	name: string
	symbol: string
	token_uri: string
	metadata?: string
}

export const NFTWallet: React.FC<{
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
		moralisIdx: string
		explorer: string
	}
	seaport?: OpenSeaPort
}> = ({ signer, network, seaport }) => {
	const [NFTs, setNFTs] = useState<NFTItemProps[]>([])
	const [selectedNFT, setSelectedNFT] = useState<NFTItemProps>()

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
			}
			run()
		}
	}, [network, signer])
	return (
		<>
			<h1>NFT Wallet</h1>
			{selectedNFT && <SelectedNFTComponent {...{ signer, network, seaport }} elem={selectedNFT} />}
			<div className='nft'>
				{NFTs.length > 0 ? NFTs.map((elem, idx) => (
					<div key={idx} onClick={() => setSelectedNFT(elem)}>
						<NFTComponent {...{ network, elem }} />
					</div>
				)) : (
					<h2 style={{
						height: 'calc(100vh - 60vh)',
					}}>
						No NFTs found, choose another network?
					</h2>
				)}
			</div>
		</>
	)
}

