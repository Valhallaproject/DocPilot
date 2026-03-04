const devisSchema = [
  {
    section: "Informations du devis",
    fields: [
      {
        name: "devis_number",
        label: "Numéro du devis",
        type: "text",
        placeholder: "2024-001",
        required: true,
      },
      {
        name: "devis_date",
        label: "Date du devis",
        type: "date",
        required: true,
      },
      {
        name: "valid_until",
        label: "Valable jusqu'au",
        type: "date",
        required: true,
      },
    ],
  },

  {
    section: "Informations du freelance",
    fields: [
      { name: "freelance_name", label: "Nom / Entreprise", type: "text", required: true },
      { name: "freelance_activity", label: "Activité", type: "text", required: true },
      { name: "freelance_address", label: "Adresse", type: "text", required: true },
      { name: "freelance_zip", label: "Code postal", type: "text", required: true },
      { name: "freelance_city", label: "Ville", type: "text", required: true },
      { name: "freelance_siret", label: "SIRET", type: "text" },
      { name: "freelance_email", label: "Email", type: "email", required: true },
      { name: "freelance_phone", label: "Téléphone", type: "text" },
      { name: "freelance_legal_notice", label: "Mentions légales", type: "textarea" },
    ],
  },

  {
    section: "Informations du client",
    fields: [
      { name: "client_name", label: "Nom du client", type: "text", required: true },
      { name: "client_company", label: "Entreprise (optionnel)", type: "text" },
      { name: "client_address", label: "Adresse", type: "text", required: true },
      { name: "client_zip", label: "Code postal", type: "text", required: true },
      { name: "client_city", label: "Ville", type: "text", required: true },
      { name: "client_email", label: "Email", type: "email" },
    ],
  },

  {
    section: "Détails du projet",
    fields: [
      { name: "project_title", label: "Titre du projet", type: "text", required: true },
      { name: "project_description", label: "Description", type: "textarea" },
    ],
  },

  {
    section: "Prestations",
    array: true,
    name: "items",
    fields: [
      { name: "label", label: "Description", type: "text", required: true },
      { name: "quantity", label: "Quantité", type: "number", required: true },
      { name: "unit_price", label: "Prix unitaire HT (€)", type: "number", required: true },

      // 🟦 Nouveau : total HT par ligne
      {
        name: "total_ht",
        label: "Total HT (€)",
        type: "number",
        readOnly: true,
        compute: (item: Record<string, any>) => {
          const q = Number(item.quantity || 0);
          const p = Number(item.unit_price || 0);
          return q * p;
        },
      },
    ],
  },

  {
    section: "TVA",
    fields: [
      {
        name: "tva_rate",
        label: "Taux de TVA (%)",
        type: "number",
        default: 20,
        required: true,
      },
    ],
  },

  {
    section: "Totaux",
    fields: [
      // 🟦 Nouveau : total HT global
      {
        name: "total_ht_global",
        label: "Total HT (€)",
        type: "number",
        readOnly: true,
        compute: (values: Record<string, any>) => {
          if (!values.items) return 0;
          return values.items.reduce((sum: number, item: Record<string, any>) => {
            const q = Number(item.quantity || 0);
            const p = Number(item.unit_price || 0);
            return sum + q * p;
          }, 0);
        },
      },

      // 🟦 Nouveau : total TTC
      {
        name: "total_ttc",
        label: "Total TTC (€)",
        type: "number",
        readOnly: true,
        compute: (values: Record<string, any>) => {
          const ht = Number(values.total_ht_global || 0);
          const tva = Number(values.tva_rate || 0);
          return ht + (ht * tva) / 100;
        },
      },
    ],
  },

  {
    section: "Conditions",
    fields: [
      { name: "delivery_delay", label: "Délais de réalisation", type: "text" },
      { name: "payment_terms", label: "Modalités de paiement", type: "text" },
      { name: "deposit_percent", label: "Acompte (%)", type: "number" },

      // 🟦 Nouveau : montant de l'acompte
      {
        name: "deposit_amount",
        label: "Montant de l'acompte (€)",
        type: "number",
        readOnly: true,
        compute: (values: Record<string, any>) => {
          const pct = Number(values.deposit_percent || 0);
          const ht = Number(values.total_ht_global || 0);
          return (ht * pct) / 100;
        },
      },

      { name: "signature_date", label: "Date de signature", type: "date" },
    ],
  },
];

export default devisSchema;
