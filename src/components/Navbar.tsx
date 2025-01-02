'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Link from 'next/link'
const Navbar = () => {
    const {data : session} = useSession();
    const user:User = session?.user as User;

  return (
    <nav className='p-2 md:p-3 shadow-md bg-blue-200 text-blue-900'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a href='#' className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>
        {
            session ? ( 
                <>
                    <span className='mr-4'>Welcome, {user?.username }</span>
                    <Button onClick={()=>signOut()} className='w-full md:w-auto  bg-blue-500 hover:bg-blue-800'>Logout</Button>
                </>
            ) : (
                <Link href='/sign-in'>
                    <Button className='w-full md:w-auto bg-blue-500 hover:bg-blue-800'>Login</Button>
                </Link>
            )
        }
      </div>
    </nav>
  )
}

export default Navbar
