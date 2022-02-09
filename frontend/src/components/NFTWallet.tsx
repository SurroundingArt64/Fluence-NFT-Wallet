import { ethers } from 'ethers'
import React from 'react'

export const NFTWallet: React.FC<{ signer: ethers.Signer }> = ({ signer }) => {
	return (
		<div>
			<h1>NFT Wallet</h1>
			<p>My NFTs</p>
		</div>
	)
}
