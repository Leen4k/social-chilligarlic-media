"use client"
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { RecommendUserProps } from '../types/RecommendedUserProps';
import axios from 'axios';
import Image from 'next/image';
import Button from './Button';
import toast from 'react-hot-toast';
import { FollowsProps } from '../types/Follows';
import { useSession } from 'next-auth/react';

const Card = () => {

    const session = useSession()
    console.log(session.data)
    const queryClient = useQueryClient();

    const {data, isLoading} = useQuery<RecommendUserProps[]>({
        queryKey: ["getRecommendedUser"],
        queryFn: async () => {
            const {data} = await axios.get(`/api/follows`)
            console.log(data)
            return data;
        }
    });

    const {mutate, isLoading:followLoading} = useMutation(
        async (data:FollowsProps) => await axios.post("/api/follows",{data}),
        {
            onError: (error) => {
                toast.error(error.response.data.message)   
            },
            onSuccess: (data) => {
                toast.success("Followed")
                queryClient.invalidateQueries(["getRecommendedUser"]);
                queryClient.invalidateQueries(["posts-following"]);             
                console.log(data)
            }
    })

    const followUser = (userId:string, targetUserId:string) => {
        const data:FollowsProps = {
            userId,
            targetUserId
        }
        mutate(data);
    }

  return (
    <article className="bg-secondary w-full rounded-lg p-4 space-y-2">
        <h3 className="text-lg font-bold">Who to follow</h3>
        {data?.map((user)=>(
            <div className="flex gap-2">
                <Image src={user.image} className="rounded-full w-12 h-12 aspect-square" height={40} width={40} alt={`${user.image} avatar`} />
                <div className="flex flex-col justify-center flex-1">
                    <p>{user.name}</p>
                    {/* <p>{user.email}</p> */}
                </div>
                <Button action={()=>{followUser(session.data?.user?.id,user.id)}} text={user.isFollowed?"followed":"follow"} disabled={isLoading || followLoading} bgColor={user.isFollowed?"bg-black":"bg-primary"} type="button" ></Button>
            </div>
        ))}
    </article>
  )
}

export default Card