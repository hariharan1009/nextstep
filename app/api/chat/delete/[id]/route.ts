import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.chatbotInteraction.delete({
    where: { id },
  });

  return new Response("Chat deleted", { status: 200 });
}
