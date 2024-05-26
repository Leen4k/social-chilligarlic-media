import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export const POST = async (req: NextRequest, res: NextResponse) => {
    const { data } = await req.json();
    const { postId, emojiName } = data;

    const session = await getServerSession(authOptions);

    const prismaUser = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    });

    if (!session) {
        return new NextResponse(JSON.stringify("Please log in to react!"), { status: 401 });
    }

    try {
        const existingHeart = await prisma.heart.findFirst({
            where: {
                userId: prismaUser?.id,
                postId: postId,
            },
        });

        if (existingHeart) {
            // If a heart exists for the same post, check if it's the same emojiName
            if (existingHeart.emojiName === emojiName) {
                // If it's the same emojiName, delete the heart
                await prisma.heart.delete({
                    where: {
                        id: existingHeart.id,
                    },
                });
                return new NextResponse(JSON.stringify("Heart deleted"), { status: 200 });
            } else {
                // If it's a different emojiName, update the emojiName
                await prisma.heart.update({
                    where: {
                        id: existingHeart.id,
                    },
                    data: {
                        emojiName: emojiName,
                    },
                });
                return new NextResponse(JSON.stringify("Emoji updated"), { status: 200 });
            }
        } else {
            // If no heart exists, create a new one
            const newHeart = await prisma.heart.create({
                data: {
                    userId: prismaUser?.id,
                    postId,
                    emojiName,
                }
            });
            return new NextResponse(JSON.stringify(newHeart), { status: 200 });
        }
    } catch (err: any) {
        return new NextResponse(JSON.stringify(err), { status: 500 });
    }
}


// export const POST = async (req:NextRequest,res:NextResponse) => {
//     const {data} = await req.json();
//     const {postId, emojiName} = data;
//     // console.log(postId)

//     const session = await getServerSession(authOptions);
 
//     const prismaUser = await prisma.user.findUnique({
//         where:{
//             email: session?.user?.email
//         }
//     })
//     if (prismaUser) {
//         // If the user exists, you can proceed to check for the heart.
    
//         const existingHeart = await prisma.heart.findFirst({
//             where: {
//                 userId: prismaUser.id,
//                 postId: postId,
//             },
//         });
    
//         if (existingHeart) {
//             // If a heart exists, you can delete it.
//             try{
//                 await prisma.heart.delete({
//                     where: {
//                         id: existingHeart.id,
//                     },
//                 });
//                 return new NextResponse(JSON.stringify("deleted"), {status: 200});
//             }catch(err){
//                 console.log(err)
//             }
//             console.log(`Deleted heart for user ${prismaUser.id} and post ${postId}`);
//         } 
//     }

//     if (!session) {
//         return new NextResponse(JSON.stringify("please login to heart!"), {status: 401});
//     }

//     try{
//         const res = await prisma.heart.create({
//             data: {
//                 userId: prismaUser?.id,
//                 postId,
//                 emojiName,
//             }
//         })
//         return new NextResponse(JSON.stringify(res), {status: 200});
//     }catch(err:any){
//         return new NextResponse(err,{status: 500});
//     }
    
// }
