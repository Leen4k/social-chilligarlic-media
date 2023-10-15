import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export const POST = async (req:NextRequest,res:NextResponse) => {
    const {data} = await req.json();
    const {postId} = data;
    console.log(postId)

    const session = await getServerSession(authOptions);
 
    const prismaUser = await prisma.user.findUnique({
        where:{email: session?.user?.email}
    })

    if (!session) {
        return new NextResponse(JSON.stringify("please login to tweet a comment"), {status: 401});
    }

    try{
        const res = await prisma.heart.create({
            data: {
                userId: prismaUser?.id,
                postId
            }
        })
        return new NextResponse(JSON.stringify(res), {status: 200});
    }catch(err:any){
        return new NextResponse(err,{status: 500});
    }
    
}

export const DELETE = (req:NextRequest,res:NextResponse){
    
}