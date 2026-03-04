"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import devisSchema from "@/schemas/freelance/devis";
import factureSchema from "@/schemas/freelance/facture";
import contratSchema from "@/schemas/freelance/contrat";

import FormBuilder from "@/components/form-builder/FormBuilder";
import { FileText, Receipt, FileSignature } from "lucide-react";

const SCHEMAS: Record<string, any> = {
  devis: devisSchema,
  facture: factureSchema,
  contrat: contratSchema,
};

export default function CreateDocumentPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [schema, setSchema] = useState<any | null>(null);

  useEffect(() => {
    if (!type) return;
    setSchema(SCHEMAS[type] || null);
  }, [type]);

  // PAGE DE SÉLECTION
  if (!type) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Créer un document</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* DEVIS */}
          <a
            href="/dashboard/create?type=devis"
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition p-4 flex flex-col gap-4"
          >
            <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
              <img
                src="/templates/devis.png"
                alt="Aperçu du devis"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
                <FileText size={26} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Devis</h2>
                <p className="text-gray-500 text-lg">Créer un devis professionnel</p>
              </div>
            </div>
          </a>

          {/* FACTURE */}
          <a
            href="/dashboard/create?type=facture"
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition p-4 flex flex-col gap-4"
          >
            <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
              <img
                src="/templates/facture.png"
                alt="Aperçu de la facture"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
                <Receipt size={26} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Facture</h2>
                <p className="text-gray-500 text-lg">Générer une facture complète</p>
              </div>
            </div>
          </a>

          {/* CONTRAT */}
          <a
            href="/dashboard/create?type=contrat"
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-purple-300 transition p-4 flex flex-col gap-4"
          >
            <div className="w-full aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
              <img
                src="/templates/contrat.png"
                alt="Aperçu du contrat"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
                <FileSignature size={26} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Contrat</h2>
                <p className="text-gray-500 text-lg">Créer un contrat professionnel</p>
              </div>
            </div>
          </a>

        </div>
      </div>
    );
  }

  // TYPE INVALIDE
  if (!schema) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Type de document inconnu</h1>
        <p className="text-gray-600 mt-2">Le type "{type}" n'existe pas.</p>
        <a href="/dashboard/create" className="text-blue-600 underline mt-4 block">
          Retour
        </a>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: type,
        data: formData,
      }),
    });

    if (!res.ok) {
      console.error("Erreur API:", await res.text());
      return;
    }

    window.location.href = "/dashboard/documents";
  };

  // PAGE DE CRÉATION — DESIGN PREMIUM
  return (
    <div className="flex flex-col h-full p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Créer un {type}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Remplissez les informations ci-dessous pour générer votre document.
          </p>
        </div>

        <a
          href="/dashboard/create"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Retour
        </a>
      </div>

      {/* FORMULAIRE */}
      <div className="flex-1">
        <FormBuilder schema={schema} template={type} onSubmit={handleSubmit} />
      </div>

      {/* FOOTER FIXE */}
      <div className="  p-4 mt-8 flex justify-center">
        <button
          form="form"
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Générer le PDF
        </button>
      </div>

    </div>
  );
}
