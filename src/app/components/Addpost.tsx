"use client"
import React, { Fragment, useState } from 'react'
import {FaFeatherPointed} from "react-icons/fa6"
import { Transition, Dialog } from '@headlessui/react'
import Image from 'next/image'
import {RxCross2} from "react-icons/rx"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface AddpostProps {  
    image: string | "";
}

const Addpost = ({image}:AddpostProps) => {
    let [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string | "">("");
    const [isDisabled, setIsDisabled] = useState(false);
    let toastPostID: string

    function closeModal() {
      setIsOpen(false)
    }
  
    function openModal() {
      setIsOpen(true)
    }

    //create a post
    const {mutate} = useMutation(
        async (title:string) => await axios.post("/api/posts",{title}),
    {
        onError: (error) => {
            if(error instanceof AxiosError){
                toast.error(error?.response?.data,{id:toastPostID})
            }
            setIsDisabled(false)
        },
        onSuccess: (data) => {
            toast.success("Tweet is posted",{id:toastPostID})
            setTitle("");
            setIsDisabled(false)
            setIsOpen(false); 
        }
    })

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();  
        setIsDisabled(true);
        toastPostID = toast.loading("Posting Tweet...",{id:toastPostID})
        mutate(title);
     }

  return (
    <>
        <div className="p-2 hidden lg:flex lg:pr-16 flex-1">
          <button onClick={openModal} className="text-xl flex items-end gap-4 bg-primary text-white rounded-full font-semibold py-3 w-full justify-center"><span>Post</span></button>
        </div>
        <div className="p-4 block lg:hidden">
          <button onClick={openModal} className="text-xl flex items-end gap-4 bg-primary text-white rounded-full p-4 font-semibold"><span><FaFeatherPointed /></span></button>
        </div>
        <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                        <Image src={image} width={40} height={40} className="rounded-full" alt="image"></Image>
                        <textarea value={title} onChange={(e)=>{setTitle(e.target.value)}} placeholder="What's on your mind?" name="title" className="h-[100px] focus:outline-none mt-2 text-sm text-gray-500 flex-1"> 
                        </textarea>
                    </form>

            
                    <form onSubmit={handleSubmit} className="flex items-center py-2 flex-1">
                        <input type="file" className="basis-3/4" />
                        <button type="submit" onClick={openModal} disabled={isDisabled} className="disabled:cursor-not-allowed flex basis-1/4 items-end gap-4 bg-primary text-white rounded-full font-semibold py-2 w-full justify-center"><span>Post</span></button>
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

export default Addpost