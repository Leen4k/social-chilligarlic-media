"use client";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiHomeCircle, BiUser } from "react-icons/bi";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Popup from "./Popup";
import Addpost from "./Addpost";
import Link from "next/link";
import { headers } from "next/headers";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const session = useSession();
  console.log(session.status);

  const fetchSingleUser = async () => {
    try {
      const data = await axios.get("/api/user/" + session.data?.user.id);
      return data;
    } catch (err) {
      toast.error("error");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["fetchSingleUser"],
    queryFn: fetchSingleUser,
  });
  const pathName = usePathname();
  console.log(data);

  return (
    <div className="min-h-screen border-r-2 border-slate-100 col-span-2 lg:col-span-3 min-w-0 h-screen overflow-hidden flex flex-col items-center lg:items-start">
      <div className="py-2 relative flex justify-start items-center px-6 rounded-full cursor-pointer">
        {/* <FaXTwitter className="text-3xl" /> */}
        <Image
          width="30"
          height="30"
          className="object-fill scale-150 ml-2"
          src="/logo.png"
          alt="logo"
        ></Image>
      </div>
      <div className="flex flex-col lg:w-full">
        <div className="p-2">
          <Link
            href="/"
            className={`text-xl flex items-end gap-4 hover:bg-slate-200 py-2 px-4 rounded-full 
            ${(pathName === "/" || pathName === "/following") && "font-bold"}`}
          >
            <BiHomeCircle className="text-3xl" />
            <span className={`hidden lg:block`}>Home</span>
          </Link>
        </div>
        <div className="p-2">
          <Link
            href="/profile"
            className={`text-xl flex items-end gap-4 hover:bg-slate-200 py-2 px-4 rounded-full 
            ${pathName.includes("/profile") && "font-bold"}`}
          >
            <BiUser className="text-3xl" />
            <span className="hidden lg:block">Profile</span>
          </Link>
        </div>
        <Addpost image={session?.data?.user?.image || ""} />
      </div>
      {session && (
        <div className="flex p-2 gap-2 w-full items-center justify-center justify-self-center self-end ">
          <Popup session={session} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
