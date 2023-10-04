"use client"
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { authOptions } from './api/auth/[...nextauth]/route';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchPost = async () => {
  try{
    const {data} = await axios.get("api/posts")
    return data;
  }catch(err){
    console.log(err)
  }
}

const page = () => {
  const {data, error, isLoading} = useQuery({queryFn: fetchPost, queryKey: ["posts"]})

  if(error) throw error;
  if(isLoading) return "Loading...";
  console.log(data)

  return (
    <div className="col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <div className="p-4 font-bold text-xl">
        Hello Mom
      </div>
      <div className="flex text-center">
        <Link href="/" className="flex-1 py-4">For you</Link>
        <Link href="/following" className="flex-1 py-4">Following</Link>
      </div>
    </div>
  )
}

export default page