/* Centralized client for the Social Media Growth API.
 * Pages import these functions; HTTP calls and token handling live here only.
 */

export const SOCIAL_PLATFORMS = [
  "FACEBOOK",
  "INSTAGRAM",
  "X",
  "YOUTUBE",
  "TIKTOK",
  "LINKEDIN",
  "WHATSAPP_CHANNEL",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type CollectionMethod = "API" | "MANUAL" | "UNAVAILABLE";

export type MyAccess = {
  userId: string;
  role: string;
  canAccess: boolean;
  isAdministrator: boolean;
  isSuperSupervisor: boolean;
};

export type AccessRecord = {
  id: string;
  userId: string;
  canAccess: boolean;
  isAdministrator: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    role?: { code: string; name: string };
  };
  grantedBy?: { id: string; fullName: string } | null;
};

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  displayName: string;
  accountUrl: string;
  externalAccountId?: string | null;
  isActive: boolean;
  lastAttemptAt?: string | null;
  lastSuccessAt?: string | null;
  lastError?: string | null;
  createdAt?: string;
  snapshots?: SocialSnapshot[];
};

export type MetricDefinition = {
  id: string;
  platform: SocialPlatform;
  key: string;
  name: string;
  description?: string | null;
  unit: string;
  collectionMethod: CollectionMethod;
  isActive: boolean;
  createdAt?: string;
};

export type SocialSnapshot = {
  id: string;
  socialAccountId?: string;
  metricDefinitionId: string;
  value: number | string;
  collectedAt: string;
  source: string;
  metricDefinition?: MetricDefinition;
};

export type DashboardMetric = {
  metric: Pick<
    MetricDefinition,
    "id" | "key" | "name" | "unit" | "collectionMethod"
  >;
  currentValue: number;
  previousValue: number | null;
  change: number | null;
  changePercent: number | null;
  collectedAt: string;
  source: string;
};

export type DashboardAccount = Pick<
  SocialAccount,
  | "id"
  | "platform"
  | "displayName"
  | "accountUrl"
  | "lastAttemptAt"
  | "lastSuccessAt"
  | "lastError"
> & { metrics: DashboardMetric[] };

export type SocialDashboard = {
  generatedAt: string;
  accounts: DashboardAccount[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const ROOT = "/social-growth";

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("userToken");
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${ROOT}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error(
      "Could not connect to the server. Check the API URL and network.",
    );
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!response.ok) {
    const body = payload as {
      message?: string | string[];
      error?: string;
    } | null;
    const message = Array.isArray(body?.message)
      ? body?.message.join(" ")
      : body?.message ||
        body?.error ||
        (typeof payload === "string" ? payload : null);
    if (response.status === 401)
      throw new Error(
        message || "Your session has expired. Please sign in again.",
      );
    if (response.status === 403)
      throw new Error(
        message || "You do not have permission to perform this action.",
      );
    throw new Error(message || `Request failed (${response.status}).`);
  }
  return payload as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export const socialGrowthApi = {
  getMyAccess: () => request<MyAccess>("/access/me"),
  listAccess: () => request<AccessRecord[]>("/access"),
  setAccess: (
    userId: string,
    body: { canAccess: boolean; isAdministrator?: boolean },
  ) =>
    request<{
      message: string;
      target: { id: string; fullName: string };
      access: AccessRecord;
    }>(`/access/${encodeURIComponent(userId)}`, json("PUT", body)),

  getDashboard: () => request<SocialDashboard>("/dashboard"),
  listAccounts: () => request<SocialAccount[]>("/accounts"),
  createAccount: (body: {
    platform: SocialPlatform;
    displayName: string;
    accountUrl: string;
    externalAccountId?: string;
  }) => request<SocialAccount>("/accounts", json("POST", body)),
  updateAccount: (
    id: string,
    body: {
      displayName?: string;
      accountUrl?: string;
      externalAccountId?: string | null;
      isActive?: boolean;
    },
  ) =>
    request<SocialAccount>(
      `/accounts/${encodeURIComponent(id)}`,
      json("PATCH", body),
    ),

  listMetrics: (platform?: SocialPlatform | "") =>
    request<MetricDefinition[]>(
      `/metrics${platform ? `?platform=${encodeURIComponent(platform)}` : ""}`,
    ),
  createMetric: (body: {
    platform: SocialPlatform;
    key: string;
    name: string;
    description?: string;
    unit?: string;
    collectionMethod?: CollectionMethod;
  }) => request<MetricDefinition>("/metrics", json("POST", body)),
  updateMetric: (
    id: string,
    body: {
      name?: string;
      description?: string | null;
      unit?: string;
      collectionMethod?: CollectionMethod;
      isActive?: boolean;
    },
  ) =>
    request<MetricDefinition>(
      `/metrics/${encodeURIComponent(id)}`,
      json("PATCH", body),
    ),

  listSnapshots: (accountId: string) =>
    request<SocialSnapshot[]>(
      `/accounts/${encodeURIComponent(accountId)}/snapshots`,
    ),
  createSnapshot: (
    accountId: string,
    body: { metricDefinitionId: string; value: number; collectedAt?: string },
  ) =>
    request<SocialSnapshot>(
      `/accounts/${encodeURIComponent(accountId)}/snapshots`,
      json("POST", body),
    ),
};
