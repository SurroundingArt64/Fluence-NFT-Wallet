/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.5.2-test.1-255
 *
 */
// eslint-disable-next-line
import { Fluence, FluencePeer } from '@fluencelabs/fluence'
import { CallParams, callFunction, registerService } from '@fluencelabs/fluence/dist/internal/compilerSupport/v2'

// Services

export interface PrivateKeyDef {
	get_private_key: (
		db_name: string,
		private_key: string,
		password: string,
		callParams: CallParams<'db_name' | 'private_key' | 'password'>
	) => string | Promise<string>
	store_private_key: (
		db_name: string,
		public_key: string,
		private_key: string,
		password: string,
		callParams: CallParams<'db_name' | 'public_key' | 'private_key' | 'password'>
	) => boolean | Promise<boolean>
	testing_key: (db_name: string, callParams: CallParams<'db_name'>) => boolean | Promise<boolean>
}
export function registerPrivateKey(service: PrivateKeyDef): void
export function registerPrivateKey(serviceId: string, service: PrivateKeyDef): void
export function registerPrivateKey(peer: FluencePeer, service: PrivateKeyDef): void
export function registerPrivateKey(peer: FluencePeer, serviceId: string, service: PrivateKeyDef): void

export function registerPrivateKey(...args: any) {
	registerService(args, {
		defaultServiceId: 'private_key_store_service',
		functions: [
			{
				functionName: 'get_private_key',
				argDefs: [
					{
						name: 'db_name',
						argType: {
							tag: 'primitive',
						},
					},
					{
						name: 'private_key',
						argType: {
							tag: 'primitive',
						},
					},
					{
						name: 'password',
						argType: {
							tag: 'primitive',
						},
					},
				],
				returnType: {
					tag: 'primitive',
				},
			},
			{
				functionName: 'store_private_key',
				argDefs: [
					{
						name: 'db_name',
						argType: {
							tag: 'primitive',
						},
					},
					{
						name: 'public_key',
						argType: {
							tag: 'primitive',
						},
					},
					{
						name: 'private_key',
						argType: {
							tag: 'primitive',
						},
					},
					{
						name: 'password',
						argType: {
							tag: 'primitive',
						},
					},
				],
				returnType: {
					tag: 'primitive',
				},
			},
			{
				functionName: 'testing_key',
				argDefs: [
					{
						name: 'db_name',
						argType: {
							tag: 'primitive',
						},
					},
				],
				returnType: {
					tag: 'primitive',
				},
			},
		],
	})
}

export interface HelloWorldDef {
	getFortune: (callParams: CallParams<null>) => string | Promise<string>
	hello: (str: string, callParams: CallParams<'str'>) => void | Promise<void>
}
export function registerHelloWorld(service: HelloWorldDef): void
export function registerHelloWorld(serviceId: string, service: HelloWorldDef): void
export function registerHelloWorld(peer: FluencePeer, service: HelloWorldDef): void
export function registerHelloWorld(peer: FluencePeer, serviceId: string, service: HelloWorldDef): void

export function registerHelloWorld(...args: any) {
	registerService(args, {
		defaultServiceId: 'hello-world',
		functions: [
			{
				functionName: 'getFortune',
				argDefs: [],
				returnType: {
					tag: 'primitive',
				},
			},
			{
				functionName: 'hello',
				argDefs: [
					{
						name: 'str',
						argType: {
							tag: 'primitive',
						},
					},
				],
				returnType: {
					tag: 'void',
				},
			},
		],
	})
}

// Functions

export function sayHello(config?: { ttl?: number }): Promise<void>

export function sayHello(peer: FluencePeer, config?: { ttl?: number }): Promise<void>

export function sayHello(...args: any) {
	let script = `
                    (xor
                     (seq
                      (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                      (call %init_peer_id% ("hello-world" "hello") ["Hello, world!"])
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'sayHello',
			returnType: {
				tag: 'void',
			},
			argDefs: [],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}

export function test_connection(db_name: string, config?: { ttl?: number }): Promise<boolean>

export function test_connection(peer: FluencePeer, db_name: string, config?: { ttl?: number }): Promise<boolean>

export function test_connection(...args: any) {
	let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                         (call %init_peer_id% ("getDataSrv" "db_name") [] db_name)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("600250b9-5029-4cda-88c3-8e5deaab5b8a" "testing_key") [db_name] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'test_connection',
			returnType: {
				tag: 'primitive',
			},
			argDefs: [
				{
					name: 'db_name',
					argType: {
						tag: 'primitive',
					},
				},
			],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}

export function getRelayTime(config?: { ttl?: number }): Promise<number>

export function getRelayTime(peer: FluencePeer, config?: { ttl?: number }): Promise<number>

export function getRelayTime(...args: any) {
	let script = `
                    (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (xor
                        (call -relay- ("peer" "timestamp_ms") [] ts)
                        (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [ts])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'getRelayTime',
			returnType: {
				tag: 'primitive',
			},
			argDefs: [],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}

export function get_private_key_data(
	db_name: string,
	public_key: string,
	password: string,
	config?: { ttl?: number }
): Promise<string>

export function get_private_key_data(
	peer: FluencePeer,
	db_name: string,
	public_key: string,
	password: string,
	config?: { ttl?: number }
): Promise<string>

export function get_private_key_data(...args: any) {
	let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "db_name") [] db_name)
                          )
                          (call %init_peer_id% ("getDataSrv" "public_key") [] public_key)
                         )
                         (call %init_peer_id% ("getDataSrv" "password") [] password)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("600250b9-5029-4cda-88c3-8e5deaab5b8a" "get_private_key") [db_name public_key password] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'get_private_key_data',
			returnType: {
				tag: 'primitive',
			},
			argDefs: [
				{
					name: 'db_name',
					argType: {
						tag: 'primitive',
					},
				},
				{
					name: 'public_key',
					argType: {
						tag: 'primitive',
					},
				},
				{
					name: 'password',
					argType: {
						tag: 'primitive',
					},
				},
			],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}

export function store_private_key_data(
	db_name: string,
	public_key: string,
	private_key: string,
	password: string,
	config?: { ttl?: number }
): Promise<boolean>

export function store_private_key_data(
	peer: FluencePeer,
	db_name: string,
	public_key: string,
	private_key: string,
	password: string,
	config?: { ttl?: number }
): Promise<boolean>

export function store_private_key_data(...args: any) {
	let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "db_name") [] db_name)
                           )
                           (call %init_peer_id% ("getDataSrv" "public_key") [] public_key)
                          )
                          (call %init_peer_id% ("getDataSrv" "private_key") [] private_key)
                         )
                         (call %init_peer_id% ("getDataSrv" "password") [] password)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call "12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e" ("600250b9-5029-4cda-88c3-8e5deaab5b8a" "store_private_key") [db_name public_key private_key password] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'store_private_key_data',
			returnType: {
				tag: 'primitive',
			},
			argDefs: [
				{
					name: 'db_name',
					argType: {
						tag: 'primitive',
					},
				},
				{
					name: 'public_key',
					argType: {
						tag: 'primitive',
					},
				},
				{
					name: 'private_key',
					argType: {
						tag: 'primitive',
					},
				},
				{
					name: 'password',
					argType: {
						tag: 'primitive',
					},
				},
			],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}

export function tellFortune(config?: { ttl?: number }): Promise<string>

export function tellFortune(peer: FluencePeer, config?: { ttl?: number }): Promise<string>

export function tellFortune(...args: any) {
	let script = `
                    (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (call %init_peer_id% ("hello-world" "getFortune") [] res)
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                    )
    `
	return callFunction(
		args,
		{
			functionName: 'tellFortune',
			returnType: {
				tag: 'primitive',
			},
			argDefs: [],
			names: {
				relay: '-relay-',
				getDataSrv: 'getDataSrv',
				callbackSrv: 'callbackSrv',
				responseSrv: 'callbackSrv',
				responseFnName: 'response',
				errorHandlingSrv: 'errorHandlingSrv',
				errorFnName: 'error',
			},
		},
		script
	)
}
