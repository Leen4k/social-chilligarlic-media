import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

