"use client";
import axios from "axios";
import React from "react";
import { PostProps } from "../types/Post";
import { useQuery } from "@tanstack/react-query";
import Post from "../components/Post";
import Link from "next/link";
import Loading from "../components/loading/Loading";
import { usePathname } from "next/navigation";

const page = () => {
  const pathName = usePathname();

  const fetchPost = async () => {
    try {
      const { data } = await axios.get("api/posts/following");
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const setActiveLink = () => {
    return pathName === "/" && " border-b-4 transition-all";
  };

  const { data, error, isLoading } = useQuery<PostProps[]>({
    queryFn: fetchPost,
    queryKey: ["posts-following"],
  });

  // if (error) throw error;
  if (isLoading) return <Loading />;
  console.log(data);

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <div className="flex flex-col sticky left-0 right-0">
        <div className="flex text-center">
          <Link href="/" className="flex-1 py-4">
            For you
          </Link>
          <Link
            href="/following"
            className={`${`flex-1 py-4 border-primary ${setActiveLink}`}`}
          >
            Following
          </Link>
        </div>
      </div>
      <div className="flex flex-col h-screen overflow-scroll">
        {data.length === 0 && (
          <div className="flex h-screen text-center items-center justify-center text-xl font-bold">
            No Post Available
          </div>
        )}
        {data.length > 0 &&
          data?.map((post) => (
            <Post
              heart={post.hearts}
              photos={post.photos}
              key={post.id}
              id={post.id}
              createdAt={post.createdAt}
              comments={post.comments}
              postTitle={post.title}
              name={post.user.name}
              avatar={post.user.image}
            />
          ))}
      </div>
    </div>
  );
};

export default page;
