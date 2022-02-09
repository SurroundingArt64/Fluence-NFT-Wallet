import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import { DB_NAME } from '../config'
import { store_private_key_data } from '../_aqua/main'

export function CreateAccount({ setConnected }: { setConnected: (privKey: string) => void }) {
	const [state, setState] = useState<{
		password: string
		repeatPassword: string
	}>({
		password: '',
		repeatPassword: '',
	})

	function download(filename: string, text: string) {
		const element = document.createElement('a')
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
		element.setAttribute('download', filename)

		element.style.display = 'none'
		document.body.appendChild(element)

		element.click()

		document.body.removeChild(element)
	}

	return (
		<div>
			<h3>CREATE</h3>
			<p>We will generate a wallet address for you.</p>
			<form
				onSubmit={async (e) => {
					e.preventDefault()
					if (state.password === state.repeatPassword) {
						const randomWallet = ethers.Wallet.createRandom()
						let text = `Private Key: ${randomWallet.privateKey}
Public  Key: ${randomWallet.address}
                        `
						download(`wallet-${Date.now()}.txt`, text)

						await Fluence.start({ connectTo: krasnodar[0] })

						const data = await store_private_key_data(
							DB_NAME,
							randomWallet.address,
							randomWallet.privateKey,
							state.password
						)

						setConnected(randomWallet.privateKey)
						await Fluence.stop()
					}
				}}
			>
				<div className=''>
					<input
						onChange={(e) => {
							setState((state) => {
								return {
									...state,
									password: e.target.value,
								}
							})
						}}
						type='password'
						placeholder='Enter Password'
						value={state.password}
					/>
				</div>
				<div className=''>
					<input
						onChange={(e) => {
							setState((state) => {
								return {
									...state,
									repeatPassword: e.target.value,
								}
							})
						}}
						type='password'
						placeholder='Re-enter Password'
						value={state.repeatPassword}
					/>
				</div>
				<div className=''>
					<input type='submit' value='Submit' />
				</div>
			</form>
		</div>
	)
}
