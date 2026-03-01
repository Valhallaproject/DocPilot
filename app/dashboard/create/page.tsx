"use client";

import { useState } from "react";
import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/* -------------------------------------------------------
   TYPES
------------------------------------------------------- */

type Item = {
  label: string;
  quantity: number;
  unit_price: number;
  total: number;
};

type FormData = {
  freelance_name: string;
  freelance_activity: string;
  freelance_address: string;
  freelance_zip: string;
  freelance_city: string;
  freelance_siret: string;
  freelance_email: string;
  freelance_phone: string;
  freelance_legal_notice: string;

  client_name: string;
  client_company: string;
  client_address: string;
  client_zip: string;
  client_city: string;
  client_email: string;

  devis_number: string;
  devis_date: string;
  valid_until: string;

  project_title: string;
  project_description: string;

  items: Item[];

  subtotal_ht: number;
  tva_rate: number;
  tva_amount: number;
  total_ttc: number;

  delivery_delay: string;
  payment_terms: string;
  deposit_percent: number;
  deposit_amount: number;

  signature_date: string;
};

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default function CreateDocumentPage() {
  const [form, setForm] = useState<FormData>({
    freelance_name: "",
    freelance_activity: "",
    freelance_address: "",
    freelance_zip: "",
    freelance_city: "",
    freelance_siret: "",
    freelance_email: "",
    freelance_phone: "",
    freelance_legal_notice: "",

    client_name: "",
    client_company: "",
    client_address: "",
    client_zip: "",
    client_city: "",
    client_email: "",

    devis_number: "",
    devis_date: new Date().toISOString().split("T")[0],
    valid_until: "",

    project_title: "",
    project_description: "",

    items: [
      { label: "", quantity: 1, unit_price: 0, total: 0 }
    ],

    subtotal_ht: 0,
    tva_rate: 20,
    tva_amount: 0,
    total_ttc: 0,

    delivery_delay: "",
    payment_terms: "",
    deposit_percent: 0,
    deposit_amount: 0,

    signature_date: new Date().toISOString().split("T")[0],
  });

  /* -------------------------------------------------------
     HELPERS
  ------------------------------------------------------- */

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = <K extends keyof Item>(index: number, key: K, value: Item[K]) => {
    const newItems = [...form.items];
    newItems[index][key] = value;

    // recalcul automatique
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price;

    const subtotal = newItems.reduce((acc, item) => acc + item.total, 0);
    const tva = (subtotal * form.tva_rate) / 100;
    const total = subtotal + tva;

    setForm({
      ...form,
      items: newItems,
      subtotal_ht: subtotal,
      tva_amount: tva,
      total_ttc: total,
      deposit_amount: (total * form.deposit_percent) / 100,
    });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { label: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const createDocument = async () => {
    await fetch("/api/documents", {
      method: "POST",
      body: JSON.stringify({
        template: "freelance/devis",
        data: form,
      }),
    });

    window.location.href = "/dashboard/documents";
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold mb-6">Créer un devis</h1>

      {/* FREELANCE */}
      <Card title="Informations Freelance">
        <Grid>
          <Input label="Nom" onChange={(e) => update("freelance_name", e.target.value)} />
          <Input label="Activité" onChange={(e) => update("freelance_activity", e.target.value)} />
          <Input label="Adresse" onChange={(e) => update("freelance_address", e.target.value)} />
          <Input label="Code postal" onChange={(e) => update("freelance_zip", e.target.value)} />
          <Input label="Ville" onChange={(e) => update("freelance_city", e.target.value)} />
          <Input label="SIRET" onChange={(e) => update("freelance_siret", e.target.value)} />
          <Input label="Email" onChange={(e) => update("freelance_email", e.target.value)} />
          <Input label="Téléphone" onChange={(e) => update("freelance_phone", e.target.value)} />
        </Grid>
      </Card>

      {/* CLIENT */}
      <Card title="Client">
        <Grid>
          <Input label="Nom" onChange={(e) => update("client_name", e.target.value)} />
          <Input label="Entreprise" onChange={(e) => update("client_company", e.target.value)} />
          <Input label="Adresse" onChange={(e) => update("client_address", e.target.value)} />
          <Input label="Code postal" onChange={(e) => update("client_zip", e.target.value)} />
          <Input label="Ville" onChange={(e) => update("client_city", e.target.value)} />
          <Input label="Email" onChange={(e) => update("client_email", e.target.value)} />
        </Grid>
      </Card>

      {/* DOCUMENT */}
      <Card title="Informations du devis">
        <Grid>
          <Input label="Numéro du devis" onChange={(e) => update("devis_number", e.target.value)} />
          <Input label="Date du devis" type="date" value={form.devis_date} onChange={(e) => update("devis_date", e.target.value)} />
          <Input label="Valable jusqu'au" type="date" onChange={(e) => update("valid_until", e.target.value)} />
          <Input label="Titre du projet" onChange={(e) => update("project_title", e.target.value)} />
        </Grid>

        <Textarea label="Description du projet" onChange={(e) => update("project_description", e.target.value)} />
      </Card>

      {/* ITEMS */}
      <Card title="Prestations">
        {form.items.map((item, i) => (
          <Grid key={i}>
            <Input label="Prestation" onChange={(e) => updateItem(i, "label", e.target.value)} />
            <Input label="Quantité" type="number" onChange={(e) => updateItem(i, "quantity", Number(e.target.value))} />
            <Input label="Prix unitaire" type="number" onChange={(e) => updateItem(i, "unit_price", Number(e.target.value))} />
          </Grid>
        ))}

        <button onClick={addItem} className="px-4 py-2 bg-gray-100 rounded-lg border">
          + Ajouter une prestation
        </button>
      </Card>

      {/* CONDITIONS */}
      <Card title="Conditions">
        <Grid>
          <Input label="Délai de livraison" onChange={(e) => update("delivery_delay", e.target.value)} />
          <Input label="Modalités de paiement" onChange={(e) => update("payment_terms", e.target.value)} />
          <Input label="Acompte (%)" type="number" onChange={(e) => update("deposit_percent", Number(e.target.value))} />
        </Grid>
      </Card>

      <button onClick={createDocument} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
        Créer le devis
      </button>
    </div>
  );
}



/* -------------------------------------------------------
   UI COMPONENTS
------------------------------------------------------- */

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

type InputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

function Input({ label, ...props }: InputProps) {
  return (
    <label className="flex flex-col text-sm font-medium">
      {label}
      <input {...props} className="border p-2 rounded-lg mt-1" />
    </label>
  );
}

type TextareaProps = {
  label: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea({ label, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col text-sm font-medium">
      {label}
      <textarea {...props} className="border p-2 rounded-lg mt-1 h-24" />
    </label>
  );
}

