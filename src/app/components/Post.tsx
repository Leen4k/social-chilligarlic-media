import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiComment } from "react-icons/bi";
import HeartPost from "./HeartPost";
import Editpost from "./Editpost";
import { BsThreeDotsVertical } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import ImageModal from "./ImageModal";
import { useImageStore } from "@/store/imageStore";

const Post = ({
  avatar,
  name,
  postTitle,
  title,
  comments,
  id,
  heart,
  photos,
  photo,
  setPhoto,
  getSinglePost,
  setTitle,
  isOpen,
  openModal,
  closeModal,
  createdAt,
}) => {
  console.log(photos);
  console.log(isOpen);
  const {
    openModal: openImageModal,
    setImagesModal,
    setImageIndex,
  } = useImageStore();
  return (
    <div className="flex flex-col p-4 gap-4 border-t border-slate-200 hover:bg-secondary">
      <div className="flex gap-4">
        <div>
          <Image
            src={avatar || ""}
            className="rounded-full w-[40px] aspect-square"
            width={40}
            height={40}
            alt="avatar"
          />
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-bold">
            {name}{" "}
            <span className="text-slate-500 font-light text-sm gap-2">
              {createdAt &&
                formatDistanceToNow(new Date(createdAt), { addSuffix: false })}
            </span>
          </p>
          <span>{postTitle}</span>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            openModal();
            getSinglePost(id);
            setTitle(postTitle);
            setPhoto(photos);
          }}
        >
          {/* <div onClick={()=>{openModal();getSinglePost(id);setTitle(postTitle);setPhoto(photos)}}><BsThreeDotsVertical /></div> */}
          <Editpost
            id={id}
            avatar={avatar}
            name={name}
            title={title}
            setTitle={setTitle}
            photos={photos}
            photo={photo}
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}
          />
        </div>
      </div>
      <div
        className={`grid ${
          photos.length > 0 &&
          photos[0]?.url?.length > 1 &&
          "grid-cols-2 w-[85%] gap-1"
        }`}
      >
        {photos &&
          photos[0]?.url?.map((photo: string, index: number) => (
            <Image
              onClick={() => {
                openImageModal();
                setImagesModal(photos[0]?.url);
                setImageIndex(index);
              }}
              unoptimized
              priority
              src={photo || ""}
              className={`ml-14 ${
                photos[0]?.url?.length === 1
                  ? "w-[300px] lg:w-[500px]"
                  : "w-[100%] border-slate-200 border-[1px]"
              } aspect-square object-cover rounded-lg`}
              width={40}
              height={40}
              alt="avatar"
            />
          ))}
        <ImageModal />
        {/* <Image src={"https://firebasestorage.googleapis.com/v0/b/xclone-e3b7e.appspot.com/o/imgFiles%2Fst%2Csmall%2C507x507-pad%2C600x600%2Cf8f8f8.jpg?alt=media&token=efc5c685-889b-4a15-846b-e5f7eec61d36"} className="ml-14 w-[300px] lg:w-[500px] aspect-square object-cover rounded-lg" width={40} height={40} alt="avatar" /> */}
      </div>
      <div className="flex relative">
        <Link href={`/post/${id}`} className="flex gap-1 items-center pl-14">
          <BiComment /> {comments.length}
        </Link>
        <HeartPost postId={id} heart={heart} />
      </div>
    </div>
  );
};

export default Post;
