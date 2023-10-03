import React from 'react'
import {FaFeatherPointed, FaXTwitter} from "react-icons/fa6"
import {BiHomeCircle,BiUser} from "react-icons/bi"
import {BsThreeDots} from "react-icons/bs";
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Image from 'next/image'


const Navbar = async () => {
  const session = await getServerSession(authOptions);
  console.log(session)
  return (
    <div className="border-r-2 border-slate-100 col-span-2 lg:col-span-3 min-w-0 h-screen flex flex-col items-center lg:items-start">
      <div className="py-2 px-6 rounded-full"><FaXTwitter className="text-3xl" /></div>
      <div className="flex flex-col lg:w-full">
        <div className="p-2">
          <button className="text-xl flex items-end gap-4 hover:bg-slate-200 py-2 px-4 rounded-full"><BiHomeCircle className="text-3xl" /><span className="hidden lg:block">Home</span></button>
        </div>
        <div className="p-2">
          <button className="text-xl flex items-end gap-4 hover:bg-slate-200 py-2 px-4 rounded-full"><BiUser className="text-3xl" /><span className="hidden lg:block">Profile</span></button>
        </div>
        <div className="p-2 hidden lg:flex lg:pr-16 flex-1">
          <button className="text-xl flex items-end gap-4 bg-primary text-white rounded-full font-semibold py-3 w-full justify-center"><span>Post</span></button>
        </div>
        <div className="p-4 block lg:hidden">
          <button className="text-xl flex items-end gap-4 bg-primary text-white rounded-full p-4 font-semibold"><span><FaFeatherPointed /></span></button>
        </div>
      </div>
      <div className="p-2 hidden lg:flex gap-2 w-full items-center justify-center justify-self-center self-end ">
          <div className="flex rounded-full py-3 px-8 w-full justify-center items-center gap-2 hover:bg-slate-200 cursor-pointer">
            <Image src={session?.user?.image || ""} className="w-6 h-6 rounded-full" width={60} height={60} alt="image"></Image>
            <div className="flex flex-col">
              <span className="font-bold">{session?.user?.name}</span>
              <span className="text-lighter">{session?.user?.email}</span>
            </div>
            <BsThreeDots className="font-bold text-3xl" />
          </div>

      </div>
    </div>
  )
}

export default Navbar