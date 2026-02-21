"use client";

import React from "react";

interface FieldProps {
  field: any;
  value: any;
  onChange: (value: any) => void;
}

export default function Field({ field, value, onChange }: FieldProps) {
  const commonProps = {
    id: field.name,
    name: field.name,
    value: value || "",
    onChange: (e: any) => onChange(e.target.value),
    className:
      "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  };

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "date":
      return (
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor={field.name} className="font-medium text-sm">
            {field.label}
          </label>
          <input type={field.type} placeholder={field.placeholder} {...commonProps} />
        </div>
      );

    case "textarea":
      return (
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor={field.name} className="font-medium text-sm">
            {field.label}
          </label>
          <textarea
            placeholder={field.placeholder}
            {...commonProps}
            rows={4}
          />
        </div>
      );

    default:
      return null;
  }
}
