import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest, res: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse(JSON.stringify("please login to view your friend post"), {status: 401});
        }

        const userId = session?.user?.id // Assuming you have the user's ID in the session    
        const followedUsers = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });

        const followedUserIds = followedUsers.map((follow) => follow.followingId);

        const data = await prisma.post.findMany({
            where: {
                userId: {
                    in: followedUserIds,
                },
            },
            include: {
                user: true,
                comments: true,
                hearts: {
                    include: {
                        user: true,
                    },
                },
                photos: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (err: any) {
        return new NextResponse(JSON.stringify("error fetching post"), { status: 403 });
    }
};