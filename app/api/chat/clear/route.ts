import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.chatbotInteraction.deleteMany();
  return new Response("All chats cleared", { status: 200 });
}
