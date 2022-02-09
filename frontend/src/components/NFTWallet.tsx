import { ethers } from 'ethers'
import React, { useEffect } from 'react'

export const NFTWallet: React.FC<{
	signer: ethers.Wallet
	network: {
		name: string
		chainId: number
		rpcURL: string
	}
}> = ({ signer, network }) => {
	useEffect(() => {
		if (network && signer) {
			const run = async () => {
				console.log(signer.address, network.chainId)
			}
			run()
		}
	}, [network, signer])
	return (
		<div>
			<h1>NFT Wallet</h1>
			<p>My NFTs</p>
		</div>
	)
}
