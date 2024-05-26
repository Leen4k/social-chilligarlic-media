import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loading = () => {
  return (
    <div className="flex flex-1 col-span-10 lg:col-span-6 w-full flex-col p-4 gap-4 border-t border-slate-200 hover:bg-secondary">
    {Array.from({length: 10}).map((_,item) => (
        <div key={item}>
          <div className="flex gap-4">
              <div className="rounded-full">
                <Skeleton width={40} height={40} circle={true} />
              </div>
              <div className="flex flex-col flex-1">
                  <p className="font-bold"><Skeleton /> <span className="text-slate-500 font-light text-sm gap-2"><Skeleton /></span></p>   
                  <span><Skeleton height={400} /></span> 
              </div>
              <div className="cursor-pointer">
                  {/* <div onClick={()=>{openModal();getSinglePost(id);setTitle(postTitle);setPhoto(photos)}}><BsThreeDotsVertical /></div> */}
                  <Skeleton />
              </div>
          </div>
          <div className="flex relative">
              <Skeleton />
              <Skeleton />
          </div>
    </div>
  ))}
  </div>
  )
}

export default Loading