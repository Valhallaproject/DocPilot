"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import devisSchema from "@/schemas/freelance/devis";
import factureSchema from "@/schemas/freelance/facture";
import contratSchema from "@/schemas/freelance/contrat";

import FormBuilder from "@/components/form-builder/FormBuilder";
import { FileText, Receipt, FileSignature } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const SCHEMAS: Record<string, any> = {
  devis: devisSchema,
  facture: factureSchema,
  contrat: contratSchema,
};

export default function CreateDocumentPage() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as string) || "devis";
  const clientIdFromUrl = searchParams.get("client");

  const [schema, setSchema] = useState<any | null>(null);

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [openClientSelect, setOpenClientSelect] = useState(false);

  const [initialValues, setInitialValues] = useState<any>({});

  // Charger la liste des clients
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data || []))
      .catch(() => setClients([]));
  }, []);

  // Charger le schéma selon le type
  useEffect(() => {
    setSchema(SCHEMAS[type] || null);
  }, [type]);

  // Mapping utilitaires pour initialValues (correspondent aux field.name des schemas)
  function mapClientToInitialValuesForDevis(client: any) {
    if (!client) return {};
    return {
      client_name: client.contactName ?? "",
      client_company: client.companyName ?? "",
      client_address: client.address ?? "",
      client_zip: client.zip ?? "",
      client_city: client.city ?? "",
      client_email: client.email ?? "",
      items:
        client.items && client.items.length
          ? client.items.map((it: any) => ({
              label: it.label ?? "",
              quantity: it.quantity ?? 1,
              unit_price: it.unit_price ?? 0,
              total_ht: Number(it.quantity || 0) * Number(it.unit_price || 0),
            }))
          : [{ label: "", quantity: 1, unit_price: 0, total_ht: 0 }],
      tva_rate: client.tva_rate ?? 20,
      deposit_percent: client.deposit_percent ?? 0,
      signature_date: client.signature_date ?? "",
    };
  }

  function mapClientToInitialValuesForFacture(client: any) {
    if (!client) return {};
    return {
      client_name: client.contactName ?? "",
      client_company: client.companyName ?? "",
      client_address: client.address ?? "",
      client_vat_number: client.vatNumber ?? "",
      lines:
        client.lines && client.lines.length
          ? client.lines.map((l: any) => ({
              label: l.label ?? "",
              quantity: l.quantity ?? 1,
              unit_price: l.unit_price ?? 0,
              total_ht: Number(l.quantity || 0) * Number(l.unit_price || 0),
            }))
          : [{ label: "", quantity: 1, unit_price: 0, total_ht: 0 }],
      tva_rate: client.tva_rate ?? 20,
      payment_terms: client.payment_terms ?? "",
      payment_method: client.payment_method ?? "",
    };
  }

  function mapClientToInitialValuesForContrat(client: any) {
    if (!client) return {};
    return {
      client_name: client.contactName ?? "",
      client_company: client.companyName ?? "",
      client_address: client.address ?? "",
      client_email: client.email ?? "",
      mission_title: client.mission_title ?? "",
      mission_description: client.mission_description ?? "",
      start_date: client.start_date ?? "",
      end_date: client.end_date ?? "",
      price_ht: client.price_ht ?? 0,
      tva_rate: client.tva_rate ?? 20,
      payment_terms: client.payment_terms ?? "",
      confidentiality_clause: client.confidentiality_clause ?? "",
      ip_clause: client.ip_clause ?? "",
      termination_notice: client.termination_notice ?? 0,
      jurisdiction_city: client.jurisdiction_city ?? "",
      contract_city: client.contract_city ?? "",
      contract_date: client.contract_date ?? "",
    };
  }

  // Initialise selectedClient / initialValues depuis l'URL si présent
  useEffect(() => {
    if (!clientIdFromUrl) return;

    if (clients && clients.length > 0) {
      const found = clients.find((c) => String(c.id) === String(clientIdFromUrl));
      if (found) {
        setSelectedClient(found);
        const mapped =
          type === "devis"
            ? mapClientToInitialValuesForDevis(found)
            : type === "facture"
            ? mapClientToInitialValuesForFacture(found)
            : mapClientToInitialValuesForContrat(found);
        setInitialValues(mapped);
        return;
      }
    }

    // Fallback : fetch individuel
    fetch(`/api/clients/${clientIdFromUrl}`)
      .then((res) => {
        if (!res.ok) throw new Error("Client non trouvé");
        return res.json();
      })
      .then((client) => {
        setSelectedClient(client);
        const mapped =
          type === "devis"
            ? mapClientToInitialValuesForDevis(client)
            : type === "facture"
            ? mapClientToInitialValuesForFacture(client)
            : mapClientToInitialValuesForContrat(client);
        setInitialValues(mapped);
      })
      .catch(() => {});
  }, [clientIdFromUrl, clients, type]);

  // Quand l'utilisateur choisit un client via le popover
  function handleSelectClient(client: any) {
    setSelectedClient(client);
    setOpenClientSelect(false);

    const mapped =
      type === "devis"
        ? mapClientToInitialValuesForDevis(client)
        : type === "facture"
        ? mapClientToInitialValuesForFacture(client)
        : mapClientToInitialValuesForContrat(client);

    setInitialValues(mapped);
  }

  // Submit handler (à adapter selon ton API)
  const handleSubmit = async (data: any) => {
    // Exemple : POST /api/documents
    // await fetch("/api/documents", { method: "POST", body: JSON.stringify({ type, data }) });
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {type === "devis" && <FileText size={28} />}
          {type === "facture" && <Receipt size={28} />}
          {type === "contrat" && <FileSignature size={28} />}
          <div>
            <h1 className="text-2xl font-bold">
              {type === "devis" ? "Créer un devis" : type === "facture" ? "Créer une facture" : "Créer un contrat"}
            </h1>
            {selectedClient && <p className="text-sm text-gray-600 mt-1">{selectedClient.companyName}</p>}
          </div>
        </div>
      </div>

      {/* SÉLECTION CLIENT */}
      <div className="mb-6">
        <label className="text-sm font-medium">Client</label>

        <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between mt-1">
              {selectedClient ? selectedClient.companyName : "Sélectionner un client"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-[400px]">
            <Command>
              <CommandInput placeholder="Rechercher un client..." />

              <CommandList>
                <CommandEmpty>Aucun client trouvé.</CommandEmpty>

                <CommandGroup heading="Clients">
                  {clients.map((client: any) => (
                    <CommandItem
                      key={client.id}
                      value={client.companyName}
                      onSelect={() => handleSelectClient(client)}
                    >
                      {client.companyName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* FORMULAIRE */}
      <div className="flex-1">
        <FormBuilder schema={schema} template={type} onSubmit={handleSubmit} initialValues={initialValues} />
      </div>

      {/* FOOTER FIXE */}
      <div className="p-4 mt-8 flex justify-center">
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
