export type LoginPayload = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
};

export type User = {
  id: number;
  email: string;
  username: string;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

export type RegisterResponse = {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};
