# OpenOcean

-   A custodial NFT wallet service with following networks:

    -   Ethereum (1)
    -   Polygon (137)
    -   Rinkeby (4)
    -   Polygon Mumbai (80_001)

-   The data is stored over Fluence peer network inside Krasnodar node.

-   Password is used to encrypt/decrypt the data and store the private key

-   The base of the Fluence service was written in Rust and compiled down with Marine in wasi target to run in AVM
-   The frontend for the wallet was built with React.
-   Aqua provides tools for building communication with Fluence Network

Functionalities:

-   User can see all his NFTs()
-   User can place sell bids with OpenSeaAPI
-   User can accept cancel with OpenSeaAPI
-   User can transfer out his NFTs

Developer Instructions =>

Website can directly be accessed by:

```sh
cd frontend
yarn start
```

Running Rust

```sh
cd rust-services
./build.sh
```

Deploying on Krasnodar

```sh
aqua dist deploy \
 --addr /dns4/kras-00.fluence.dev/tcp/19990/wss/p2p/12D3KooWSD5PToNiLQwKDXsu8JSysCwUt8BVUJEqCHcDe7P5h45e \
 --data-path config.json \
 --service private_key_store_service
```

If re-deploying peer further instructions:

-   Update the following values in frontend/aqua/main.aqua
    -   PRIVATE_KEY_NODE_PEER_ID
    -   PRIVATE_KEY_SERVICE_ID
