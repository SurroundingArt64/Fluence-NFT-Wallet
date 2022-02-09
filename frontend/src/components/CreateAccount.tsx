import { ethers } from 'ethers'
import React, { useState } from 'react'

export function CreateAccount() {
	const [state, setState] = useState<{
		password: string
		repeatPassword: string
	}>({
		password: '',
		repeatPassword: '',
	})

	return (
		<div>
			<h3>CREATE</h3>
			<p>We will generate a wallet address for you.</p>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					if (state.password === state.repeatPassword) {
						console.log(ethers.utils.randomBytes(32))
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
