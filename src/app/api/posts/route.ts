import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/client";


export const POST = async (req:NextRequest,res:NextResponse) => {
    const {data} = await req.json();
    const {title,downloadUrls} = data;
    console.log(title)
   
    const session = await getServerSession(authOptions);
 
    const prismaUser = await prisma.user.findUnique({
        where:{email: session?.user?.email}
    })

    if (!session) {
        return new NextResponse(JSON.stringify("please login to create a post"), {status: 401});
    }
    if(title.length > 300){
        return new NextResponse(JSON.stringify("you can't write more than 300 hundred words!"),{status: 401})
    }
    if(title === ""){
        return new NextResponse(JSON.stringify("Please do not leave this empty"),{status: 401})
    }

    try{
        const res = await prisma.post.create({
            data: {
                title, 
                userId: prismaUser?.id,
            }
        })

        const postId = res.id;

        if (downloadUrls.length > 0) {

            const photo = await prisma.photo.create({
                data: {
                    url: downloadUrls,
                    postId,
                }
            });
        }

        return new NextResponse(JSON.stringify(res), {status: 200});
    }catch(err:any){
        return new NextResponse(err,{status: 500});
    }
    
}

export const GET = async (req:NextRequest, res:NextRequest) => {
    try{
        const data = await prisma.post.findMany({
            include: {
                user: true,      
                comments: true,
                hearts: {
                    include: {
                        user: true
                    }
                },
                photos: true
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