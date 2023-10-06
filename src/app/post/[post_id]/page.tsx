"use client"
import Post from '@/app/components/Post';
import { PostProps } from '@/app/types/Post';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import Image from 'next/image';
import React from 'react'

const fetchPostDetails = async (post_id:string) => {
    const {data} = await axios.get(`/api/posts/${post_id}`)
    return data;
}

const page = ({params}) => {

    const {post_id} = params;

    const {data, isLoading} = useQuery<PostProps[]>({
        queryKey: ["detail-post"],
        queryFn: () => fetchPostDetails(post_id)
    })

    if(isLoading) return "Loading...";
    console.log(data)

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
        <Post key={data.id} id={data.id} comments={data.comments} postTitle={data.title} name={data.user.name} avatar={data.user.image} />
        <div className="flex-1 flex p-4 gap-2">
            <div>
            <Image className="rounded-full" src={data.user.image || ""} height={40} width={40} alt="img" />
            </div>
            <textarea className="w-full px-2 py-1" name="" id="" placeholder={`replying to ${data.user.name}`}></textarea>
        </div>
    </div>
  )
}

export default page