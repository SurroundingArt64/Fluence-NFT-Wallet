export const DB_NAME = 'UsersDatabase'
export const BLOCK_API_KEY = 'ed14d7c7-1532-4102-8078-6d2e2cd56aac'
export const MORALIS_API_KEY = 'lmkNT0iJnRRuhioPyZtrb1Cz9C7WMJg7xnkKNMc9smRRVITmC7V7GRjssrHfoS6e'

export const ERC721ABI = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'from',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'transferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
]
