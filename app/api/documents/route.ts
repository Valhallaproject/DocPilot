import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { template, data, pdfUrl } = body;

    if (!template || !data) {
      return NextResponse.json(
        { error: "Missing template or data" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        userId,
        template,
        data,
        pdfUrl: pdfUrl || null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

