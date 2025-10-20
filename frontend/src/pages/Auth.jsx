import React, { useState } from 'react'
import AuthStore from '../store/AuthStore'
import { Navigate } from 'react-router-dom'
import Register from '../components/Register'
import Login from '../components/Login'

const Auth = () => {
    const isAuthenticated = AuthStore((state) => state.isAuthenticated)

    console.log(isAuthenticated)
    const [isRegister,setIsRegister] = useState(true)
  return (
    <div className='auth-container'>

        <div className='auth-box'>
            <div className='logo'>
                <img src='/fevicon.png'/>
                <h2>Welcome to DevTrack !</h2>
            </div>
            <div className='Auth-main-box'>
                <div className='btn'>
                    <button className={`${isRegister ? "active" :""}`} onClick={()=>setIsRegister(true)}>Register</button>
                    <button className={`${!isRegister ? "active" :""}`} onClick={()=>setIsRegister(false)}>Login</button>
                </div>
                <div className='auth-main-container'>
                    {/* jdjnfdf */}
                    {isRegister?<Register/>:<Login/>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Auth
