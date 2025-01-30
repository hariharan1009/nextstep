import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId, query, response } = await request.json();

  if (!userId || !query || !response) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newChat = await prisma.chatbotInteraction.create({
    data: {
      userId,
      query,
      response,
    },
  });

  return NextResponse.json(newChat, { status: 201 });
}
