import React, { useState } from 'react'
import AuthStore from '../store/AuthStore'
import { Navigate } from 'react-router-dom'
import Register from '../components/Register'
import Login from '../components/Login'

const Auth = () => {
  const isAuthenticated = AuthStore((state) => state.isAuthenticated)
  const [isRegister, setIsRegister] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] text-white">

      <div className="w-full max-w-md bg-[#0e131a] rounded-xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src="/fevicon.png" className="w-14 h-14" />
          <h2 className="text-lg font-semibold">Welcome to DevTrack !</h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#1a1f26] rounded-full p-1 mb-6">
          <button
            className={`w-1/2 py-2 rounded-full transition ${
              isRegister ? "bg-[#5b6ae6]" : "text-gray-400"
            }`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>

          <button
            className={`w-1/2 py-2 rounded-full transition ${
              !isRegister ? "bg-[#5b6ae6]" : "text-gray-400"
            }`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
        </div>

        {/* Forms */}
        {isRegister ? <Register /> : <Login />}
      </div>
    </div>
  )
}

export default Auth
