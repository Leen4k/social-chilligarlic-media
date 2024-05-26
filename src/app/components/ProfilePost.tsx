"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { Fragment, useState } from "react";
import { UserPostProps } from "../types/UserPost";
import Link from "next/link";
import Image from "next/image";
import { BiComment } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import Editpost from "./Editpost";
import { useRouter } from "next/navigation";
import Post from "./Post";
import Loading from "./loading/Loading";

const fetchProfilePosts = async () => {
  const { data } = await axios.get("/api/userPosts");
  console.log(data);
  return data;
};

const ProfilePost = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | "">("");
  const [photo, setPhoto] = useState([]);
  const { data, isLoading } = useQuery<UserPostProps>({
    queryFn: fetchProfilePosts,
    queryKey: ["profile-post"],
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const getSinglePost = (id: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("post_id", id);
    const newPathName = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    router.push(newPathName, { scroll: false });
  };

  if (isLoading) return <Loading />;
  console.log(data);

  return data?.posts.map((post) => (
    <Post
      heart={post.hearts}
      photos={post.photos}
      key={post.id}
      id={post.id}
      comments={post.comments}
      postTitle={post.title}
      title={title}
      photo={photo}
      setPhoto={setPhoto}
      name={data?.name}
      avatar={data?.image}
      getSinglePost={getSinglePost}
      isOpen={isOpen}
      setTitle={setTitle}
      openModal={openModal}
      closeModal={closeModal}
      createdAt={post.createdAt}
    />
  ));
};

export default ProfilePost;
