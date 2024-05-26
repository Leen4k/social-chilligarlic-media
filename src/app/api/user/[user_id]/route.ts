import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../prisma/client";

export const GET = async (req:NextRequest, {params}:any) => {
    const {user_id} = params;
    try{
        const data = await prisma.user.findUnique({
            where: {
                id: user_id
            },
        })
        return new NextResponse(JSON.stringify(data),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching user"),{status:403})
    }
}

export const PATCH = async (req:NextRequest, {params}:any) => {
    const {username, email, image, cover} = await req.json();
    const {user_id} = params;
    try{
        const data = await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                name: username,
                email,
                image,
                cover,
            }
        })
        return new NextResponse(JSON.stringify(data),{message:"update profile successfully"},{status: 200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error updating user"), {status:500});
    }
}



