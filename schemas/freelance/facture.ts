const factureSchema = [
  {
    section: "Informations du freelance",
    fields: [
      { name: "freelance_name", label: "Nom", type: "text", required: true },
      { name: "freelance_company", label: "Entreprise", type: "text", required: false },
      { name: "freelance_address", label: "Adresse", type: "textarea", required: true },
      { name: "freelance_siret", label: "SIRET", type: "text", required: false },
      { name: "freelance_vat_number", label: "Numéro de TVA", type: "text", required: false },
      { name: "freelance_legal_footer", label: "Mentions légales", type: "textarea", required: false },
    ],
  },

  {
    section: "Informations client",
    fields: [
      { name: "client_name", label: "Nom du client", type: "text", required: true },
      { name: "client_company", label: "Entreprise du client", type: "text", required: false },
      { name: "client_address", label: "Adresse du client", type: "textarea", required: true },
      { name: "client_vat_number", label: "Numéro de TVA du client", type: "text", required: false },
    ],
  },

  {
    section: "Facture",
    fields: [
      { name: "invoice_number", label: "Numéro de facture", type: "text", required: true },
      { name: "invoice_date", label: "Date d'émission", type: "date", required: true },
      { name: "due_date", label: "Date d'échéance", type: "date", required: true },
    ],
  },

  {
    section: "Prestations",
    array: true,
    name: "lines",
    fields: [
      { name: "label", label: "Description", type: "text", required: true },
      { name: "quantity", label: "Quantité", type: "number", required: true },
      { name: "unit_price", label: "Prix unitaire HT (€)", type: "number", required: true },
      {
        name: "total_ht",
        label: "Total HT (€)",
        type: "number",
        compute: (item: any) => Number(item.quantity || 0) * Number(item.unit_price || 0),
      },
    ],
  },

  {
    section: "Totaux",
    fields: [
      { name: "tva_rate", label: "Taux de TVA (%)", type: "number", required: true },
    ],
  },

  {
    section: "Conditions de paiement",
    fields: [
      { name: "payment_terms", label: "Conditions de paiement", type: "textarea", required: true },
      { name: "payment_method", label: "Mode de paiement", type: "text", required: true },
    ],
  },
];

export default factureSchema;
