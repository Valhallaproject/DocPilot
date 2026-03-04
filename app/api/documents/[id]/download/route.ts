import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

function buildItemsRows(items: any[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td>${item.label}</td>
        <td>${item.quantity}</td>
        <td>${item.unit_price} €</td>
        <td>${item.total_ht} €</td>
      </tr>
    `
    )
    .join("");
}

function replaceVariables(html: string, data: Record<string, any>) {
  let output = html;
  for (const key in data) {
    output = output.replace(new RegExp(`{{${key}}}`, "g"), String(data[key] ?? ""));
  }
  return output;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const data = document.data as any;

    // Si le PDF existe déjà → on regénère une URL signée fraîche
    if (document.pdfPath) {
      const { data: signedUrlData, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(document.pdfPath, 60 * 60); // 1h

      if (error) {
        console.error("Signed URL error:", error);
        return NextResponse.json({ error: "Signed URL failed" }, { status: 500 });
      }

      return NextResponse.json({ pdfUrl: signedUrlData.signedUrl });
    }

    // Sinon → on génère le PDF
    const templatePath = path.join(
      process.cwd(),
      "templates",
      document.template,
      "template.html"
    );

    const templateHtml = fs.readFileSync(templatePath, "utf8");

    const arrayName = data.items ? "items" : data.lines ? "lines" : null;

    let items_rows = "";
    let subtotal_ht = 0;
    let tva_amount = 0;
    let total_ttc = 0;
    let deposit_amount = 0;

    if (arrayName) {
      items_rows = buildItemsRows(data[arrayName]);

      subtotal_ht = data[arrayName].reduce(
        (acc: number, item: any) => acc + Number(item.total_ht || 0),
        0
      );

      const tva_rate = Number(data.tva_rate || 0);
      tva_amount = (subtotal_ht * tva_rate) / 100;

      total_ttc = subtotal_ht + tva_amount;

      const deposit_percent = Number(data.deposit_percent || 0);
      deposit_amount = (subtotal_ht * deposit_percent) / 100;
    }

    const finalHtml = replaceVariables(templateHtml, {
      ...data,
      items_rows,
      subtotal_ht,
      tva_amount,
      total_ttc,
      deposit_amount,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

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

    // On stocke uniquement le chemin
    await prisma.document.update({
      where: { id: document.id },
      data: { pdfPath: fileName },
    });

    // On génère une URL signée fraîche
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("documents")
      .createSignedUrl(fileName, 60 * 60);

    if (signedUrlError || !signedUrlData) {
      console.error("Signed URL error:", signedUrlError);
      return NextResponse.json({ error: "Signed URL failed" }, { status: 500 });
    }

    return NextResponse.json({ pdfUrl: signedUrlData.signedUrl });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
