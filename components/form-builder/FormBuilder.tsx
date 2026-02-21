"use client";

import React, { useState } from "react";
import Field from "./Field";

interface FormBuilderProps {
  schema: any;
  onSubmit: (data: any) => void;
}

export default function FormBuilder({ schema, onSubmit }: FormBuilderProps) {
  const [formData, setFormData] = useState<any>({ items: [] });

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateGroupField = (group: string, name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [name]: value },
    }));
  };

  const addItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [...(prev.items || []), { label: "", quantity: 1, unit_price: 0 }],
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData((prev: any) => ({ ...prev, items: updated }));
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <h1 className="text-2xl font-bold">{schema.title}</h1>
      <p className="text-gray-600">{schema.description}</p>

      {schema.fields.map((field: any, index: number) => {
        // Groupe
        if (field.group) {
          return (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <h2 className="font-semibold mb-2">{field.label}</h2>

              {field.fields.map((sub: any, i: number) => (
                <Field
                  key={i}
                  field={sub}
                  value={formData[field.group]?.[sub.name] || ""}
                  onChange={(value) => updateGroupField(field.group, sub.name, value)}
                />
              ))}
            </div>
          );
        }

        // Tableau dynamique (items)
        if (field.type === "array") {
          return (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <h2 className="font-semibold mb-2">{field.label}</h2>

              {formData.items?.map((item: any, i: number) => (
                <div key={i} className="border p-3 rounded-md mb-3 bg-white">
                  {field.itemFields.map((sub: any, j: number) => (
                    <Field
                      key={j}
                      field={sub}
                      value={item[sub.name]}
                      onChange={(value) => updateItem(i, sub.name, value)}
                    />
                  ))}
                </div>
              ))}

              <button
                type="button"
                onClick={addItem}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                Ajouter une prestation
              </button>
            </div>
          );
        }

        // Champ simple
        return (
          <Field
            key={index}
            field={field}
            value={formData[field.name]}
            onChange={(value) => updateField(field.name, value)}
          />
        );
      })}

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md font-medium"
      >
        Générer le PDF
      </button>
    </form>
  );
}
