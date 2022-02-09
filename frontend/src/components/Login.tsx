import React from 'react'

const Login: React.FC = () => {
  const [addr, setAddr] = React.useState("")
  const [pw, setPw] = React.useState("")

  const handleLogin = async (addr: string, pw: string) => {
    console.log(addr, pw)
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
          />
        </div>
        <div className=''>
          <input type='password' placeholder='Enter Password'
            onChange={(e) => {
              setPw(e.target.value)
            }}
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
