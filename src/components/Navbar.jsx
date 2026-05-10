import React from 'react'
import { Bot, Sun } from 'lucide-react'

const Navbar = () => {
  return (
    <div className='nav flex items-center justify-between h-[90px] bg-zinc-900' style={{ padding: '0 60px' }}>
      <div className='flex items-center gap-2 text-2xl font-bold text-white'>
        <Bot size={30} color='#9333ea' />
        <span className='text-2xl font-bold text-white ml-2'>LintMind</span>
      </div>
      <div className='icons flex items-center gap-[20px]'>
        <i className='cursor-pointer transition duration-300 ease-in-out hover:text-yellow-600'>
          <Sun size={30} />
        </i>
      </div>
    </div>
  )
}

export default Navbar