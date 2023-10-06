"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import React, { Fragment, useState } from 'react'
import { UserPostProps } from '../types/UserPost';
import Link from 'next/link';
import Image from 'next/image';
import { BiComment } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Dialog, Transition } from '@headlessui/react';
import { RxCross2 } from 'react-icons/rx';
import Editpost from './Editpost';
import { useRouter } from 'next/navigation';


const fetchProfilePosts = async () => {
    const {data} = await axios.get("/api/userPosts")
    return data;
}

const ProfilePost = () => {
    const router = useRouter();
    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string | "">("");
    const {data,isLoading} = useQuery<UserPostProps>({queryFn: fetchProfilePosts, queryKey:["profile-post"]})
    if (isLoading) return "Loading...";
    console.log(data)

    function closeModal() {
        setIsOpen(false)
    }
    
    function openModal() {
        setIsOpen(true)
    }

    const getSinglePost = (id:string) => {
        openModal();
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("post_id",id);
        const newPathName = `${window.location.pathname}?${searchParams.toString()}`
        router.push(newPathName,{scroll: false});
    }

  return (
    data?.posts.map(post => (
        <div key={post.id} className="flex flex-col p-4 mt-4 gap-4 border-t border-slate-200 hover:bg-secondary">
        <div className="flex gap-4">
            <div>
            <Image src={data?.image || ""} className="rounded-full w-[40px] aspect-square" width={40} height={40} alt="avatar" />
            </div>
            <div className="flex flex-col flex-1">
                <p className="font-bold">{data?.name}</p>   
                <span>{post.title}</span>
            </div>
            <div className="cursor-pointer">
                <button onClick={(e)=>{e.preventDefault();getSinglePost(post.id)}}><BsThreeDotsVertical /></button>
                <Editpost id={post.id} avatar={data?.image || ""} name={data.name} title={post.title} setTitle={setTitle} isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
            </div>
        </div>
        <div>
            <Link href={`/profile/${post.id}`} className="flex gap-1 items-center pl-14"><BiComment /> {post.comments?.length}</Link>
        </div>
    </div>
    ))
  )
}

export default ProfilePost