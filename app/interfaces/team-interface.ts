import { IJobTitle, IRole } from "./profile-interface";

export interface ITeamMember {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;

  role: IRole;

  jobTitle: IJobTitle
}

export interface ITeamMembersResponse {
  data: ITeamMember[];
}


export interface ITeamMemberResponseDetails {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
  
  role: IRole;

  jobTitle: IJobTitle

  memberships: unknown[];
}