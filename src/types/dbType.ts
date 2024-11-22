export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  displayStatus: string | null;
  createdAt: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
  createdAt: string;
}

export interface ReactionType {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}