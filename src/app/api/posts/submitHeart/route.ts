import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export const POST = async (req:NextRequest,res:NextResponse) => {
    const {data} = await req.json();
    const {postId} = data;
    // console.log(postId)

    const session = await getServerSession(authOptions);
 
    const prismaUser = await prisma.user.findUnique({
        where:{
            email: session?.user?.email
        }
    })
    if (prismaUser) {
        // If the user exists, you can proceed to check for the heart.
    
        const existingHeart = await prisma.heart.findFirst({
            where: {
                userId: prismaUser.id,
                postId: postId,
            },
        });
    
        if (existingHeart) {
            // If a heart exists, you can delete it.
            try{
                await prisma.heart.delete({
                    where: {
                        id: existingHeart.id,
                    },
                });
                return new NextResponse(JSON.stringify("deleted"), {status: 200});
            }catch(err){
                console.log(err)
            }
            console.log(`Deleted heart for user ${prismaUser.id} and post ${postId}`);
        } 
    }
    // console.log(prismaUser?.id)


    // const alreadyLiked = await prisma.heart.findMany({
    //     where: {
    //         userId: prismaUser?.id,
    //         post: {
    //             id: postId
    //         }
    //     },
    // })
    // console.log(alreadyLiked)
    
    // if (alreadyLiked) {
    //     const res = await prisma.heart.delete({
    //         where: {
    //             postId,
    //             userId: prismaUser?.id
    //         },
    //     });
    //     return new NextResponse(JSON.stringify(res), {status: 200});
    // }

    if (!session) {
        return new NextResponse(JSON.stringify("please login to heart!"), {status: 401});
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
