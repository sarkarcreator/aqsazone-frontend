export interface ExportableLead {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  source?: string | null;
  status?: string | null;
  notes?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  let stringValue: string;

  if (value instanceof Date) {
    stringValue = value.toISOString();
  } else if (typeof value === "object") {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = String(value);
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadCsv(
  filename: string,
  headers: string[],
  rows: Record<string, unknown>[]
): void {
  const csv = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function downloadLeadsCSV(
  leads: ExportableLead[],
  filename = "leads.csv"
): void {
  const headers = [
    "id",
    "name",
    "email",
    "phone",
    "company",
    "service",
    "source",
    "status",
    "notes",
    "createdAt",
    "updatedAt",
  ];

  const rows = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    service: lead.service,
    source: lead.source,
    status: lead.status,
    notes: lead.notes,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }));

  downloadCsv(filename, headers, rows);
}

export function exportToCsv(
  filename: string,
  rows: Record<string, unknown>[]
): void {
  if (!rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  downloadCsv(filename, headers, rows);
}