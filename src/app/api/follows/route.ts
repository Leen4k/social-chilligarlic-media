import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/client";



export const GET = async (req: NextRequest, res: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) return new NextResponse(JSON.stringify("Please sign in to continue"), { status: 401 });

  try {
      const currentUser = await prisma.user.findUnique({
          where: {
              email: session?.user && session?.user?.email
          }
      });

      if (!currentUser) {
          return new NextResponse(JSON.stringify("User not found"), { status: 404 });
      }

      // Fetch other users to recommend
      const otherUsersWithFollowStatus = await prisma.user.findMany({
          where: {
              // Exclude the current user
              id: {
                  not: currentUser.id
              }
          },
          take: 5, // Limit the number of users to recommend
          include: {
              followers: {
                  where: {
                      followerId: currentUser.id
                  }
              }
          }
      });

      // Add follow status to each user
      const otherUsers = otherUsersWithFollowStatus.map(user => {
          return {
              ...user,
              isFollowed: user.followers.length > 0
          };
      });

      return new NextResponse(JSON.stringify(otherUsers), { status: 200 });
  } catch (err: any) {
      return new NextResponse(JSON.stringify("Error fetching users"), { status: 403 });
  }
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify("Please sign in to continue"), { status: 401 });
  }

  try {
    const { data } = await req.json();
    const { userId, targetUserId } = data;

    // Check if both user ids are provided
    if (!userId || !targetUserId) {
      return new NextResponse(JSON.stringify({ error: 'Bad Request', message: 'Both user ids are required' }), { status: 400 });
    }

    // Check if the follow relationship already exists
    const existingFollow = await prisma.follow.findFirst({
      where: { followerId: userId, followingId: targetUserId },
    });

    if (existingFollow) {
      // If follow relationship exists, unfollow the user
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });

      return new NextResponse(JSON.stringify({ message: 'Successfully unfollowed user', userId, targetUserId }), { status: 200 });
    }

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return new NextResponse(JSON.stringify({ error: 'Not Found', message: 'Target user not found' }), { status: 404 });
    }

    // Create the follow relationship
    await prisma.follow.create({
      data: { followerId: userId, followingId: targetUserId },
    });

    return new NextResponse(JSON.stringify({ message: 'Successfully followed user', userId, targetUserId }), { status: 201 });
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', message: 'Failed to follow/unfollow user' }), { status: 500 });
  }
}
  