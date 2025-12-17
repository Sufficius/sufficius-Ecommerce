export interface DashboardStat {
  id: number;
  title: string;
  value: string | number;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<any>;
  description: string;
}

export interface QuickStat {
  label: string;
  value: number;
  color: string;
}

export interface RecentExam {
  id: number;
  patient: string;
  exam: string;
  status: string;
  time: string;
  type: "complete" | "progress" | "pending";
}

export interface Alert {
  id: number;
  type: "error" | "warning" | "info";
  message: string;
  priority: "high" | "medium" | "low";
}

export interface DashboardData {
  overview: DashboardStat[];
  quickStats: QuickStat[];
  recentExams: RecentExam[];
  alerts: Alert[];
}

// Dados mock para o dashboard
export const MOCK_DASHBOARD_DATA: DashboardData = {
  overview: [],
  quickStats: [],
  recentExams: [],
  alerts: []
};
