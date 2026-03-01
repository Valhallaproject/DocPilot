import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

function buildItemsRows(items: { label: string; quantity: number; unit_price: number; total: number }[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td>${item.label}</td>
        <td>${item.quantity}</td>
        <td>${item.unit_price} €</td>
        <td>${item.total} €</td>
      </tr>
    `
    )
    .join("");
}

function replaceVariables(html: string, data: Record<string, any>) {
  let output = html;

  for (const key in data) {
    const value = data[key];
    output = output.replace(new RegExp(`{{${key}}}`, "g"), String(value ?? ""));
  }

  return output;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 Correction Next.js 16 : params est une Promise
    const { id } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const templatePath = path.join(process.cwd(), "templates", `${document.template}.html`);
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    const data = document.data as any;

    // Génération des lignes du tableau
    const items_rows = buildItemsRows(data.items);

    // Recalcul des totaux (sécurité)
    const subtotal_ht = data.items.reduce((acc: number, item: any) => acc + item.total, 0);
    const tva_amount = (subtotal_ht * data.tva_rate) / 100;
    const total_ttc = subtotal_ht + tva_amount;
    const deposit_amount = (total_ttc * data.deposit_percent) / 100;

    const finalHtml = replaceVariables(templateHtml, {
      ...data,
      items_rows,
      subtotal_ht,
      tva_amount,
      total_ttc,
      deposit_amount,
    });

    // Génération PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Upload Supabase
    const fileName = `document-${document.id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("documents")
    .createSignedUrl(fileName, 60 * 60 * 24); // 24h

  if (signedUrlError) {
    console.error("Signed URL error:", signedUrlError);
    return NextResponse.json({ error: "Signed URL failed" }, { status: 500 });
  }

  await prisma.document.update({
    where: { id: document.id },
    data: { pdfUrl: signedUrlData.signedUrl },
  });

    return NextResponse.json({ pdfUrl: signedUrlData.signedUrl });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
