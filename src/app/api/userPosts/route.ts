import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/client";

export const GET = async (req:NextRequest, res:NextRequest) => {
    const session = await getServerSession(authOptions);

    if(!session) return new NextResponse(JSON.stringify("Please sign in to continue"),{status: 401})

    try{
        const data = await prisma.user.findUnique({
            where: {
                email: session?.user && session?.user?.email
            },
            include: {
                posts: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        comments: true
                    }
                }
            }
        })
        return new NextResponse(JSON.stringify(data),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching post"),{status:403})
    }
}