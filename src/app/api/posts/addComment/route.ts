import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../../prisma/client";

export const POST = async (req:NextRequest,res:NextResponse) => {
    const {data} = await req.json();
    const {title, postId} = data;

    const session = await getServerSession(authOptions);
 
    const prismaUser = await prisma.user.findUnique({
        where:{email: session?.user?.email}
    })

    if (!session) {
        return new NextResponse(JSON.stringify("please login to tweet a comment"), {status: 401});
    }
    if(title.length > 300){
        return new NextResponse(JSON.stringify("you can't write more than 300 hundred words!"),{status: 401})
    }
    if(!title.length){
        return new NextResponse(JSON.stringify("Please do not leave this empty"),{status: 401})
    }

    try{
        const res = await prisma.comment.create({
            data: {
                message:title, 
                userId: prismaUser?.id,
                postId
            }
        })
        return new NextResponse(JSON.stringify(res), {status: 200});
    }catch(err:any){
        return new NextResponse(err,{status: 500});
    }
    
}