import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../prisma/client";

export const GET = async (req:NextRequest, {params}:any) => {
    const {post_id} = params;
    try{
        const data = await prisma.post.findUnique({
            where: {
                id: post_id
            },
            include: {
                user: true,
                comments: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        user: true,
                    }
                }
            }
        })
        return new NextResponse(JSON.stringify(data),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching post"),{status:403})
    }
}