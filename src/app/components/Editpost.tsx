import React, {Fragment, useState} from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { FaFeatherPointed } from 'react-icons/fa6';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import { useSearchParams } from 'next/navigation';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

type EditProps = {
    id: string;
    avatar: string;
    name: string;
    title: string;
   
    comments?: {
        id: string;
        postId: string;
        userId: string;
    }[]
    isOpen?: boolean;
    openModal?: any;
    closeModal?: any;
    setTitle: (i:string) => void;
}

const Editpost = ({avatar, name, title, setTitle, comments, id, isOpen, openModal, closeModal}:EditProps) => {
  const searchParams = useSearchParams();
  const post_id = searchParams.get("post_id");
  console.log(post_id)
  let deleteToastId: string
  const queryClient = useQueryClient();

 
  const {mutate} = useMutation(
    async () => await axios.delete(`api/userPosts/${post_id}`),{
      onError: (err) => {
        console.log(err)
        toast.error("Error deleting post",{id: deleteToastId})
      },
      onSuccess: (data) => {
        toast.success("Post deleted successfully",{id: deleteToastId})
        queryClient.invalidateQueries(["profile-post"])
        closeModal();
      }
    }
  )

  const deletePost =  () => {
    deleteToastId = toast.loading("Deleting post...",{id: deleteToastId})
    mutate(post_id);
  }

    

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openModal}>
          <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
          >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
              >
                  <Dialog.Panel className="w-full relative max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                      <button
                      type="button"
                      className="absolute left-1 top-1 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-lg font-medium focus:outline-none"
                      onClick={closeModal}
                      >
                      <RxCross2 />
                      </button>
                      <p className={`${title.length>300?"text-red-700":""} absolute right-1 top-0 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium focus:outline-none`}>{title.length}/300</p>
          
                      <form className="flex justify-center items-start gap-4 mt-8">
                          <Image src={avatar} width={40} height={40} className="rounded-full" alt="image"></Image>
                          <textarea value={post_id || ""} onChange={e=>setTitle(e.target.value)} placeholder="What's on your mind?" className="h-[100px] focus:outline-none mt-2 text-sm text-gray-500 flex-1"> 
                          </textarea>
                      </form>

              
                      <form onSubmit={()=>{}} className="flex items-center gap-x-2 py-2 flex-1">
                          <input type="file" className="basis-4/12" />
                          <button type="submit" onClick={(e)=>{e.preventDefault();deletePost()}} className="disabled:cursor-not-allowed flex basis-4/12 items-end gap-4 bg-red-400 text-white rounded-full font-semibold py-2 w-full justify-center"><span>Delete Post</span></button>
                          <button type="submit" onClick={openModal} className="disabled:cursor-not-allowed flex basis-4/12 items-end gap-4 bg-primary text-white rounded-full font-semibold py-2 w-full justify-center"><span>Update Post</span></button>
                      </form>
                  
                  </Dialog.Panel>
              </Transition.Child>
              </div>
          </div>
          </Dialog>
      </Transition>
    </>
  )
}

export default Editpost