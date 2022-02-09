import { Fluence } from '@fluencelabs/fluence'
import { krasnodar } from '@fluencelabs/fluence-network-environment'
import React from 'react'
import { get_private_key_data } from '../_aqua/main'

const Login: React.FC = () => {
  const [addr, setAddr] = React.useState("")
  const [pw, setPw] = React.useState("")

  const handleLogin = async (addr: string, pw: string) => {
    await Fluence.start({ connectTo: krasnodar[0] })
    const res = await get_private_key_data("user20", addr, pw)
    console.log(res)
  }

  return (
    <>
      <h3>LOGIN</h3>
      <p>Enter your address and password</p>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleLogin(addr, pw)
      }}>
        <div className=''>
          <input type='text' placeholder='Enter Address'
            onChange={(e) => {
              setAddr(e.target.value)
            }}
            value={addr}
          />
        </div>
        <div className=''>
          <input type='password' placeholder='Enter Password'
            onChange={(e) => {
              setPw(e.target.value)
            }}
            value={pw}
          />
        </div>
        <div className=''>
          <input type='submit' value='Submit' />
        </div>
      </form>
    </>
  )
}

export default Login
