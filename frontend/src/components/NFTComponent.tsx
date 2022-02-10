import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NFTItemProps } from './NFTWallet'

export function NFTComponent({
  elem, network: { explorer, chainId },
}: {
  network: {
    name: string
    chainId: number
    rpcURL: string
    moralisIdx: string
    explorer: string
  }
  elem: NFTItemProps
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
  const getOpenSeaURL = () => {
    let baseURL
    switch (chainId) {
      case 1:
        baseURL = 'https://opensea.io/assets/'
        break
      case 4:
        baseURL = 'https://testnets.opensea.io/assets/'
        break
      case 137:
        baseURL = 'https://opensea.io/assets/polygon/'
        break
      case 80001:
        baseURL = 'https://testnets.opensea.io/assets/mumbai/'
        break
      default:
        break
    }
    return baseURL + elem.token_address + '/' + elem.token_id
  }
  return (
    <div className='nft-card'>
      <img src={tokenURI} alt="" />
      <div className='headers'>
        <div className='item'>
          <h5>NFT Name</h5>
          <p>{elem.name}</p>
        </div>
        <div className='item'>
          <h5>TOKEN ID</h5>
          <p>{elem.symbol}</p>
        </div>
        <div className='item'>
          <h5>Visit Explorer</h5>
          <p>
            <a
              href={explorer + 'token/' + elem.token_address + `?a=${elem.token_id}#inventory`}
              target='_blank'
              rel='noopener noreferrer'
            >
              ↗
            </a>
          </p>
        </div>
        <div className='item'>
          <h5>Sell on Opensea</h5>
          <p>
            <a href={getOpenSeaURL()} target='_blank' rel='noopener noreferrer'>
              ↗
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
