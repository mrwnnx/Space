const BASE_URL = process.env.IBERIS_BASE_URL || "https://api.iberis.io";
const COMPANY_ID = process.env.IBERIS_COMPANY_ID || "Vlgo";
const BEARER_TOKEN =
  process.env.IBERIS_BEARER_TOKEN ||
  "$2y$10$oUH7dZIgwVvYVHdEHwNzaubYT0dySfIIMCs74Kji3c8LqOIBOv.9G";
const LANG = process.env.IBERIS_LANG || "fr";

function buildUrl(endpoint: string): string {
  return `${BASE_URL}/${LANG}/api/public/company/${COMPANY_ID}/${endpoint}`;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(buildUrl(endpoint), { headers: headers() });
  if (!res.ok) throw new Error(`GET ${endpoint} → ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(endpoint), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} → ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const iberis = {
  // Clients
  clients: {
    list: () => get("clients"),
    get: (id: string) => get(`clients/${id}`),
    create: (data: unknown) => post("clients", data),
  },

  // Invoices
  invoices: {
    list: () => get("invoices"),
    get: (id: string) => get(`invoices/${id}`),
    create: (data: unknown) => post("invoices", data),
  },

  // Quotes / Devis
  quotes: {
    list: () => get("estimates"),
    get: (id: string) => get(`estimates/${id}`),
    create: (data: unknown) => post("estimates", data),
  },

  // Products / Articles
  items: {
    list: () => get("items"),
    get: (id: string) => get(`items/${id}`),
    create: (data: unknown) => post("items", data),
  },

  // Payments
  payments: {
    list: () => get("payments"),
    get: (id: string) => get(`payments/${id}`),
    create: (data: unknown) => post("payments", data),
  },

  // Company info
  company: {
    get: () => get("company"),
  },
};

export { get, post, buildUrl };
