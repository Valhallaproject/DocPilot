"use client";

import FormBuilder from "@/components/form-builder/FormBuilder";
import devisSchema from "@/schemas/freelance/devis";

export default function GenerateDevisPage() {
  const handleSubmit = async (data: any) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        template: "devis", // ← important
        data,
      }),
    });

    const blob = await res.blob();
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