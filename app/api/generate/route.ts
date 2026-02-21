import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { template, data } = await req.json();

    // Calcul des totaux
    if (Array.isArray(data.items)) {
    data.items = data.items.map((item: any) => ({
        ...item,
        total: Number(item.quantity) * Number(item.unit_price),
    }));

    data.subtotal_ht = data.items.reduce((sum: number, item: any) => {
        return sum + item.total;
    }, 0);

    const tvaRate = Number(data.tva_rate || 0);
    data.tva_amount = (data.subtotal_ht * tvaRate) / 100;

    data.total_ttc = data.subtotal_ht + data.tva_amount;
    }


    if (!template || !data) {
      return NextResponse.json(
        { error: "Missing template or data" },
        { status: 400 }
      );
    }

    // 1) Charger le template HTML
    const templatePath = path.join(
      process.cwd(),
      "templates",
      `${template}.html`
    );

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    let html = fs.readFileSync(templatePath, "utf8");

    // 2) Remplacer les variables {{...}}
    html = replaceVariables(html, data);

    // 3) Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 4) Générer le PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm" },
    });

    await browser.close();

    // 5) Retourner le PDF
    return new NextResponse(Buffer.from(pdfBuffer as unknown as ArrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour remplacer les variables {{...}}
function replaceVariables(html: string, data: any) {
  // 1) Remplacement simple : {{key}}
  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Si c'est un objet (groupe)
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.keys(value).forEach((subKey) => {
        html = html.replaceAll(`{{${subKey}}}`, String(value[subKey] ?? ""));
      });
      return;
    }

    // Si c'est un champ simple
    if (typeof value !== "object") {
      html = html.replaceAll(`{{${key}}}`, String(value ?? ""));
    }
  });

  // 2) Gestion des items (tableaux)
  if (Array.isArray(data.items)) {
    const regex = /{{#each items}}([\s\S]*?){{\/each}}/g;

    html = html.replace(regex, (_, block) => {
      return data.items
        .map((item: any) => {
          let row = block;
          Object.keys(item).forEach((k) => {
            row = row.replaceAll(`{{this.${k}}}`, String(item[k] ?? ""));
          });
          return row;
        })
        .join("");
    });
  }

  return html;
}

