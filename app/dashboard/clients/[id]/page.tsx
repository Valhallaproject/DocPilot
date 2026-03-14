import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FileText, Receipt, FileSignature } from "./ClientIcons";
import { ArrowLeft } from "lucide-react";

export default async function ClientPage(props: any) {
  console.log(">>> ROUTE CLIENT LOADED");
  console.log("PROPS :", props);

  // Next.js 16 : params est un ReactPromise → on l'attend
  const resolved = await props.params;

  console.log("RESOLVED :", resolved);

  // resolved contient directement { id: "..." }
  const { id } = resolved;

  console.log("ID FINAL :", id);

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) return notFound();

  return (
    <div className="p-10 space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{client.companyName}</h1>
          <p className="text-gray-500 text-lg mt-1">{client.contactName}</p>
        </div>

        <a
            href="/dashboard/clients"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
            <ArrowLeft size={18} />
            Retour
            </a>

      </div>

      {/* INFO CLIENT */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Informations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Entreprise :</strong> {client.companyName}</p>
          <p><strong>Contact :</strong> {client.contactName}</p>
          <p><strong>Email :</strong> {client.email}</p>
          <p><strong>Téléphone :</strong> {client.phone || "—"}</p>
          <p><strong>Adresse :</strong> {client.address}</p>
          <p><strong>Ville :</strong> {client.zip} {client.city}</p>
          <p><strong>Pays :</strong> {client.country}</p>
          <p><strong>SIRET :</strong> {client.siret || "—"}</p>
          <p><strong>TVA :</strong> {client.vatNumber || "—"}</p>
        </div>
      </div>

      {/* NOTES */}
      {client.notes && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
        </div>
      )}

      {/* DOCUMENTS LIÉS */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Documents liés</h2>

        <p className="text-gray-500">Aucun document lié pour le moment.</p>

        <div className="flex gap-4 mt-4">
          <a
            href={`/dashboard/create?type=devis&client=${client.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          >
            <FileText size={18} /> Nouveau devis
          </a>

          <a
            href={`/dashboard/create?type=facture&client=${client.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <Receipt size={18} /> Nouvelle facture
          </a>

          <a
            href={`/dashboard/create?type=contrat&client=${client.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
          >
            <FileSignature size={18} /> Nouveau contrat
          </a>
        </div>
      </div>

    </div>
  );
}
