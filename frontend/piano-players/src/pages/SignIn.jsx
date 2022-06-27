import React from 'react'
import styled from 'styled-components'
import LoginBox from '../components/LoginBox'
import SignUpBox from '../components/SignUpBox'

function SignIn() {
  return (
    <AuthModel>
      <SignUpBox />
      <LoginBox />
    </AuthModel>
  )
}

const AuthModel=styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
`

export default SignIn