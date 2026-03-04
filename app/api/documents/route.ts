import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { template, data } = body; // <-- pdfUrl supprimé

    if (!template || !data) {
      return NextResponse.json({ error: "Missing template or data" }, { status: 400 });
    }

    // -----------------------------
    // 1) Calcul des lignes
    // -----------------------------
    const items = data.items || [];

    const items_rows = items
      .map((item: any) => {
        const total_ht = Number(item.quantity) * Number(item.unit_price);

        return `
          <tr>
            <td>${item.label}</td>
            <td>${item.quantity}</td>
            <td>${item.unit_price} €</td>
            <td>${total_ht} €</td>
          </tr>
        `;
      })
      .join("");

    // -----------------------------
    // 2) Sous-total
    // -----------------------------
    const subtotal_ht = items.reduce((sum: number, item: any) => {
      return sum + Number(item.quantity) * Number(item.unit_price);
    }, 0);

    // -----------------------------
    // 3) TVA
    // -----------------------------
    const tva_rate = Number(data.tva_rate || 0);
    const tva_amount = (subtotal_ht * tva_rate) / 100;

    // -----------------------------
    // 4) Total TTC
    // -----------------------------
    const total_ttc = subtotal_ht + tva_amount;

    // -----------------------------
    // 5) Acompte
    // -----------------------------
    const deposit_percent = Number(data.deposit_percent || 0);
    const deposit_amount = (subtotal_ht * deposit_percent) / 100;

    // -----------------------------
    // 6) On enrichit les données
    // -----------------------------
    const enrichedData = {
      ...data,
      items_rows,
      subtotal_ht,
      tva_amount,
      total_ttc,
      deposit_amount,
    };

    // -----------------------------
    // 7) Sauvegarde en base
    // -----------------------------
    const document = await prisma.document.create({
      data: {
        userId,
        template,
        data: enrichedData,
        pdfPath: null, // <-- parfait
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
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
