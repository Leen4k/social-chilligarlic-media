"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

interface QueryProps {
  children?: ReactNode;
}
const queryClient = new QueryClient();

const QueryWrapper = ({ children }: QueryProps) => {
  const session = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {session.status === "authenticated" ? (
        children
      ) : (
        <div className="col-span-10 lg:col-span-6 border-r-2 border-slate-100 grid place-items-center h-screen">
          <button
            onClick={() => {
              signIn();
            }}
            className="flex items-center gap-2 bg-black hover:shadow-xl hover:scale-105 transition-all rounded-full text-white px-4 py-2"
          >
            <FcGoogle /> Sign In With Google
          </button>
        </div>
      )}
    </QueryClientProvider>
  );
};

export default QueryWrapper;
