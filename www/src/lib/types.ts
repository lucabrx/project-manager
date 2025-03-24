export type TUser = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
};

export type TToken = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
};

export type TWorkspace = {
  id: number;
  name: string;
  description: string;
  logo: string;
  owner: TUser;
  createdAt: string;
};

export type TLoginResponse = {
  user: TUser;
  token: TToken;
};

export type TWorkspaceResponse = {
  id: number;
  user: TUser;
  workspace: TWorkspace;
  role: string;
  status: string;
  joinedAt: string;
};

export type TProject = {
  id: number;
  owner: TUser;
  workspace: TWorkspace;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
};

export type TActivity = {
  id: number;
  user: TUser;
  type: string;
  content: string;
  createdAt: string;
};

export type TTask = {
  id: number;
  assignee: TUser | null;
  position: number;
  number: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  activities: TActivity[];
};

export type TTaskResponse = {
  content: TTask[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
