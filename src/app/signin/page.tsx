"use client";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  return (
    <div className="col-span-10 lg:col-span-6 border-r-2 border-slate-100 grid place-items-center">
      <button
        onClick={() => {
          signIn();
        }}
        className="flex items-center gap-2 bg-black hover:shadow-xl hover:scale-105 transition-all rounded-full text-white px-4 py-2"
      >
        <FcGoogle /> Sign In With Google
      </button>
    </div>
  );
};

export default page;
