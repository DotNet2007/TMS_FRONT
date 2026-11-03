export interface IRole {
  id: string;
  name: string;
}

export interface IJobTitle {
  id: string;
  name: string;
}

export interface IProfile {
  id: string;

  // API fields
  fullName: string;
  email: string;
  role: string;
  roleName: string;
  jobTitle: IJobTitle | string;
  phoneNumber?: string;
  bio: string;

  // Account page fields
  firstName: string;
  lastName: string;
  phone: string;
}