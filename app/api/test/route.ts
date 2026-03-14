import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany();
  const documents = await prisma.document.findMany({
    include: { client: true },
  });

  return NextResponse.json({ clients, documents });
}
