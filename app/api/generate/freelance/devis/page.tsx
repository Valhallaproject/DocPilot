"use client";

import FormBuilder from "@/components/form-builder/FormBuilder";
import devisSchema from "@/schemas/freelance/devis";

export default function GenerateDevisPage() {
  const handleSubmit = async (data: any) => {
  const saveRes = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template: "devis",
      data, // ← on envoie tout
    }),
  });

  const saved = await saveRes.json();

  const pdfRes = await fetch(`/api/documents/${saved.id}/download`);
  const blob = await pdfRes.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};


  return (
    <div className="max-w-3xl mx-auto py-10">
      <FormBuilder
        schema={devisSchema}
        template="devis"   // ← obligatoire
        onSubmit={handleSubmit}
      />
    </div>
  );
}
