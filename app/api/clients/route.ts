import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const client = await prisma.client.create({
    data: {
      userId,
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      zip: data.zip,
      country: data.country,
      siret: data.siret,
      vatNumber: data.vatNumber,
      notes: data.notes,
    },
  });

  return NextResponse.json(client);
}
