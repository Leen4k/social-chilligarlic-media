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

export const DELETE = async (req: NextRequest, res: NextResponse) => {
    const { commentId } = await req.json(); // Assuming you're sending commentId in the request body

    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify("Please login to delete a comment"), { status: 401 });
    }

    try {
        // Check if the user has permission to delete the comment, you may have some logic here to determine this
        // For now, let's assume you have the user's ID in session and you check if the comment belongs to this user
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true }
        });

        if (!comment) {
            return new NextResponse(JSON.stringify("Comment not found"), { status: 404 });
        }

        if (comment.userId !== session.user.id) {
            return new NextResponse(JSON.stringify("You don't have permission to delete this comment"), { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return new NextResponse(JSON.stringify("Comment deleted successfully"), { status: 200 });
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
}