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
        return new NextResponse(JSON.stringify(`delete ${post_id}`),{status:200});
    }catch(err:any){
        return new NextResponse(JSON.stringify("error fetching post"),{status:403})
    }
}

export const PATCH = async (req: NextRequest, { params }: any) => {
    // const { post_id } = params;
    console.log(params)
    const { data } = await req.json();
    const { title, downloadUrls } = data;
    // Fetch the session
    const session = await getServerSession(authOptions);

    // Check if session exists
    if (!session) {
        return new NextResponse(JSON.stringify("Please login to update a post"), { status: 401 });
    }

    // Validate the title length
    if (title.length > 300) {
        return new NextResponse(JSON.stringify("You can't write more than 300 characters!"), { status: 401 });
    }

    // Validate if the title is empty
    if (title === "") {
        return new NextResponse(JSON.stringify("Please do not leave this empty"), { status: 401 });
    }

    try {
        // Update the post title
        const updatedPost = await prisma.post.update({
            where: { id: params.post_id },
            data: { title: title }
        });
    
        // Update post photos if new photos are provided
        if (downloadUrls && downloadUrls.length > 0) {
            // Delete existing photos
            await prisma.photo.deleteMany({ where: { postId: params.post_id } });
    
            // Create a single photo entry with all the URLs
            await prisma.photo.create({
                data: { url: downloadUrls, post: { connect: { id: params.post_id } } }
            });
        }
    
        // Return success response
        return new NextResponse(JSON.stringify("Post updated successfully"), { status: 200 });
    } catch (err: any) {
        // Handle errors
        console.error(err);
        return new NextResponse(JSON.stringify("Error updating post"), { status: 500 });
    }
};