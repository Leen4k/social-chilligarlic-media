import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import axios from "axios";
import ProfilePost from "../components/ProfilePost";
import Link from "next/link";
import Button from "../components/Button";
import ImageModal from "../components/ImageModal";
import { useImageStore } from "@/store/imageStore";

type ProfileProps = {
  id: string;
  email: string;
  name: string;
  image: string;
  cover: string;
}[];

const fetchUserProfile = async (): Promise<ProfileProps> => {
  const session = await getServerSession(authOptions);
  // console.log({session:session})
  const { id: user_id } = session?.user;
  console.log(user_id);
  const res = await fetch(
    `https://social-chilligarlic-media.vercel.app/api/user/${user_id}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  // console.log(data)
  return data;
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await fetchUserProfile();
  console.log(data);

  return (
    <div className="h-screen overflow-scroll col-span-10 lg:col-span-6 border-r-2 border-slate-100">
      <div className="flex flex-col p-8 relative">
        <Image
          className="rounded-full object-cover border mb-4 aspect-square"
          src={data.image || ""}
          width={110}
          height={110}
          alt={"profile pic"}
        ></Image>
        <p className="font-bold text-lg">{data.name}</p>
        <p className="text-lighter">{data.email}</p>
        <Image
          className="w-full h-full -z-[1] opacity-50 absolute inset-0 object-cover border mb-4"
          src={data.cover || ""}
          width={100}
          height={100}
          alt={data?.cover || ""}
        ></Image>
        <Link href={`/profile/${data.id}`}>
          <Button text="Edit Profile" type="button" bgColor="bg-primary" />
        </Link>
      </div>
      <div className="flex text-center">
        {/* <Link href="/profile" className="flex-1 py-4">
          My Profile
        </Link> */}
        {/* <Link href="/profile?friends=true" className="flex-1 py-4">
          Friends
        </Link> */}
      </div>
      <ProfilePost />
      {children}
    </div>
  );
};

export default layout;
