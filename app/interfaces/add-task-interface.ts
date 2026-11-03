export interface IAnalysisResponse {
  analysisId: string;
  status: string;
  sender: {
    userId: string;
    displayName: string;
    email?: string;
    role: string;
    hierarchyLevel: number;
  };
  proposals: ITaskProposal[];
}

export interface ITaskProposal {
  proposalId: string;
  title: string;
  description: string;
  sourceText?: string | null;
  predictedJobTitle: string;
  predictionStatus: string;
  predictionReason: string;
  suggestedDeadline?: string | null;
  status?: string;
  recommendation: IEmployeeRecommendation | null;
  recommendationMessage?: string | null;
}

export interface IEmployeeRecommendation {
  userId: string;
  displayName: string;
  email: string;
  jobTitle: string;
  role: string;
  hierarchyLevel: number;
  workload?: number;
  teamId?: string | null;
}

export interface IIntakeApiResponse {
  status: string;
  message?: string;
  analysisId: string;
  analysis?: {
    id?: string;
    source?: string;
    analysisStatus?: string;
    createdAt?: string;
  };
  sender?: IAnalysisResponse["sender"] | null;
  taskCount?: number;
  proposals: ITaskProposal[];
  error?: string;
}

export interface ISelectableEmployee {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: string;
  teamId: string | null;
}

export interface IEmailDraft {
  to: string;
  subject: string;
  body: string;
}
