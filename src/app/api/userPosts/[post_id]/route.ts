import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../prisma/client";

export const GET = async (req:NextRequest, res:NextRequest, {params}:any) => {
    const session = await getServerSession(authOptions);
    const {post_id} = params;

    if(!session) return new NextResponse(JSON.stringify("Please sign in to continue"),{status: 401})

    try{
        const data = await prisma.post.findUnique({
            where: {
                id: post_id,
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return new NextResponse(JSON.stringify(data),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching post"),{status:403})
    }
}

export const DELETE = async (req:NextRequest, {params}:any) => {
    const session = await getServerSession(authOptions);
    const {post_id} = params;

    if(!session) return new NextResponse(JSON.stringify("Please sign in to continue"),{status: 401})

    try{
        const res = await prisma.post.delete({
            where: {
                id: post_id,
            }
        })
        console.log("yayyy")
        return new NextResponse(JSON.stringify(`delete ${post_id}`),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching post"),{status:403})
    }
}