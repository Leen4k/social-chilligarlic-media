import { useImageStore } from '@/store/imageStore';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'
import { RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ParamsProps } from '../post/[post_id]/page';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { PostProps } from '../types/Post';
import Post from './Post';
import { useSession } from 'next-auth/react';

const fetchPostDetails = async (post_id:string) => {
  const {data} = await axios.get(`/api/posts/${post_id}`)
  console.log(data)
  return data;
}



const ImageModal = () => {
    const {isOpen, openModal, closeModal, images, imageIndex} = useImageStore();
    // const session = useSession();
    // const {data, isLoading} = useQuery<PostProps[]>({
    //     queryKey: ["detail-post"],
    //     queryFn: () => fetchPostDetails("cluh2apig001xsuwhyrqktzjn")
    // })

    // if(isLoading) return "Loading...";
    // console.log(data)
  return (
    <>
        <Transition appear show={isOpen || false} as={Fragment}>
          <Dialog as="div" className="relative z-10 w-screen" onClose={openModal}>
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
                  enterFrom="opacity-100 scale-100"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-100 scale-100"
              >
                  <Dialog.Panel className="w-screen flex max-h-[90vh] relative transform overflow-hidden rounded-2xl bg-black text-white p-6 text-left align-middle justify-center items-center shadow-xl transition-all">
                  
                      <button
                      type="button"
                      className="absolute left-1 top-1 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-lg font-medium focus:outline-none"
                      onClick={closeModal}
                      >
                      <RxCross2 /> 
                      </button>
                      <div>
                        <Carousel className="p-4" showArrows={true} selectedItem={imageIndex}>
                          {images.map((image,index)=>(
                              <Image key={index} unoptimized className="w-screen m-auto aspect-square object-cover" src={image} width={40} height={40} alt="picture" />
                          ))}
                        </Carousel>
                      </div>               
                  </Dialog.Panel>
              </Transition.Child>
              </div>
          </div>
          </Dialog>
      </Transition>
    </>
  )
}

export default ImageModal