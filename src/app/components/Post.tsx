import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiComment } from 'react-icons/bi'
import HeartPost from './HeartPost'



const Post = ({avatar,name,postTitle,comments,id,heart,photos}) => {
  console.log(photos)
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
        <div className={`grid`}>
            {photos[0]?.url?.map((photo:string) => (
              <Image priority src={photo || ""} className="ml-14 w-[300px] lg:w-[500px] aspect-square object-cover rounded-lg" width={40} height={40} alt="avatar" /> 
            ))}
            {/* <Image src={"https://firebasestorage.googleapis.com/v0/b/xclone-e3b7e.appspot.com/o/imgFiles%2Fst%2Csmall%2C507x507-pad%2C600x600%2Cf8f8f8.jpg?alt=media&token=efc5c685-889b-4a15-846b-e5f7eec61d36"} className="ml-14 w-[300px] lg:w-[500px] aspect-square object-cover rounded-lg" width={40} height={40} alt="avatar" /> */}
        </div>
        <div className="flex">
            <Link href={`/post/${id}`} className="flex gap-1 items-center pl-14"><BiComment /> {comments.length}</Link>
            <HeartPost postId={id} heart={heart} />
        </div>
    </div>
  )
}

export default Post