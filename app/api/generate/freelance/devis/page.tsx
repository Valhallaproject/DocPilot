"use client";

import FormBuilder from "@/components/form-builder/FormBuilder";
import devisSchema from "@/schemas/freelance/devis.json";

export default function GenerateDevisPage() {
  const handleSubmit = async (data: any) => {
  const flatData = {
    ...data.freelance,
    items: data.items
  };

  const saveRes = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template: "freelance/devis",
      data: flatData,
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
      <FormBuilder schema={devisSchema} onSubmit={handleSubmit} />
    </div>
  );
}
