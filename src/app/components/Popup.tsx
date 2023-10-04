"use client"
import React, { Fragment } from 'react'
import Image from 'next/image'
import { Popover, Transition } from '@headlessui/react';
import {BsThreeDots} from "react-icons/bs";
import { signOut } from 'next-auth/react';


interface PopupProps {
  session: any
}

const Popup = ({session}:PopupProps) => {
  return (
    <>
        <Popover className="relative focus:border-none focus:outline-none">
          <Popover.Button>
            <div className="flex flex-1 rounded-full py-3 px-3 w-full justify-center items-center gap-4 hover:bg-slate-200 cursor-pointer">
              <Image src={session?.user?.image || ""} className="w-10 h-10 rounded-full" width={60} height={60} alt="image"></Image>
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-bold">{session?.user?.name}</span>
                <span className="text-lighter">{session?.user?.email}</span>
              </div>
              <BsThreeDots className="hidden lg:flex font-bold text-xl" />
            </div>
          </Popover.Button>
          <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"   
          >
            <Popover.Panel className="absolute z-10 -translate-y-full bg-white inset-0 flex overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <button onClick={()=>{signOut()}} className="font-bold text-center m-auto hover:bg-secondary p-2 cursor-pointer">Logout as {session?.user?.email}</button>
            </Popover.Panel>
          </Transition>
        </Popover>
    </>
  )
}

export default Popup