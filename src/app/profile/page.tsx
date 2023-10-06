import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import Image from 'next/image';
import axios from 'axios';
import ProfilePost from '../components/ProfilePost';

const page = async () => {
    const session = await getServerSession(authOptions);
    try{
         
    }catch(err){

    }
  return (
    <div className="h-screen overflow-scroll px-8 py-4 col-span-10 lg:col-span-6 border-r-2 border-slate-100">
        <div className="flex flex-col">
            <Image className="rounded-full object-cover border mb-4" src={session?.user?.image || ""} width={100} height={100} alt={"profile pic"}></Image>
            <p className="font-bold text-lg">{session?.user?.name}</p>
            <p className="text-lighter">{session?.user?.email}</p>
        </div>
        <ProfilePost />
    </div>
  )
}

export default page