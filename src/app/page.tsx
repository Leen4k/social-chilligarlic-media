"use client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]/route";
import axios from "axios";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Post from "./components/Post";
import { PostProps } from "./types/Post";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Button from "./components/Button";
import { useInView } from "react-intersection-observer";
import { CgSpinnerAlt } from "react-icons/cg";
import { resolve } from "path";
import Loading from "./components/loading/Loading";
import { useSession } from "next-auth/react";

const Page = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const search = searchParams.get("following");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [newToastPostId, setNewToastPostId] = useState<string>();
  const [prevData, setPrevData] = useState<PostProps[] | null>(null);
  const [popUpAvatar, setPopUpAvatar] = useState<PostProps[]>([]);
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  // Initialize page state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchQuery(searchParams.get("searchQuery") || "");
  }, [searchParams]);

  useEffect(() => {
    queryClient.invalidateQueries(["posts"]);
  }, [searchQuery]);

  const fetchPost = async (page: number) => {
    try {
      const { data } = await axios.get(
        `api/posts?searchQuery=${searchQuery}&page=${page}`
      );
      return data;
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch posts");
      // throw new Error('Failed to fetch posts');
    }
  };

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PostProps[]>({
    queryFn: ({ pageParam }) => fetchPost(pageParam),
    queryKey: ["posts", searchQuery],
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined; // Guard clause
      const nextPage =
        lastPage?.length === 5 ? allPages?.length + 1 : undefined;
      return nextPage;
      // const nextPage = lastPage[lastPage.length - 1]?.page + 1; // Determine the next page based on the last page fetched
      // return nextPage;
    },
    // onSuccess: (newData: any) => {
    //   if (prevData) {
    //     const newPosts = newData.pages.flatMap((page) => page).filter((newPost) => !prevData.some((prevPost) => prevPost.id === newPost.id));
    //     setPopUpAvatar(newPosts);
    //     newPosts.forEach((post) => {
    //       console.log(`New post by ${post.user.name}`);
    //     });
    //     // if (newPosts.length > 0) {
    //       setShowToast(true);
    //     // }
    //   }
    //   setPrevData(newData.pages.flatMap((page) => page));
    // },
  });

  useEffect(() => {
    if (data && prevData) {
      const newPosts = data.pages
        .flatMap((page) => page)
        .filter(
          (newPost) => !prevData.some((prevPost) => prevPost.id === newPost.id)
        );
      if (newPosts?.length > 0) {
        setPopUpAvatar(newPosts);
        setNewToastPostId(String(Date.now()));
      }
    }
  }, [data, prevData]);

  console.log(data?.pages?.flatMap((page) => page).length);
  console.log(prevData?.length);

  useEffect(() => {
    if (showToast && popUpAvatar.length > 0 && newToastPostId) {
      const uniqueAvatars = popUpAvatar.reduce((unique, current) => {
        // Check if the user's id already exists in the unique array
        if (!unique.find((user) => user.id === current.user.id)) {
          unique.push(current.user);
        }
        return unique;
      }, []);

      toast.success(
        <div className="flex gap-2 items-center">
          {uniqueAvatars.map((user) => (
            <img
              key={user.id}
              src={user.image}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          ))}
          posted
        </div>,
        { duration: Infinity, id: newToastPostId }
      );
    }
  }, [showToast, popUpAvatar, newToastPostId]);

  const handleScroll = () => {
    if (containerRef.current) {
      const containerHeight =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const containerScrollTop = containerRef.current.scrollTop;
      const scrolled = (containerScrollTop / containerHeight) * 100;
      if (scrolled === 0) {
        toast.dismiss();
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleShowMore = () => {
    if (inView) {
      fetchNextPage({ pageParam: currentPage + 1 }); // Fetch next page
      setCurrentPage(currentPage + 1); // Update current page
      // await new Promise((resolve) => {
      //   setTimeout(() => resolve(true), 1500)
      // })
    }
  };

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      handleShowMore();
    }
  }, [inView, isFetchingNextPage, hasNextPage]);

  const setActiveLink = () => {
    return pathName === "/" && " border-b-4 transition-all";
  };
  console.log(pathName);

  const session = useSession();
  const router = useRouter();
  console.log(session);

  if (isLoading) return <Loading />;

  if (session.status === "unauthenticated") {
    router.push("/signin");
  }

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <div className="flex flex-col sticky left-0 right-0">
        <div className="flex text-center">
          <Link
            href="/"
            className={`flex-1 py-4 border-primary ${setActiveLink}`}
          >
            For you
          </Link>
          <Link href="/following" className="flex-1 py-4">
            Following
          </Link>
        </div>
      </div>
      <div
        className="flex flex-col h-screen overflow-scroll"
        ref={containerRef}
      >
        {data?.pages &&
          data?.pages
            .flatMap((page) => page)
            .map((post) => (
              <Post
                heart={post?.hearts}
                photos={post?.photos}
                key={post?.id}
                id={post?.id}
                createdAt={post?.createdAt}
                comments={post?.comments}
                postTitle={post?.title}
                name={post?.user?.name}
                avatar={post?.user?.image}
              />
            ))}
        {isFetchingNextPage && (
          <div className="flex flex-1 m-auto justify-center items-center">
            <CgSpinnerAlt className="text-primary animate-spin text-3xl m-auto" />
          </div>
        )}
        {!hasNextPage ? (
          <div className="flex items-center justify-center text-center text-slate-500 text-xs my-2">
            No more posts to load
          </div>
        ) : (
          <button
            ref={ref}
            className="text-xs text-slate-500"
            onClick={handleShowMore}
          >
            Showing more posts...
          </button>
        )}

        {/* <h1 ref={ref}>Loading...</h1> */}
      </div>
    </div>
  );
};

export default Page;
