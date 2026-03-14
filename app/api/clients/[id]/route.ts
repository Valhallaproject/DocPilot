import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const client = await prisma.client.update({
    where: { id: params.id, userId },
    data,
  });

  return NextResponse.json(client);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.client.delete({
    where: { id: params.id, userId },
  });

  return NextResponse.json({ success: true });
}
