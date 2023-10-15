import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiComment } from 'react-icons/bi'
import HeartPost from './HeartPost'



const Post = ({avatar,name,postTitle,comments,id,heart}) => {
  
  return (
    <div className="flex flex-col p-4 gap-4 border-t border-slate-200 hover:bg-secondary">
        <div className="flex gap-4">
            <div>
            <Image src={avatar} className="rounded-full w-[40px] aspect-square" width={40} height={40} alt="avatar" />
            </div>
            <div className="flex flex-col flex-1">
                <p className="font-bold">{name}</p>   
                <span>{postTitle}</span>
            </div>
        </div>
        <div className="flex">
            <Link href={`/post/${id}`} className="flex gap-1 items-center pl-14"><BiComment /> {comments.length}</Link>
            <HeartPost postId={id} heart={heart} />
        </div>
    </div>
  )
}

export default Post