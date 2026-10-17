export interface Midia {
    id: number
    type: string
    extension: string
    url: string
    reportId: number
}


export interface Report {
    id: number
    description: string
    details: string
    ocurrenceDate: Date,
    updatedAt: Date
    createdAt: Date
    midia: Midia[]
    location: string
    address: string | null
    status: ReportStatus
    statusComment: string;
    userId: number
    rejectReason: string;
    user: {
      id: number;
      name: string;
    }
}

export const ReportStatus = {
    PENDING: "PENDING",
    UNDER_REVIEW: "UNDER_REVIEW",
    REJECTED: "REJECTED",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    UNRESOLVED: "UNRESOLVED"
};

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export interface ReportFilters {
  status?: ReportStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateReportData {
  description: string;
  details: string;
  ocurrenceDate: Date;
  location: string;
  midia: FileList;
  user?: any;
}