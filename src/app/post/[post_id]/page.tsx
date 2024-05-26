"use client";
import Button from "@/app/components/Button";
import Loading from "@/app/components/loading/Loading";
import Post from "@/app/components/Post";
import { PostProps } from "@/app/types/Post";
import { Dialog, Transition } from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { BiComment } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const fetchPostDetails = async (post_id: string) => {
  const { data } = await axios.get(`/api/posts/${post_id}`);
  console.log(data);
  return data;
};

export interface ParamsProps {
  params: {
    post_id: string;
  };
}

type CommentProps = {
  postId?: string;
  title: string;
};

const page = ({ params }: ParamsProps) => {
  const [title, setTitle] = useState("");
  const [disabled, setDisabled] = useState(false);
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const queryClient = useQueryClient();
  let commentToastId: string;
  const { mutate, isLoading: loading } = useMutation(
    async (data: CommentProps) => axios.post(`/api/posts/addComment`, { data }),
    {
      onSuccess: (data) => {
        setTitle("");
        setDisabled(false);
        queryClient.invalidateQueries(["detail-post"]);
        toast.success("Comment Tweeted!", { id: commentToastId });
      },
      onError: (err) => {
        setDisabled(false);
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data, { id: commentToastId });
        }
      },
    }
  );

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabled(true);
    // commentToastId = toast.loading("Tweeting...", {id:commentToastId})
    mutate({ title, postId: post_id });
  };

  const { post_id } = params;

  const { data, isLoading } = useQuery<PostProps[]>({
    queryKey: ["detail-post"],
    queryFn: () => fetchPostDetails(post_id),
  });

  const { mutate: deleteComment, isLoading: loadingForDeleteComment } =
    useMutation({
      mutationFn: async (data) =>
        await axios.delete(`/api/posts/addComment`, { data }),
      onSuccess: (data) => {
        setDisabled(false);
        queryClient.invalidateQueries(["detail-post"]);
        toast.success("Comment Deleted");
      },
      onError: (err) => {
        setDisabled(false);
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data);
        }
      },
    });

  const handleDeleteComment = (commentId) => {
    deleteComment({ commentId: commentId });
  };

  if (loading) {
    commentToastId = toast.loading("Tweeting...");
  }

  if (isLoading) return <Loading />;
  console.log(data);

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <Post
        key={data?.id}
        id={data?.id}
        heart={data?.hearts}
        photos={data?.photos}
        comments={data?.comments}
        postTitle={data?.title}
        name={data?.user?.name}
        avatar={data?.user?.image}
      />
      <div className="flex-1 flex p-4 gap-2">
        <div>
          <Image
            className="rounded-full aspect-square"
            src={session.data?.user?.image || ""}
            height={40}
            width={40}
            alt="img"
          />
        </div>
        <form onSubmit={submitComment} action="" className="w-full">
          <textarea
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full px-2 py-1"
            name=""
            id=""
            placeholder={`replying to ${data?.user?.name}`}
          ></textarea>
          <button
            type="submit"
            disabled={disabled}
            className="disabled:cursor-not-allowed flex basis-1/4 items-end gap-4 bg-primary text-white rounded-full font-semibold py-2 w-full justify-center"
          >
            <span>Reply</span>
          </button>
        </form>
      </div>
      {data?.comments?.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col p-4 gap-4 border-t border-slate-200 hover:bg-secondary"
        >
          <div className="flex gap-4">
            <div>
              <Image
                src={comment.user?.image}
                className="rounded-full w-[40px] aspect-square"
                width={40}
                height={40}
                alt="avatar"
              />
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-bold">{comment.user.name}</p>
              <span>{comment.message}</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                openModal();
                // handleDeleteComment(comment?.id);
              }}
              className="self-start"
            >
              <BsThreeDotsVertical />
              <>
                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={openModal}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-opacity-25" />
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
                          <Dialog.Panel className="w-full max-w-md relative transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle justify-center items-center shadow-xl transition-all">
                            <button
                              type="button"
                              className="absolute left-1 top-1 inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-lg font-medium focus:outline-none"
                              onClick={closeModal}
                            >
                              <RxCross2 />
                            </button>
                            <div className="flex flex-col gap-8 mt-8">
                              <p>
                                Are you sure you want to delete your comment?
                              </p>
                              <Button
                                type="button"
                                bgColor="bg-red-500"
                                disabled={isLoading}
                                text="Delete Comment"
                                action={() => {
                                  handleDeleteComment(comment?.id);
                                }}
                              ></Button>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </>
            </button>
          </div>
          <div>
            <button className="flex gap-1 items-center pl-14 text-xs text-slate-500">
              <BiComment />{" "}
              {comment.createdAt &&
                formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
