export type Lang = "ar" | "en";

export interface UsageUser {
  user_id: string;
  user_email?: string | null;
  requests: number;
  prompt_tokens: number;
  response_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  average_duration_seconds: number | null;
}

export interface UsageEvent {
  timestamp: string;
  request_id?: string | null;
  user_id: string;
  user_email?: string | null;
  endpoint?: string | null;
  stage: string;
  model: string;
  duration_seconds: number;
  prompt_tokens?: number | null;
  response_tokens?: number | null;
  thoughts_tokens?: number | null;
  cached_tokens?: number | null;
  total_tokens?: number | null;
  estimated_cost_usd?: number | null;
  usage_available: boolean;
  status: string;
}

export interface UsageResponse {
  period_days: number;
  generated_at: string;
  summary: {
    api_calls: number;
    users: number;
    total_tokens: number;
    estimated_cost_usd: number;
    average_duration_seconds: number | null;
    pricing_configured: boolean;
  };
  users: UsageUser[];
  events: UsageEvent[];
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface UsageFilters {
  userId: string;
  model: string;
  operation: string;
  status: string;
  from: string;
  to: string;
}

export interface UsageQueryParams extends UsageFilters {
  days: string;
  page: number;
  limit: number;
}
