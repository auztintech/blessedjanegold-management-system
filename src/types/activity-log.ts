export type ActivityType = "SALE" | "TRANSFER" | "ADD" | "REMOVE";

export interface ActivityLogItem {
  type: ActivityType;
  description: string;
  product: string;
  quantity: number;
  actor: string;
  timestamp: string;
}

export interface ActivityLogResponse {
  count: number;
  limit: number;
  offset: number;
  results: ActivityLogItem[];
}
