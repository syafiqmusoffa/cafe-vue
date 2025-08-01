export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  status: boolean
  role: "admin" | "cashier";
}

export interface CreateUserDTO {
  name: string;
  username: string;
  password: string;
  role: "cashier";
}
