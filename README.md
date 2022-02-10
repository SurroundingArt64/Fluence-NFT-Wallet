# OpenOcean

-   A custodial NFT wallet service with following networks:

    -   Ethereum (1)
    -   Polygon (137)
    -   Rinkeby (4)
    -   Polygon Mumbai (80_001)

-   The data is stored over Fluence peer network inside Krasnodar node.

-   Password is used to encrypt/decrypt the data and store the private key

-   The base of the fluence service was written in Rust and compiled down with Marine in wasi target to run in AVM
-   The frontend for the wallet was built with React.
-   Aqua provides tools for building communication with Fluence Network

Functionalities:

-   User can see all his NFTs()
-   User can place sell bids with OpenSeaAPI
-   User can accept cancel with OpenSeaAPI
-   User can transfer out his NFTs
