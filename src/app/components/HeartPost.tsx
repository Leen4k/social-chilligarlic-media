"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {AiOutlineHeart} from 'react-icons/ai'
import { BsFillHeartFill } from 'react-icons/bs'


interface HeartProps {
    postId?: string
    heart: any
}

const HeartPost = ({postId,heart}:HeartProps) => {
    const session = useSession();
    console.log(heart?.user?.email)

    const queryClient = useQueryClient();

    const {mutate, isLoading} = useMutation(
        async(data:HeartProps) => (axios.post("/api/posts/submitHeart",{data})),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"])
            },
            onError: (err) => {
                console.log(err)
            }
        }
        
    )
    const submitHeart = (e:React.MouseEvent) => {
        e.preventDefault();
        mutate({postId})
    }

  return (
    <button onClick={submitHeart} className={`flex gap-1 items-center pl-14`}>{heart?.length === 0 ?<AiOutlineHeart />:<BsFillHeartFill className={`${heart?.length>0?"text-red-500":""}`} />}{heart?.length}</button>
  )
}

export default HeartPost