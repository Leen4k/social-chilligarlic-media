"use client"
import Post from '@/app/components/Post';
import { PostProps } from '@/app/types/Post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiComment } from 'react-icons/bi';


const fetchPostDetails = async (post_id:string) => {
    const {data} = await axios.get(`/api/posts/${post_id}`)
    return data;
}

interface ParamsProps {
    params: {
        post_id: string
    }
}

type CommentProps = {
    postId?: string;
    title: string;
}



const page = ({params}:ParamsProps) => {

    const [title, setTitle] = useState("");
    const [disabled, setDisabled] = useState(false);
    const session = useSession();

    const queryClient = useQueryClient();
    let commentToastId: string
    const {mutate,isLoading:loading} = useMutation(
        async (data:CommentProps) => (axios.post(`/api/posts/addComment`, {data})),
        {
            onSuccess: (data) => {
                setTitle("");
                setDisabled(false);
                queryClient.invalidateQueries(["detail-post"])
                toast.success("Comment Tweeted!", {id: commentToastId})
            },
            onError: (err) => {
                 setDisabled(false)
                 if (err instanceof AxiosError){
                    toast.success(err?.response?.data, {id: commentToastId})
                 }         
            }
        }
    );

    const submitComment = async (e:React.FormEvent) => {
        e.preventDefault();
        setDisabled(true);
        // commentToastId = toast.loading("Tweeting...", {id:commentToastId})
        mutate({title, postId:post_id})
    }  

    const {post_id} = params;

    const {data, isLoading} = useQuery<PostProps[]>({
        queryKey: ["detail-post"],
        queryFn: () => fetchPostDetails(post_id)
    })

    if(isLoading) return "Loading...";
    console.log(data)

    if(loading){
        commentToastId = toast.loading("Tweeting...")
    }

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
        <Post key={data?.id} id={data?.id} comments={data?.comments} postTitle={data?.title} name={data?.user?.name} avatar={data?.user?.image} />
        <div className="flex-1 flex p-4 gap-2">
            <div>
            <Image className="rounded-full" src={session.data?.user?.image || ""} height={40} width={40} alt="img" />
            </div>
            <form onSubmit={submitComment}  action="" className="w-full">
                <textarea value={title} onChange={(e)=>{setTitle(e.target.value)}} className="w-full px-2 py-1" name="" id="" placeholder={`replying to ${data?.user?.name}`}></textarea>
                <button type="submit" disabled={disabled} className="disabled:cursor-not-allowed flex basis-1/4 items-end gap-4 bg-primary text-white rounded-full font-semibold py-2 w-full justify-center"><span>Reply</span></button>
            </form>
        </div>
        {data?.comments?.map(comment => (
                <div key={comment.id} className="flex flex-col p-4 gap-4 border-t border-slate-200 hover:bg-secondary">
                <div className="flex gap-4">
                    <div>
                    <Image src={comment.user?.image} className="rounded-full w-[40px] aspect-square" width={40} height={40} alt="avatar" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <p className="font-bold">{comment.user.name}</p>   
                        <span>{comment.message}</span>
                    </div>
                </div>
                <div>
                    <button className="flex gap-1 items-center pl-14"><BiComment /></button>
                </div>
            </div>
        ))}
    </div>
  )
}

export default page