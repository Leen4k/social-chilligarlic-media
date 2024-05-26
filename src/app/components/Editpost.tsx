"use client"
import React, {Fragment, useEffect, useRef, useState} from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { FaFeatherPointed } from 'react-icons/fa6';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import { useSearchParams } from 'next/navigation';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../firebase'
import { BsThreeDotsVertical } from 'react-icons/bs';


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



const Editpost = ({avatar, name, title, setTitle, photos, photo, comments, id}:EditProps) => {
  const searchParams = useSearchParams();
  const post_id = searchParams.get("post_id");
  let deleteToastId: string
  let updateToastId: string
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref to textarea element
  const imageRef = useRef<HTMLImageElement>(null); // Ref to image element

  const [newTitle, setNewTitle] = useState(title);
  const [newPhoto, setNewPhoto] = useState(photo);
  const [images, setImages] = useState([]);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [progress, setProgress] = useState(null); 
  let [isOpen, setIsOpen] = useState<boolean>(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const {mutate:deleteMutation,isLoading} = useMutation(
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
    deleteMutation(post_id);
  }

  const {mutate:updateMutation, isLoading:updateLoading} = useMutation(
    async (data) => await axios.patch(`api/userPosts/${post_id}`,{data}),
    {
      onError: () => {
        toast.error("Could not update post",{id: updateToastId})
      },
      onSuccess: () => {
        toast.success("Post updated successfully",{id: updateToastId})
        queryClient.invalidateQueries(["profile-post"])
        closeModal()
      }
    }
  ) 

  const saveChanges = () => {
      setTitle(newTitle); // Pass updated title back to the parent component
      const data = {
        title:newTitle,
        downloadUrls: newPhoto.length > 0 && newPhoto[0]?.url
      }
      console.log(data);
      updateMutation(data);
  };


  // Update local state when the title prop changes
  useEffect(() => {
    setNewTitle(title);
  }, [title]);

  

  // Update local state when the title prop changes
  useEffect(() => {
    setNewPhoto(photo);
    console.log(newPhoto)
  }, [photo]);

  // Function to handle changes in the title
  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewTitle(event.target.value); // Update local state
  };

  const handleDeleteImage = (url:string) => {
    const updatedPhoto = newPhoto.map((item:any, index:number) => {
      if (index === 0 && item?.url) {
          // Filter out the deleted image URL from the array
          const filteredUrls = item.url.filter((photo: string) => photo !== url);
          return { ...item, url: filteredUrls };
      }
      return item;
    });
    setNewPhoto(updatedPhoto);
  }

  useEffect(() => {
    const uploadFile = async () => {
      const uploadToastId = toast.loading("Uploading files...");
      const newPhotos = [...newPhoto]; // Copy the existing newPhoto state
    
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const storageRef = ref(storage, `/imgFiles/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        uploadTask.on("state_changed", (snapshot) => {
          const newProgress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(newProgress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        }, (error) => {
          console.log(error);
        }, async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Update the newPhoto state with the new download URL
            newPhotos[0]?.url.push(downloadURL);
            setNewPhoto(newPhotos);
            setDownloadUrls([...downloadUrls, downloadURL]); // Also update downloadUrls if needed
          } catch (error) {
            console.log(error);
          } finally {
            setImages([]);
          }
        });
      }
       // Close loading toast after uploading completes
       toast.success("Files uploaded successfully", { id: uploadToastId });
    };

    if (images.length > 0) {
      uploadFile();
    }

  }, [images]);
  console.log(downloadUrls)

  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    setImages([...selectedFiles]);
};

useEffect(() => {
  // Focus the textarea when the modal opens
  if (isOpen && textareaRef.current) {
    textareaRef.current.focus();
  }

  // Automatically trigger click event on the image when component mounts
  if (isOpen && imageRef.current) {
    imageRef.current.click();
  }
}, []);


  if (isLoading) {
    deleteToastId = toast.loading("Deleting post...")
  }
  if (updateLoading){
    updateToastId = toast.loading("Updating post...")
  }



  return (
    <>
      <div className="cursor-pointer">
          <div onClick={()=>{openModal();}}><BsThreeDotsVertical /></div>
      </div>
      <Transition appear show={isOpen || false} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={openModal}>
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
                <Dialog.Panel className="w-full flex-1 relative max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute left-1 top-1 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-lg font-medium focus:outline-none"
                    onClick={closeModal}
                  >
                    <RxCross2 />
                  </button>
                  <p
                    className={`${newTitle?.length > 300 ? 'text-red-700' : ''} absolute right-1 top-0 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium focus:outline-none`}
                  >
                    {newTitle?.length}/300
                  </p>

           
                    <div ref={imageRef} className="flex justify-center items-start gap-4 mt-8">
                      <Image src={avatar} width={40} height={40} className="rounded-full aspect-square" alt="image" />
                      <textarea
                        ref={textareaRef} // Set the ref to the textarea element
                        value={newTitle}
                        onClick ={()=>{imageRef?.current?.click();}}
                        onChange={handleTitleChange}
                        placeholder="What's on your mind?"
                        className="h-[100px] focus:outline-none mt-2 text-sm text-gray-500 flex-1"
                        autoFocus // Autofocus attribute
                      />
                    </div>
          

                  <div className={`grid ${newPhoto && newPhoto[0]?.url?.length > 1 && 'grid-cols-2 w-[85%] flex-1 gap-1'}`}>
                    {newPhoto?.length > 0 &&
                      newPhoto[0]?.url?.map((photo: string, index: number) => (
                        <div key={index} className="relative">
                          <Image
                            unoptimized
                            priority
                            src={photo || ''}
                            className={`ml-14 ${
                              newPhoto[0]?.url?.length === 1 ? 'w-[300px] lg:w-[500px]' : 'w-[100%] border-slate-200 border-[1px]'
                            } aspect-square object-cover rounded-lg`}
                            width={40}
                            height={40}
                            alt="avatar"
                          />
                          <RxCross2
                            onClick={() => {
                              handleDeleteImage(photo);
                            }}
                            className="z-10 absolute top-1 -right-[3.2rem] text-white bg-primary rounded-full w-6 h-6 p-1 cursor-pointer"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center gap-x-2 py-2 flex-1">
                    <input type="file" multiple onChange={handleImageChange} />
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        deletePost();
                      }}
                      className="disabled:cursor-not-allowed flex basis-4/12 items-end gap-4 bg-red-400 text-white rounded-full font-semibold py-2 w-full justify-center"
                    >
                    <span>Delete Post</span>
                    </button>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        saveChanges();
                      }}
                      className="disabled:cursor-not-allowed flex basis-4/12 items-end gap-4 bg-primary text-white rounded-full font-semibold py-2 w-full justify-center"
                    >
                      <span>Update Post</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};


export default Editpost;