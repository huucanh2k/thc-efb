export type AccountStatus = "Available" | "Pending" | "Sold";

export interface Email {
  id: string;
  email_address: string;
  password: string;
  recovery_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  title: string;
  purchase_price: number;
  selling_price: number;
  images: string[];
  primary_image_url: string | null;
  status: AccountStatus;
  total_gp: number;
  total_coins_android: number;
  total_coins_ios: number;
  team_strength: number;
  email_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicAccount {
  id: string;
  title: string;
  selling_price: number;
  images: string[];
  primary_image_url: string | null;
  status: AccountStatus;
  total_gp: number;
  total_coins_android: number;
  total_coins_ios: number;
  team_strength: number;
  created_at: string;
}

export interface AccountWithEmail extends Account {
  emails?: Email | null;
}

export interface DashboardMetrics {
  totalAccounts: number;
  availableAccounts: number;
  soldAccounts: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}
